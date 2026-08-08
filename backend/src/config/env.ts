import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const nodeEnv = process.env.NODE_ENV ?? "development";
const envFile =
  process.env.DOTENV_CONFIG_PATH ??
  (nodeEnv === "production" ? ".env.prod" : nodeEnv === "staging" ? ".env.staging" : ".env.dev");

dotenv.config({ path: envFile, override: true });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1).default("mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME"),
  JWT_SECRET: z.string().min(1).default("replace-this-later"),
  SEED_ADMIN_EMAIL: z.email().default("admin@timo.local"),
  SEED_ADMIN_NAME: z.string().min(1).default("TIMO Admin"),
  SEED_ADMIN_PASSWORD: z.string().min(1).default("change-this-locally"),
});

export const env = envSchema.parse(process.env);
