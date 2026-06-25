import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { db } from '../database';

// ─── Extend Express Request type ─────────────────────────────────────────────
export interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    email: string;
    role?: string;
    jti?: string;
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
export const authMiddleware = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Access denied. Authorization token missing.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthenticatedRequest['user'] | undefined;
    if (!decoded || typeof decoded === 'string') {
      return next(new ApiError(403, 'Invalid authentication token.'));
    }

    // Check if token has been revoked
    if (decoded.jti) {
      const revoked = await db.query('SELECT 1 FROM revoked_tokens WHERE token_jti = $1 LIMIT 1', [decoded.jti]);
      if (revoked.length > 0) {
        return next(new ApiError(401, 'Token has been revoked. Please sign in again.'));
      }
    }

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
