// Owned by: silent-failure-hunter
// Centralised error types + a Result helper so failures are surfaced, never swallowed.

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: AppError };

/** Base application error. Carries an HTTP-ish status for the API boundary. */
export class AppError extends Error {
  constructor(
    message: string,
    readonly status: number = 500,
    readonly code: string = "internal_error",
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404, "not_found");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409, "conflict");
  }
}

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const err = (error: AppError): Result<never> => ({ ok: false, error });

/**
 * Map any thrown value to an AppError. Use at boundaries so nothing is
 * swallowed: `catch (e) { const ae = toAppError(e); ... }`.
 */
export function toAppError(e: unknown): AppError {
  if (e instanceof AppError) return e;
  if (e instanceof Error) return new AppError(e.message);
  return new AppError("Unknown error");
}
