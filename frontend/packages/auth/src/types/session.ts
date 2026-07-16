import { z } from "zod";
import { authUserSchema } from "./user";

/** Credentials accepted by POST /auth/login. */
export const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type Credentials = z.infer<typeof credentialsSchema>;

/** POST /auth/login -> access token plus the authenticated user. */
export const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
  user: authUserSchema,
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

/** POST /auth/refresh -> a fresh access token, keyed off the httpOnly cookie. */
export const refreshResponseSchema = z.object({
  accessToken: z.string().min(1),
});

export type RefreshResponse = z.infer<typeof refreshResponseSchema>;

/**
 * Where the auth state machine currently sits.
 * "loading" covers the boot-time refresh attempt, before which we cannot know
 * whether the user has a live session.
 */
export type AuthStatus = "loading" | "authenticated" | "unauthenticated";
