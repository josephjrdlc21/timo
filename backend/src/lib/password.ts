import { compare, hash } from "bcryptjs";

/** Matches the cost factor used by `prisma/seeders/users.seeder.ts`. */
const BCRYPT_ROUNDS = 12;

/**
 * A real bcrypt hash of a throwaway random string, at the same cost factor.
 *
 * Login verifies against this when the email is unknown, so the unknown-email
 * and wrong-password paths burn the same ~200ms. Without it, an attacker can
 * distinguish registered addresses by response time alone, which would undo
 * the identical error message.
 */
export const DUMMY_PASSWORD_HASH = "$2b$12$RnXCIjJFg1QwJNX7fRRuhOZo/Z3K8hZJ4BkjFcEEkdrWEJQyROLom";

export function hashPassword(plain: string): Promise<string> {
  return hash(plain, BCRYPT_ROUNDS);
}

export function verifyPassword(plain: string, passwordHash: string): Promise<boolean> {
  return compare(plain, passwordHash);
}
