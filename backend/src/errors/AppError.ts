/** One field-level problem, as surfaced under a VALIDATION_ERROR. */
export interface ErrorDetail {
  path: string;
  message: string;
}

/**
 * An error the API is willing to describe to the caller.
 *
 * Anything that is not an `AppError` reaching the error handler is treated as
 * an unexpected fault: logged, and reported as a bare 500. That split is what
 * keeps internal messages (stack traces, driver errors) out of responses.
 */
export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: ErrorDetail[];

  constructor(status: number, code: string, message: string, details?: ErrorDetail[]) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * 401 — not authenticated. The frontend's axios interceptor keys off this
 * status specifically to drop the session, so it must never be used for a
 * caller who *is* authenticated but lacks a role.
 */
export function unauthorized(code: string, message: string): AppError {
  return new AppError(401, code, message);
}

/** 403 — authenticated, but not allowed. Deliberately distinct from 401. */
export function forbidden(code: string, message: string): AppError {
  return new AppError(403, code, message);
}

/** 400 — the request body did not satisfy its schema. */
export function validationFailed(details: ErrorDetail[]): AppError {
  return new AppError(400, "VALIDATION_ERROR", "Invalid request body", details);
}

/** 404 — no route matched. */
export function notFound(message: string): AppError {
  return new AppError(404, "NOT_FOUND", message);
}
