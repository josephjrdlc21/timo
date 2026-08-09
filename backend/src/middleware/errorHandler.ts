import type { ErrorRequestHandler, RequestHandler } from "express";

import { AppError, notFound } from "../errors/AppError.js";

/** The single error shape the API emits: `{ error: { code, message, details? } }`. */
interface ErrorBody {
  error: {
    code: string;
    message: string;
    details?: { path: string; message: string }[];
  };
}

/** Nothing matched, so hand a structured 404 to the error handler. */
export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(notFound(`Cannot ${req.method} ${req.path}`));
};

/**
 * Terminal error middleware — must be registered after every route.
 *
 * Express 5 forwards rejected promises from async handlers here on its own, so
 * handlers can simply throw. The four-parameter signature is what marks this as
 * error middleware, hence the unused `_next`.
 *
 * Only 5xx is logged. A 401 from `/auth/refresh` is the ordinary cold-boot path
 * for a logged-out visitor — the frontend calls it on every mount — and logging
 * it as an error would bury real faults in noise.
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    const body: ErrorBody = { error: { code: err.code, message: err.message } };
    if (err.details) {
      body.error.details = err.details;
    }

    if (err.status >= 500) {
      console.error(err);
    }

    res.status(err.status).json(body);
    return;
  }

  console.error(err);
  res.status(500).json({
    error: { code: "INTERNAL_ERROR", message: "Something went wrong" },
  } satisfies ErrorBody);
};
