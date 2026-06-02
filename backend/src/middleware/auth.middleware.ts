import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

// ─── Extend Express Request type ─────────────────────────────────────────────
export interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    email: string;
    iat?: number;
    exp?: number;
  };
}

/**
 * JWT authentication guard middleware.
 * Verifies Bearer token from Authorization header.
 * Attaches decoded payload to `req.user`.
 *
 * NOTE: Currently validates token structure only.
 * Database admin lookup will be wired in a future sprint.
 */
export const authMiddleware = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Access denied. Authorization token missing.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthenticatedRequest['user'];
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Authentication token has expired. Please sign in again.'));
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(403, 'Invalid authentication token.'));
    }
    next(new ApiError(403, 'Token verification failed.'));
  }
};
