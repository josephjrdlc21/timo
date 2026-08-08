import { hash } from "bcryptjs";

import { env } from "../../src/config/env.js";
import { prisma } from "../../src/lib/prisma.js";

/** Roles the app assumes exist. `authUserSchema` exposes these by name. */
const ROLES = ["admin", "user"] as const;

const BCRYPT_ROUNDS = 12;

/**
 * Creates the baseline roles and one login-able admin, since the auth epic has
 * no self-service registration. Idempotent — upserts, so re-running is safe.
 */
export async function seedUsers(): Promise<void> {
  for (const name of ROLES) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const passwordHash = await hash(env.SEED_ADMIN_PASSWORD, BCRYPT_ROUNDS);

  // The password is only set on create, so re-seeding never overwrites a
  // password that was changed locally.
  const user = await prisma.user.upsert({
    where: { email: env.SEED_ADMIN_EMAIL },
    update: { name: env.SEED_ADMIN_NAME },
    create: {
      email: env.SEED_ADMIN_EMAIL,
      name: env.SEED_ADMIN_NAME,
      passwordHash,
    },
  });

  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: "admin" } });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
    update: {},
    create: { userId: user.id, roleId: adminRole.id },
  });

  console.log(`Seeded roles [${ROLES.join(", ")}] and admin user ${user.email}`);
}
