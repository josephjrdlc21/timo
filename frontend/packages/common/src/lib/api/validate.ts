import type { ZodType } from "zod";

/**
 * Runtime-validate arbitrary API response data against a Zod schema.
 * Returns the typed, parsed value or throws a ZodError describing the mismatch.
 *
 * Usage:
 *   const users = parseResponse(userSchema.array(), response.data);
 */
export function parseResponse<T>(schema: ZodType<T>, data: unknown): T {
  return schema.parse(data);
}
