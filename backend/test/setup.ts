// Global Vitest setup. `env.ts` maps any NODE_ENV that is not `production` or
// `staging` onto `.env.dev`, so the suite deliberately runs against the same
// local database and secrets as `pnpm dev` — see CLAUDE.md for why that is safe.
import { afterAll } from "vitest";

import { prisma } from "../src/lib/prisma.js";

afterAll(async () => {
  await prisma.$disconnect();
});
