import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";

process.loadEnvFile();

const { DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;
export const connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}`;

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

export default prisma;