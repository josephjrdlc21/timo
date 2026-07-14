import { z } from "zod";

/**
 * Schema factory for a paginated list response.
 * Pass the item schema, e.g. `paginatedSchema(userSchema)`, and use it to
 * runtime-validate an API response with `.parse(data)`.
 */
export const paginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
  });

/** Generic pagination envelope returned by list endpoints. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
