import { defineConfig } from "prisma/config";

if (!process.env.DATABASE_URL) {
  try { process.loadEnvFile(); } catch {}
}

const { DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DATABASE_URL } = process.env;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed/seed.ts",
  },
  datasource: {
    url: DATABASE_URL || `postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}`,
  },
});