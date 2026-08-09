import type { RequestHandler } from "express";
import type { ZodType } from "zod";

import { validationFailed, type ErrorDetail } from "../errors/AppError.js";

/**
 * Validates `req.body` against a Zod schema, rejecting with a 400 before the
 * controller runs — so a malformed login never reaches the database or bcrypt.
 *
 * The parsed value is written back to `req.body`, so handlers downstream get
 * the coerced, trimmed result rather than the raw JSON.
 */
export function validateBody(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details: ErrorDetail[] = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      next(validationFailed(details));
      return;
    }

    req.body = result.data;
    next();
  };
}
