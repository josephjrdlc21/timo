import { createHash, randomUUID } from "node:crypto";

import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

/** Access token claims. Roles ride along so role checks cost no query. */
export interface AccessTokenPayload {
  userId: string;
  roles: string[];
}

/** Refresh token claims. `jti` makes each issued token individually nameable. */
export interface RefreshTokenPayload {
  userId: string;
  jti: string;
}

export interface IssuedRefreshToken {
  token: string;
  jti: string;
  expiresAt: Date;
}

export function signAccessToken(userId: string, roles: string[]): string {
  return jwt.sign({ roles }, env.JWT_SECRET, {
    subject: userId,
    expiresIn: env.JWT_ACCESS_TTL_SECONDS,
  });
}

/**
 * Issues a refresh token and reports when it expires.
 *
 * The expiry is read back off the signed token rather than recomputed, so the
 * database row and the cookie can never disagree with the JWT's own `exp`.
 */
export function signRefreshToken(userId: string): IssuedRefreshToken {
  const jti = randomUUID();
  const token = jwt.sign({}, env.JWT_REFRESH_SECRET, {
    subject: userId,
    jwtid: jti,
    expiresIn: env.JWT_REFRESH_TTL_SECONDS,
  });

  const decoded = jwt.decode(token);
  if (typeof decoded !== "object" || decoded === null || typeof decoded.exp !== "number") {
    throw new Error("Signed refresh token is missing an exp claim");
  }

  return { token, jti, expiresAt: new Date(decoded.exp * 1000) };
}

/**
 * Returns null for anything untrustworthy — bad signature, expired, wrong
 * shape. Callers decide what that means in HTTP terms; this module stays out
 * of it.
 */
export function verifyAccessToken(token: string): AccessTokenPayload | null {
  const payload = verify(token, env.JWT_SECRET);
  if (!payload || typeof payload.sub !== "string") {
    return null;
  }

  const roles = Array.isArray(payload.roles)
    ? payload.roles.filter((role): role is string => typeof role === "string")
    : [];

  return { userId: payload.sub, roles };
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  const payload = verify(token, env.JWT_REFRESH_SECRET);
  if (!payload || typeof payload.sub !== "string" || typeof payload.jti !== "string") {
    return null;
  }

  return { userId: payload.sub, jti: payload.jti };
}

/**
 * SHA-256, hex. Refresh tokens are stored only as this digest, so a dump of
 * `refresh_tokens` yields nothing that can be replayed. SHA-256 without a salt
 * is right here — the input is 256 bits of entropy, not a guessable password,
 * and lookups must be exact-match on an indexed column.
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function verify(token: string, secret: string): jwt.JwtPayload | null {
  try {
    const payload = jwt.verify(token, secret);
    return typeof payload === "string" ? null : payload;
  } catch {
    return null;
  }
}
