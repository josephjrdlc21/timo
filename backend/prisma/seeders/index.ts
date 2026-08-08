import { prisma } from "../../src/lib/prisma.js";
import { seedUsers } from "./users.seeder.js";

/** Seeders run in order — add new ones here as domains are added. */
const seeders = [seedUsers];

async function main(): Promise<void> {
  for (const seeder of seeders) {
    await seeder();
  }
}

try {
  await main();
} catch (error) {
  console.error("Seeding failed:", error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
