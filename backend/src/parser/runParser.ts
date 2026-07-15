import path from "path";
import { PrismaClient, Prisma } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { parseSenasa } from "./parseSenasa";
import { parseArca } from "./parseArca";
import { parseBcra } from "./parseBcra";
import { loadProvincias } from "./loadProvinces.js";
import { pickBestSenasaRecord } from "@/utils/excelNormalizers.js";

// En Render las variables vienen inyectadas.
if (!process.env.DATABASE_URL) {
    try { process.loadEnvFile(); } catch {}
}

const { DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DATABASE_URL } = process.env;
const connectionString =
    DATABASE_URL ||
    `postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}`;

// Render expone la DB externa por TLS; la interna y localhost no la requieren.
const needsSsl = /\.render\.com|sslmode=require/.test(connectionString);
const adapter = new PrismaPg({
    connectionString,
    max: 5,
    connectionTimeoutMillis: 30_000,
    statement_timeout: 120_000,
    ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
});
const prisma = new PrismaClient({ adapter });

const CHUNK = 1000;

function chunk<T>(arr: T[], size: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

// Trunca un string al largo máximo de su columna; evita que una fila corrupta
// rompa el lote entero de createMany.
function trunc(value: string | null | undefined, max: number): string | null {
    if (value == null) return null;
    const s = String(value);
    return s.length > max ? s.slice(0, max) : s;
}

// Inserta filas en lotes con createMany, mostrando progreso.
async function insertInChunks<T>(
    label: string,
    rows: T[],
    insert: (batch: T[]) => Promise<{ count: number }>,
): Promise<void> {
    if (rows.length === 0) { console.log(`  ${label}: 0`); return; }
    let attempted = 0;
    let inserted = 0;
    for (const batch of chunk(rows, CHUNK)) {
        const { count } = await insert(batch);
        attempted += batch.length;
        inserted += count;
        console.log(`  ${label}: ${attempted}/${rows.length} (insertados nuevos: ${inserted})`);
    }
}

async function loadData(
    senasaPath: string,
    arcaPath: string,
    bcraPath: string
): Promise<void> {
    const { records: senasaRecords, result: senasaResult } = parseSenasa(senasaPath);
    const { records: arcaRecords, result: arcaResult } = parseArca(arcaPath);
    const { records: bcraRecords, result: bcraResult } = parseBcra(bcraPath);

    console.log(`\nSENASA — total: ${senasaResult.totalRows} | parseados: ${senasaResult.parsedRows} | skipped: ${senasaResult.skippedRows} | ${senasaResult.durationMs}ms`);
    console.log(`ARCA   — total: ${arcaResult.totalRows} | parseados: ${arcaResult.parsedRows} | skipped: ${arcaResult.skippedRows} | ${arcaResult.durationMs}ms`);
    console.log(`BCRA   — total: ${bcraResult.totalRows} | parseados: ${bcraResult.parsedRows} | skipped: ${bcraResult.skippedRows} | ${bcraResult.durationMs}ms`);

    const estadoLead = await prisma.estados_lead.findFirst({
        where: { nombre: "Lead" },
    });

    if (!estadoLead) {
        throw new Error("Estado 'Lead' no encontrado en la BD. Corre el seed primero.");
    }

    const senasaMap = new Map<string, typeof senasaRecords[0][]>();
    for (const r of senasaRecords) {
        const existing = senasaMap.get(r.cuit) ?? [];
        existing.push(r);
        senasaMap.set(r.cuit, existing);
    }

    const arcaMap = new Map(arcaRecords.map((r) => [r.cuit, r]));

    const bcraSet = new Set(bcraRecords.map(r => r.cuit));
    const arcaSet = new Set(arcaRecords.map(r => r.cuit));
    const matches = [...arcaSet].filter(cuit => bcraSet.has(cuit));
    console.log(`ARCA CUITs: ${arcaSet.size} | matches con BCRA: ${matches.length}`);

    const consolidados = bcraRecords.map((bcra) => ({
        cuit: bcra.cuit,
        senasa: senasaMap.get(bcra.cuit) ?? null,
        arca: arcaMap.get(bcra.cuit) ?? null,
        bcra,
    })).filter(c => c.senasa !== null);

    console.log(`\nCUITs consolidados: ${consolidados.length}`);

    // Descartamos los que tienen baja y deduplicamos por CUIT: createMany no
    // tolera duplicados dentro del mismo lote.
    const seenCuit = new Set<string>();
    const validos = consolidados
        .filter((c) => {
            if (c.senasa?.some((s) => s.fecha_baja !== null)) return false;
            if (seenCuit.has(c.cuit)) return false;
            seenCuit.add(c.cuit);
            return true;
        })
        .map((c) => ({ ...c, principal: pickBestSenasaRecord(c.senasa ?? []) }));
    const descartados = consolidados.length - validos.length;
    console.log(`Válidos: ${validos.length} | descartados/duplicados: ${descartados}\n`);

    // 1) EMPRESAS
    const empresaRows: Prisma.empresasCreateManyInput[] = validos.map((c) => ({
        nombre_empresa:
            trunc(c.principal?.nombre_establecimiento ?? c.arca?.denominacion ?? c.bcra.denominacion, 200) ?? "(sin nombre)",
        cuit: trunc(c.cuit, 20)!,
        localidad: trunc(c.principal?.localidad ?? null, 100),
        direccion: c.principal?.direccion ?? null,
        latitud: c.principal?.latitud ?? null,
        longitud: c.principal?.longitud ?? null,
        superficie: c.principal?.superficie ?? null,
        tipo_explotacion: trunc(c.principal?.tipo_explotacion ?? null, 5),
        renspa: trunc(c.principal?.renspa ?? null, 50),
    }));
    console.log("Insertando empresas...");
    await insertInChunks("empresas", empresaRows, (b) =>
        prisma.empresas.createMany({ data: b, skipDuplicates: true }),
    );

    // Resolvemos id_empresa por CUIT para las tablas hijas.
    const idByCuit = new Map<string, number>();
    for (const batch of chunk(validos.map((c) => c.cuit), CHUNK)) {
        const found = await prisma.empresas.findMany({
            where: { cuit: { in: batch } },
            select: { id_empresa: true, cuit: true },
        });
        for (const e of found) idByCuit.set(e.cuit, e.id_empresa);
    }
    console.log(`Empresas con id resuelto: ${idByCuit.size}\n`);

    // 2) SENASA (dedup por renspa, que es único)
    const seenRenspa = new Set<string>();
    const senasaRows: Prisma.senasaCreateManyInput[] = [];
    for (const c of validos) {
        const id = idByCuit.get(c.cuit);
        if (id == null || !c.senasa) continue;
        for (const s of c.senasa) {
            if (!s.renspa || seenRenspa.has(s.renspa)) continue;
            seenRenspa.add(s.renspa);
            senasaRows.push({
                id_empresa: id,
                renspa: trunc(s.renspa, 50)!,
                titular: trunc(s.titular, 200),
                superficie: s.superficie,
                tipo_explotacion: trunc(s.tipo_explotacion, 5),
                nombre_establecimiento: trunc(s.nombre_establecimiento, 200),
                fecha_baja: s.fecha_baja,
                fecha_consulta: s.fecha_consulta,
                poligono: s.poligono,
            });
        }
    }
    console.log("Insertando senasa...");
    await insertInChunks("senasa", senasaRows, (b) =>
        prisma.senasa.createMany({ data: b, skipDuplicates: true }),
    );

    // 3) ARCA (uno por CUIT)
    const arcaRows: Prisma.arcaCreateManyInput[] = validos.flatMap((c) => {
        const id = idByCuit.get(c.cuit);
        if (id == null || !c.arca) return [];
        return [{
            id_empresa: id,
            cuit: trunc(c.cuit, 20)!,
            denominacion: trunc(c.arca.denominacion, 200),
            imp_ganancias: trunc(c.arca.imp_ganancias, 10),
            imp_iva: trunc(c.arca.imp_iva, 10),
            monotributo: trunc(c.arca.monotributo, 10),
            empleador: trunc(String(c.arca.empleador), 5),
            actividad_codigo: trunc(c.arca.actividad_codigo, 20),
        }];
    });
    console.log("Insertando arca...");
    await insertInChunks("arca", arcaRows, (b) =>
        prisma.arca.createMany({ data: b, skipDuplicates: true }),
    );

    // 4) BCRA (uno por CUIT)
    const bcraRows: Prisma.bcraCreateManyInput[] = validos.flatMap((c) => {
        const id = idByCuit.get(c.cuit);
        if (id == null) return [];
        return [{
            id_empresa: id,
            cuit: trunc(c.cuit, 20)!,
            denominacion: trunc(c.bcra.denominacion, 200),
            situacion_crediticia: c.bcra.situacion_peor,
            periodo: trunc(String(c.bcra.periodo), 10),
            proceso_judicial: false,
            fecha_consulta: c.bcra.fecha_consulta,
        }];
    });
    console.log("Insertando bcra...");
    await insertInChunks("bcra", bcraRows, (b) =>
        prisma.bcra.createMany({ data: b, skipDuplicates: true }),
    );

    // 5) LEADS (uno por empresa)
    const leadRows: Prisma.leadsCreateManyInput[] = validos.flatMap((c) => {
        const id = idByCuit.get(c.cuit);
        if (id == null) return [];
        return [{
            id_empresa: id,
            id_estado: estadoLead.id_estado,
            situacion_crediticia: c.bcra.situacion_peor,
            fuente_origen: "Carga Inicial",
        }];
    });
    console.log("Insertando leads...");
    await insertInChunks("leads", leadRows, (b) =>
        prisma.leads.createMany({ data: b, skipDuplicates: true }),
    );

    const totalEmpresas = await prisma.empresas.count();
    const totalLeads = await prisma.leads.count();
    console.log(`\n✓ ${leadRows.length} leads procesados (${descartados} descartados/duplicados).`);
    console.log(`📊 En ESTA base hay ahora: ${totalEmpresas} empresas y ${totalLeads} leads.`);
}

async function main() {
    const senasaPath = process.env.SENASA_FILE_PATH ?? "./data/API_SENASA.xlsx";
    const arcaPath = process.env.ARCA_FILE_PATH ?? "./data/API_ARCA.xlsx";
    const bcraPath = process.env.BCRA_FILE_PATH ?? "./data/API_BCRA.xlsx";

    console.log(`SENASA: ${senasaPath}`);
    console.log(`ARCA:   ${arcaPath}`);
    console.log(`BCRA:   ${bcraPath}\n`);

    await loadData(
        path.resolve(senasaPath),
        path.resolve(arcaPath),
        path.resolve(bcraPath)
    );

    await loadProvincias();
    await prisma.$disconnect();
}

main().catch((err) => {
    console.error("Error:", err);
    prisma.$disconnect();
    process.exit(1);
});
