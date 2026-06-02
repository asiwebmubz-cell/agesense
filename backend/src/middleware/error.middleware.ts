import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

/**
 * Global error handling middleware.
 * Must be registered LAST in the Express middleware stack (after all routes).
 *
 * Handles:
 *  - ApiError (operational — known, expected)
 *  - Generic Error (unexpected programming errors)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // ─── Operational errors (ApiError) ──────────────────────────────────────
  if (err instanceof ApiError) {
    logger.warn(`[${req.method}] ${req.path} → ${err.statusCode}: ${err.message}`);

    res.status(err.statusCode).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
    return;
  }

  // ─── Unknown / programming errors ───────────────────────────────────────
  logger.error(`[${req.method}] ${req.path} → Unhandled error`, {
    message: err.message,
    stack: err.stack,
  });

  const statusCode = 500;
  const message =
    env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred.'
      : err.message;

  res.status(statusCode).json({
    error: message,
    ...(env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  });
};
