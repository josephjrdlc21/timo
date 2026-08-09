import { unauthorized } from "../errors/AppError.js";
import { DUMMY_PASSWORD_HASH, verifyPassword } from "../lib/password.js";
import { prisma } from "../lib/prisma.js";
import { hashToken, signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/tokens.js";

/** Exactly the shape the client's `authUserSchema` parses. */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
  user: AuthUser;
}

/** What the queries below select — structural, so Prisma's payload types stay internal. */
interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  roles: { role: { name: string } }[];
}

const withRoles = { roles: { include: { role: true } } } as const;

/**
 * One factory, so the unknown-email and wrong-password paths are guaranteed to
 * return byte-identical bodies. Two call sites with two string literals would
 * eventually drift and reintroduce user enumeration.
 */
function invalidCredentials(): Error {
  return unauthorized("INVALID_CREDENTIALS", "Invalid email or password");
}

/** Covers absent, forged, expired, revoked, and replayed refresh tokens alike. */
function invalidRefresh(): Error {
  return unauthorized("INVALID_REFRESH_TOKEN", "Refresh session is invalid or expired");
}

function toAuthUser(user: UserRecord): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    roles: user.roles.map((assignment) => assignment.role.name),
  };
}

async function issueSession(user: AuthUser): Promise<Session> {
  const accessToken = signAccessToken(user.id, user.roles);
  const { token, expiresAt } = signRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: { tokenHash: hashToken(token), userId: user.id, expiresAt },
  });

  return { accessToken, refreshToken: token, refreshExpiresAt: expiresAt, user };
}

export async function login(email: string, password: string): Promise<Session> {
  const user = await prisma.user.findUnique({ where: { email }, include: withRoles });

  // Always run one bcrypt compare, falling back to a dummy hash when the email
  // is unknown, so both failure paths take the same time. Skipping it would let
  // an attacker enumerate accounts by latency despite the identical message.
  const passwordMatches = await verifyPassword(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH);

  if (!user || !passwordMatches) {
    throw invalidCredentials();
  }

  return issueSession(toAuthUser(user));
}

/**
 * Exchanges a refresh token for a new access token, rotating the refresh token
 * in the process. The old token is revoked in the same transaction that stores
 * the new one, so a crash mid-rotation cannot leave a user with two live
 * tokens or none.
 */
export async function refresh(rawToken: string | null): Promise<Session> {
  if (!rawToken) {
    throw invalidRefresh();
  }

  // Signature check first: a forged or expired token is rejected without
  // touching the database.
  if (!verifyRefreshToken(rawToken)) {
    throw invalidRefresh();
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(rawToken) },
  });
  if (!stored) {
    throw invalidRefresh();
  }

  if (stored.revokedAt !== null) {
    // A token that was already rotated away is being replayed, which means the
    // cookie leaked. The holder of the current token cannot be distinguished
    // from the attacker, so end every live session for this user.
    await prisma.refreshToken.updateMany({
      where: { userId: stored.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    throw invalidRefresh();
  }

  if (stored.expiresAt.getTime() <= Date.now()) {
    throw invalidRefresh();
  }

  const user = await prisma.user.findUnique({ where: { id: stored.userId }, include: withRoles });
  if (!user) {
    throw invalidRefresh();
  }

  const authUser = toAuthUser(user);
  const accessToken = signAccessToken(authUser.id, authUser.roles);
  const next = signRefreshToken(authUser.id);

  await prisma.$transaction([
    prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } }),
    prisma.refreshToken.create({
      data: {
        tokenHash: hashToken(next.token),
        userId: authUser.id,
        expiresAt: next.expiresAt,
      },
    }),
  ]);

  return {
    accessToken,
    refreshToken: next.token,
    refreshExpiresAt: next.expiresAt,
    user: authUser,
  };
}

/**
 * Revokes the presented refresh token. Best-effort by design: an absent,
 * unknown, or already-revoked token is not an error, because the client calls
 * this from a `finally` block and a failed logout must never strand a user in
 * a signed-in UI.
 */
export async function logout(rawToken: string | null): Promise<void> {
  if (!rawToken) {
    return;
  }

  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(rawToken), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

/**
 * Reads the user fresh from the database rather than trusting the token's
 * claims, so a role change shows up here immediately.
 */
export async function getCurrentUser(userId: string): Promise<AuthUser> {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: withRoles });

  if (!user) {
    // The token verified, but the account is gone — deleted mid-session.
    throw unauthorized("UNAUTHENTICATED", "Authentication required");
  }

  return toAuthUser(user);
}
