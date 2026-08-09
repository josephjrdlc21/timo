import { randomUUID } from "node:crypto";

import { hashPassword } from "../../src/lib/password.js";
import { prisma } from "../../src/lib/prisma.js";

/**
 * The suite runs against the real local `timo` database — there is no separate
 * test schema. Everything here is therefore additive and self-cleaning: it
 * creates users under a recognisable throwaway domain and removes only the rows
 * it created.
 *
 * Never add a TRUNCATE. The seeded `admin@timo.local` and the `admin`/`user`
 * roles are shared with `pnpm dev`, and wiping them would mean re-seeding after
 * every test run.
 */
const TEST_EMAIL_DOMAIN = "@test.local";

const createdUserIds = new Set<string>();

export interface TestUser {
  id: string;
  email: string;
  name: string;
  password: string;
  roles: string[];
}

/** Roles are upserted because other rows depend on them; they are never deleted. */
async function ensureRole(name: string): Promise<number> {
  const role = await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  return role.id;
}

export async function createTestUser(options: { roles?: string[] } = {}): Promise<TestUser> {
  const roles = options.roles ?? [];
  const email = `timo16-${randomUUID()}${TEST_EMAIL_DOMAIN}`;
  const password = `pw-${randomUUID()}`;

  const user = await prisma.user.create({
    data: {
      email,
      name: "TIMO Test User",
      passwordHash: await hashPassword(password),
    },
  });
  createdUserIds.add(user.id);

  for (const roleName of roles) {
    const roleId = await ensureRole(roleName);
    await prisma.userRole.create({ data: { userId: user.id, roleId } });
  }

  return { id: user.id, email, name: user.name, password, roles };
}

/**
 * Deletes only this run's users. The cascades declared on UserRole and
 * RefreshToken clear their rows along with them.
 */
export async function cleanupTestUsers(): Promise<void> {
  if (createdUserIds.size === 0) {
    return;
  }

  const ids = [...createdUserIds];
  createdUserIds.clear();
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
}

/**
 * Backstop for rows orphaned by a crashed run. Scoped to the throwaway domain,
 * so it can never touch a real account.
 */
export async function sweepOrphanedTestUsers(): Promise<void> {
  await prisma.user.deleteMany({ where: { email: { endsWith: TEST_EMAIL_DOMAIN } } });
}

export function countLiveRefreshTokens(userId: string): Promise<number> {
  return prisma.refreshToken.count({ where: { userId, revokedAt: null } });
}
