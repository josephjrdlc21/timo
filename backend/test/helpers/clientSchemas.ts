import { z } from "zod";

/**
 * Verbatim copies of the schemas the browser actually parses responses with,
 * from `frontend/packages/auth/src/types/`. The backend and frontend are
 * separate pnpm installs, so `@timo/auth` cannot be imported here.
 *
 * Asserting responses against these is the point: if the API drifts from the
 * contract, the client throws at runtime, and this suite is what catches it
 * first. Keep them in step with the frontend by hand.
 */
export const authUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  roles: z.array(z.string()).default([]),
});

export const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
  user: authUserSchema,
});

export const refreshResponseSchema = z.object({
  accessToken: z.string().min(1),
});
