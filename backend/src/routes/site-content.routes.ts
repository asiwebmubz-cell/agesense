import { Router, Request, Response, NextFunction } from 'express';
import {
  getSiteContentByKey,
  getAllSiteContent,
  updateSiteContentByKey,
} from '../controllers/site-content.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireAnyPermission } from '../middleware/rbac.middleware';
import { ApiError } from '../utils/ApiError';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  updateSiteContentSchema,
  siteContentKeySchema,
} from '../validators/site-content.validator';

const router = Router();

/** Maps each CMS key to its granular edit permission. */
const SITE_CONTENT_PERMISSIONS: Record<string, string> = {
  our_story: 'edit_our_story',
  values: 'edit_values',
  founder_statement: 'edit_founder_statement',
  impact_metrics: 'edit_impact_metrics',
};

/** Permission guard for a specific CMS key (super_admin bypasses via '*'). */
const requireSiteContentPermission = (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
  if (!req.user) {
    return next(new ApiError(401, 'Unauthorized. Authentication required.'));
  }
  if (req.user.role === 'super_admin') {
    return next();
  }
  const key = req.params.key as string;
  const required = SITE_CONTENT_PERMISSIONS[key];
  if (!required) {
    return next(new ApiError(404, `Unknown site content key: ${key}`));
  }
  const perms = req.permissions || [];
  if (!perms.includes(required)) {
    return next(new ApiError(403, `Forbidden. Missing required permission: ${required}.`));
  }
  next();
};

// Public routes
router.get('/:key', validate(siteContentKeySchema, 'params'), getSiteContentByKey);

// Admin routes: require at least one CMS edit permission (super_admin bypasses)
router.get(
  '/admin/all',
  authMiddleware,
  requireAnyPermission(['edit_our_story', 'edit_values', 'edit_founder_statement', 'edit_impact_metrics']),
  getAllSiteContent
);

router.put(
  '/admin/:key',
  authMiddleware,
  requireSiteContentPermission,
  validate(siteContentKeySchema, 'params'),
  validate(updateSiteContentSchema),
  updateSiteContentByKey
);

export default router;
