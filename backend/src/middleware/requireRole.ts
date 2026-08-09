import type { RequestHandler } from "express";

import { forbidden, unauthorized } from "../errors/AppError.js";

/**
 * Gate for role-restricted routes. Must be mounted after `requireAuth`.
 *
 * Grants access if the caller holds *any* of the listed roles. The 401/403
 * split matters: 403 says "we know who you are, and the answer is no", and the
 * client must not tear down the session over it the way it does for a 401.
 *
 * Roles are read from the access token, so a role revoked mid-session stays
 * effective until the token expires — bounded by JWT_ACCESS_TTL_SECONDS.
 */
export function requireRole(...roles: string[]): RequestHandler {
  return (req, _res, next) => {
    const auth = req.auth;

    if (!auth) {
      next(unauthorized("UNAUTHENTICATED", "Authentication required"));
      return;
    }

    if (!roles.some((role) => auth.roles.includes(role))) {
      next(forbidden("FORBIDDEN", "You do not have access to this resource"));
      return;
    }

    next();
  };
}
