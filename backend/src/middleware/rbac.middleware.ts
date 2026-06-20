import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { ApiError } from '../utils/ApiError';

/**
 * Middleware to enforce Role-Based Access Control (RBAC).
 * Assumes authMiddleware has already run and populated req.user.
 * 
 * @param allowedRoles - Array of roles permitted to access the route.
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized. Authentication required.'));
    }

    const userRole = req.user.role || 'admin';

    if (!allowedRoles.includes(userRole)) {
      return next(new ApiError(403, `Forbidden. Requires one of the following roles: ${allowedRoles.join(', ')}.`));
    }

    next();
  };
};
