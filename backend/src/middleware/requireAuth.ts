import type { RequestHandler } from "express";

import { unauthorized } from "../errors/AppError.js";
import { verifyAccessToken } from "../lib/tokens.js";

/**
 * Gate for authenticated routes. Rejects with 401 and never calls the handler
 * when the bearer token is missing, malformed, expired, or signed with the
 * wrong key.
 *
 * 401 is load-bearing on the client: the shared axios interceptor treats it as
 * "session is gone" and clears local state. Insufficient privileges must
 * therefore go out as 403 from `requireRole`, not from here.
 */
export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : "";

  if (!token) {
    next(unauthorized("UNAUTHENTICATED", "Authentication required"));
    return;
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    next(unauthorized("INVALID_TOKEN", "Access token is invalid or expired"));
    return;
  }

  req.auth = payload;
  next();
};
