import path from "path";
import { PrismaClient } from "../../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { parseSenasa } from "./parseSenasa";
import { parseArca } from "./parseArca";
import { parseBcra } from "./parseBcra";
import { loadProvincias } from "./loadProvinces.js";
import { pickBestSenasaRecord } from "@/utils/excelNormalizers.js";

process.loadEnvFile();

const { DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;
const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const BATCH_SIZE = 500;

function chunk<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
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

    console.log("BCRA sample:", [...bcraSet].slice(0, 3));
    console.log("ARCA sample:", [...arcaSet].slice(0, 3));


    const consolidados = bcraRecords.map((bcra) => ({
        cuit: bcra.cuit,
        senasa: senasaMap.get(bcra.cuit) ?? null,
        arca: arcaMap.get(bcra.cuit) ?? null,
        bcra,
    })).filter(c => c.senasa !== null);

    console.log(`\nCUITs consolidados: ${consolidados.length}`);

    let cargados = 0;
    let fallidos = 0;
    let descartados = 0;

    const batches = chunk(consolidados, BATCH_SIZE);

    for (const batch of batches) {
        for (const c of batch) {
            try {
                const tieneBaja = c.senasa?.some((s) => s.fecha_baja !== null) ?? false;
                
                if (tieneBaja) {
                    descartados++;
                    continue;
                }

                const senasaPrincipal = pickBestSenasaRecord(c.senasa ?? []);

                const empresa = await prisma.empresas.upsert({
                    where: { cuit: c.cuit },
                    create: {
                        nombre_empresa: senasaPrincipal?.nombre_establecimiento ?? c.arca?.denominacion ?? c.bcra.denominacion,
                        cuit: c.cuit,
                        localidad: senasaPrincipal?.localidad ?? null,
                        direccion: senasaPrincipal?.direccion ?? null,
                        latitud: senasaPrincipal?.latitud ?? null,
                        longitud: senasaPrincipal?.longitud ?? null,
                        superficie: senasaPrincipal?.superficie ?? null,
                        tipo_explotacion: senasaPrincipal?.tipo_explotacion ?? null,
                        renspa: senasaPrincipal?.renspa ?? null,
                    },
                    update: {},
                });

                if (c.senasa) {
                    for (const s of c.senasa) {
                        await prisma.senasa.upsert({
                            where: { renspa: s.renspa },
                            create: {
                                id_empresa: empresa.id_empresa,
                                renspa: s.renspa,
                                titular: s.titular,
                                superficie: s.superficie,
                                tipo_explotacion: s.tipo_explotacion,
                                nombre_establecimiento: s.nombre_establecimiento,
                                fecha_baja: s.fecha_baja,
                                fecha_consulta: s.fecha_consulta,
                                poligono: s.poligono,
                            },
                            update: {
                                titular: s.titular,
                                superficie: s.superficie,
                                tipo_explotacion: s.tipo_explotacion,
                                nombre_establecimiento: s.nombre_establecimiento,
                                fecha_baja: s.fecha_baja,
                                fecha_consulta: s.fecha_consulta,
                                poligono: s.poligono,
                            },
                        });
                    }
                }

                if (c.arca) {
                    await prisma.arca.upsert({
                        where: { cuit: c.cuit },
                        create: {
                            id_empresa: empresa.id_empresa,
                            cuit: c.cuit,
                            denominacion: c.arca.denominacion,
                            imp_ganancias: c.arca.imp_ganancias,
                            imp_iva: c.arca.imp_iva,
                            monotributo: c.arca.monotributo,
                            empleador: String(c.arca.empleador),
                            actividad_codigo: c.arca.actividad_codigo,
                        },
                        update: {
                            denominacion: c.arca.denominacion,
                            imp_ganancias: c.arca.imp_ganancias,
                            imp_iva: c.arca.imp_iva,
                            monotributo: c.arca.monotributo,
                            empleador: String(c.arca.empleador),
                            actividad_codigo: c.arca.actividad_codigo,
                        },
                    });
                }

                await prisma.bcra.upsert({
                    where: { cuit: c.cuit },
                    create: {
                        id_empresa: empresa.id_empresa,
                        cuit: c.cuit,
                        denominacion: c.bcra.denominacion,
                        situacion_crediticia: c.bcra.situacion_peor,
                        periodo: String(c.bcra.periodo),
                        proceso_judicial: false,
                        fecha_consulta: c.bcra.fecha_consulta,
                    },
                    update: {
                        denominacion: c.bcra.denominacion,
                        situacion_crediticia: c.bcra.situacion_peor,
                        periodo: String(c.bcra.periodo),
                        fecha_consulta: c.bcra.fecha_consulta,
                    },
                });

                await prisma.leads.upsert({
                    where: { id_empresa: empresa.id_empresa },
                    create: {
                        id_empresa: empresa.id_empresa,
                        id_estado: estadoLead.id_estado,
                        situacion_crediticia: c.bcra.situacion_peor,
                        fuente_origen: "Carga Inicial",
                    },
                    update: {
                        situacion_crediticia: c.bcra.situacion_peor,
                        fecha_ultima_actividad: new Date(),
                    },
                });

                cargados++;

            } catch (err) {
                fallidos++;
                console.error(`Error en CUIT ${c.cuit}:`, err instanceof Error ? err.message : err);
            }
        }
    }

    console.log(`\n✓ ${cargados} CUITs cargados como leads`);
    if (fallidos > 0) console.log(`${fallidos} CUITs fallidos por error`);
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