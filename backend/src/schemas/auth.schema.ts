import { z } from "zod";

/**
 * Body accepted by POST /auth/login.
 *
 * This mirrors `credentialsSchema` in `frontend/packages/auth/src/types/session.ts`
 * and must be kept in step with it by hand. The backend and frontend are
 * separate pnpm installs with no shared workspace, so the client's schema
 * cannot be imported here — if one side gains a field, change both.
 */
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;
