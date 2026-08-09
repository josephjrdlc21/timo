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
  // No defaults: a signing key that silently falls back to a well-known string
  // is worse than a server that refuses to boot. 32 chars is the floor for
  // HS256 to actually carry 256 bits of entropy.
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  // Seconds rather than "15m" strings — `jsonwebtoken` accepts a number
  // directly, and the cookie's expiry needs arithmetic on it either way.
  JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().positive().default(900),
  JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().positive().default(604800),
  REFRESH_COOKIE_NAME: z.string().min(1).default("timo_refresh_token"),
  // A wildcard origin cannot be combined with credentialed requests, so the
  // allowlist is explicit. Defaults cover the two Vite dev servers.
  CORS_ORIGINS: z
    .string()
    .default("http://localhost:5173,http://localhost:5174")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ),
  SEED_ADMIN_EMAIL: z.email().default("admin@timo.local"),
  SEED_ADMIN_NAME: z.string().min(1).default("TIMO Admin"),
  SEED_ADMIN_PASSWORD: z.string().min(1).default("change-this-locally"),
});

export const env = envSchema.parse(process.env);
