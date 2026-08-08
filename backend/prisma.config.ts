import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config();

const nodeEnv = process.env.NODE_ENV ?? "development";
const envFile =
  process.env.DOTENV_CONFIG_PATH ??
  (nodeEnv === "production" ? ".env.prod" : nodeEnv === "staging" ? ".env.staging" : ".env.dev");

dotenv.config({ path: envFile, override: true });

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations/users",
    seed: "tsx prisma/seeders/index.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME",
  },
});
