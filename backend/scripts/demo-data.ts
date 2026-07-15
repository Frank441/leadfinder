/**
 * demo-data.ts
 *
 * Ejecutar script luego de haber ejecutado el parser:
 *   pnpm run demo:data
 */

import { PrismaClient } from "../generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { connectionString } from "../prisma/client.js";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });


const STATUS_WEIGHTS = {
    Lead:      52,
    Contacto:  24,
    Prospecto: 16,
    Cliente:    8,
};

const REP_WEIGHTS = [40, 28, 22, 10];

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function pickWeighted<T>(items: T[], weights: number[]): T {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
        r -= weights[i];
        if (r <= 0) return items[i];
    }
    return items[items.length - 1];
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = randomInt(0, i);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function generateValidCuit(): string {
    const prefixes = ["20", "27", "30", "23", "24"];
    const prefix = pickRandom(prefixes);
    const body = String(randomInt(10000000, 99999999));
    const raw = `${prefix}${body}`;

    const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(raw[i]) * multipliers[i];
    }
    const remainder = sum % 11;
    const checkDigit = remainder === 0 ? 0 : remainder === 1 ? 9 : 11 - remainder;

    return `${raw}${checkDigit}`;
}

function randomDateLastYear(): Date {
    const now  = Date.now();
    const year = 365 * 24 * 60 * 60 * 1000;
    const bias = Math.sqrt(Math.random());
    return new Date(now - (1 - bias) * year);
}

function randomDateAfter(after: Date, biasFresh: boolean): Date {
    const start = after.getTime();
    const end   = Date.now();
    const range = end - start;
    if (range <= 0) return new Date();
    const t = biasFresh ? Math.sqrt(Math.random()) : Math.random();
    return new Date(start + t * range);
}

async function main() {
    console.log("Iniciando demo-data...\n");

    const estados = await prisma.estados_lead.findMany();
    const estadoMap = Object.fromEntries(estados.map((e) => [e.nombre, e.id_estado]));

    const representantes = await prisma.usuarios.findMany({
        where:   { activo: true, role: { nombre: "Representante" } },
        select:  { id_usuario: true, nombre: true, apellido: true },
        orderBy: { id_usuario: "asc" },
    });

    if (representantes.length === 0) {
        console.error("No se encontraron representantes. Ejecutá el seed primero.");
        process.exit(1);
    }

    const empresas = await prisma.empresas.findMany({
        select: { id_empresa: true, nombre_empresa: true, direccion: true },
    });

    const shuffledNames     = shuffle(empresas.map((e) => e.nombre_empresa));
    const shuffledDirecciones = shuffle(empresas.map((e) => e.direccion));

    const usedCuits = new Set<string>();

    for (let i = 0; i < empresas.length; i++) {
        let fakeCuit: string;
        do { fakeCuit = generateValidCuit(); } while (usedCuits.has(fakeCuit));
        usedCuits.add(fakeCuit);

        await prisma.empresas.update({
            where: { id_empresa: empresas[i].id_empresa },
            data: {
                cuit:          fakeCuit,
                nombre_empresa: shuffledNames[i],
                direccion:     shuffledDirecciones[i],
            },
        });
    }

    const leads = await prisma.leads.findMany();

    const statusNames      = Object.keys(STATUS_WEIGHTS) as (keyof typeof STATUS_WEIGHTS)[];
    const statusWeightsArr = Object.values(STATUS_WEIGHTS);
    const repWeightsPadded = representantes.map((_, i) => REP_WEIGHTS[i] ?? 10);

    let processed = 0;

    for (const lead of leads) {
        const statusName = pickWeighted(statusNames, statusWeightsArr);
        const estadoId   = estadoMap[statusName];

        const unassignedChance = statusName === "Lead" ? 0.25 : 0.05;
        const rep = Math.random() < unassignedChance
            ? null
            : pickWeighted(representantes, repWeightsPadded);

        const fechaCreacion = randomDateLastYear();

        const fechaUltimaActividad = statusName === "Lead"
            ? (Math.random() > 0.6 ? randomDateAfter(fechaCreacion, false) : null)
            : randomDateAfter(fechaCreacion, true);

        const fechaConversion = statusName === "Cliente"
            ? randomDateAfter(fechaCreacion, true)
            : null;

        await prisma.leads.update({
            where: { id_lead: lead.id_lead },
            data: {
                id_estado:              estadoId,
                id_usuario_asignado:    rep?.id_usuario ?? null,
                fecha_asignacion:       rep ? randomDateAfter(fechaCreacion, false) : null,
                fecha_creacion:         fechaCreacion,
                fecha_ultima_actividad: fechaUltimaActividad,
                fecha_conversion:       fechaConversion,
            },
        });

        processed++;
        if (processed % 50 === 0) {
            console.log(`   → ${processed}/${leads.length} leads procesados`);
        }
    }

    const finalCounts = await prisma.leads.groupBy({
        by:     ["id_estado"],
        _count: { id_lead: true },
    });

    console.log("\n demo-data completado\n");
    console.log("Distribución final de estados:");
    for (const row of finalCounts) {
        const estado = estados.find((e) => e.id_estado === row.id_estado);
        console.log(`   ${estado?.nombre.padEnd(12)} → ${row._count.id_lead} leads`);
    }

    console.log("\n👥 Leads por representante:");
    for (const rep of representantes) {
        const count = await prisma.leads.count({
            where: { id_usuario_asignado: rep.id_usuario },
        });
        console.log(`   ${`${rep.nombre} ${rep.apellido}`.padEnd(20)} → ${count} leads`);
    }
}

main()
    .catch((e) => {
        console.error("Error en demo-data:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });