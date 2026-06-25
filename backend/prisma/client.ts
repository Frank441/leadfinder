import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

// En producción las variables vienen inyectadas.
if (!process.env.DATABASE_URL) {
    try { process.loadEnvFile(); } catch {}
}

const { DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DATABASE_URL } = process.env;
export const connectionString =
    DATABASE_URL ||
    `postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}`;

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

export default prisma;