import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

type ValidationTarget = 'body' | 'query' | 'params';

/**
 * Validation middleware factory.
 * Validates the specified part of the request against a Zod schema.
 * On success, replaces the request property with the parsed (coerced) data.
 * On failure, throws an ApiError(400) with structured field errors.
 *
 * Usage:
 *   router.post('/path', validate(mySchema), myController);
 *   router.get('/path/:id', validate(idSchema, 'params'), myController);
 */
export const validate = (
  schema: ZodSchema,
  target: ValidationTarget = 'body'
): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const formatted = formatZodErrors(result.error);
      return next(new ApiError(400, 'Validation failed.', formatted));
    }

    // Replace request data with Zod-parsed/coerced/stripped data
    (req as any)[target] = result.data;
    next();
  };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatZodErrors(error: ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join('.') || '_root';
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(issue.message);
  }

  return formatted;
}
