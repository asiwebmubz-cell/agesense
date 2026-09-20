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

/**
 * Permission-based guard. Composes with requireRole (run authMiddleware first).
 * - super_admin bypasses all permission checks ('*').
 * - Other roles must hold the exact permission key in their role_permissions.
 *
 * @param permission - Permission key, e.g. 'create_content'.
 */
export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized. Authentication required.'));
    }

    if (req.user.role === 'super_admin') {
      return next();
    }

    const perms = req.permissions || [];
    if (!perms.includes(permission)) {
      return next(new ApiError(403, `Forbidden. Missing required permission: ${permission}.`));
    }

    next();
  };
};

/**
 * Permission guard that passes if the user holds ANY of the given permissions.
 */
export const requireAnyPermission = (permissions: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized. Authentication required.'));
    }

    if (req.user.role === 'super_admin') {
      return next();
    }

    const perms = req.permissions || [];
    if (!permissions.some((p) => perms.includes(p))) {
      return next(new ApiError(403, `Forbidden. Missing one of the required permissions: ${permissions.join(', ')}.`));
    }

    next();
  };
};
