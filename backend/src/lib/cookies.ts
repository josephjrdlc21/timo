import type { CookieOptions, Response } from "express";

import { env } from "../config/env.js";

/**
 * Scoped to the auth router, so the refresh token is not attached to every
 * ordinary API call. It must stay broad enough to cover *both* `/refresh` and
 * `/logout` — narrowing it to the refresh endpoint alone would mean logout
 * never receives the cookie and could not revoke it.
 *
 * `sameSite: "lax"` suffices while the API and the SPAs share a site: cookies
 * ignore the port, so localhost:5173 -> localhost:4000 is same-site. An API on
 * a genuinely different site would need `sameSite: "none"` with `secure: true`.
 */
const BASE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.NODE_ENV === "production",
  path: "/api/auth",
};

export function setRefreshCookie(res: Response, token: string, expiresAt: Date): void {
  res.cookie(env.REFRESH_COOKIE_NAME, token, { ...BASE_OPTIONS, expires: expiresAt });
}

/**
 * Clearing only works when the flags match the ones the cookie was set with —
 * a differing `path` leaves the original in place — so both paths share
 * `BASE_OPTIONS` rather than restating them.
 */
export function clearRefreshCookie(res: Response): void {
  res.clearCookie(env.REFRESH_COOKIE_NAME, BASE_OPTIONS);
}

export function readRefreshCookie(cookies: Record<string, unknown> | undefined): string | null {
  const value = cookies?.[env.REFRESH_COOKIE_NAME];
  return typeof value === "string" && value.length > 0 ? value : null;
}
