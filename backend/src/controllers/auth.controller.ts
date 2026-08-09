import type { RequestHandler } from "express";

import { unauthorized } from "../errors/AppError.js";
import { clearRefreshCookie, readRefreshCookie, setRefreshCookie } from "../lib/cookies.js";
import type { LoginInput } from "../schemas/auth.schema.js";
import * as authService from "../services/auth.service.js";

/**
 * Response bodies here are parsed by Zod on the client, so their shape is a
 * contract rather than a convention — see `frontend/packages/auth/src/types`.
 */

export const login: RequestHandler = async (req, res) => {
  // Already validated by `validateBody(loginSchema)` on the route.
  const { email, password } = req.body as LoginInput;

  const session = await authService.login(email, password);
  setRefreshCookie(res, session.refreshToken, session.refreshExpiresAt);

  res.status(200).json({ accessToken: session.accessToken, user: session.user });
};

export const refresh: RequestHandler = async (req, res) => {
  const session = await authService.refresh(readRefreshCookie(req.cookies));
  setRefreshCookie(res, session.refreshToken, session.refreshExpiresAt);

  res.status(200).json({ accessToken: session.accessToken });
};

export const logout: RequestHandler = async (req, res) => {
  await authService.logout(readRefreshCookie(req.cookies));
  clearRefreshCookie(res);

  res.status(204).send();
};

export const me: RequestHandler = async (req, res) => {
  const auth = req.auth;
  if (!auth) {
    // Unreachable behind `requireAuth`; guards the invariant rather than
    // silently returning someone else's account if the route is remounted.
    throw unauthorized("UNAUTHENTICATED", "Authentication required");
  }

  res.status(200).json(await authService.getCurrentUser(auth.userId));
};
