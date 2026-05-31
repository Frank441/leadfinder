import { defineConfig } from "prisma/config";

process.loadEnvFile();

const { DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = process.env;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed/seed.ts",
  },
  datasource: {
    url: `postgresql://${DB_USER}:${DB_PASSWORD}@localhost:${DB_PORT}/${DB_NAME}`,
  },
});