import { z } from "zod";

/** Authenticated user as returned by the API. */
export const authUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  roles: z.array(z.string()).default([]),
});

export type AuthUser = z.infer<typeof authUserSchema>;
