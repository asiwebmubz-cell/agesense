/**
 * Custom error class for API responses.
 *
 * Usage:
 *   throw new ApiError(404, 'Program not found.');
 *   throw new ApiError(400, 'Validation failed.', { field: 'title' });
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // Distinguish operational from programming errors

    // Preserve prototype chain in TypeScript
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
