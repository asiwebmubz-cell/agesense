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
    branch_id?: string | null;
    jti?: string;
    iat?: number;
    exp?: number;
  };
  /** Permission keys granted to the user's role ('*' = super_admin bypass). */
  permissions?: string[];
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

    // Load role permissions for the current request (from DB, so permission
    // changes take effect immediately without re-issuing tokens).
    // super_admin is always granted '*' (full bypass in requirePermission).
    // Fail-open with an empty list if the roles tables don't exist yet, so
    // deployments that haven't run Migration 15 keep working via role checks.
    try {
      if (decoded.role === 'super_admin') {
        (req as AuthenticatedRequest).permissions = ['*'];
      } else if (decoded.role) {
        const permRows = await db.query<{ key: string }>(
          `SELECT p.key
           FROM role_permissions rp
           JOIN roles r ON rp.role_id = r.id
           JOIN permissions p ON rp.permission_id = p.id
           WHERE r.name = $1`,
          [decoded.role]
        );
        (req as AuthenticatedRequest).permissions = permRows.map((row) => row.key);
      } else {
        (req as AuthenticatedRequest).permissions = [];
      }
    } catch {
      // Roles/permissions tables not migrated yet — role-string checks still apply.
      (req as AuthenticatedRequest).permissions = [];
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
