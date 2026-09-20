import { Router } from 'express';
import {
  getSiteContentByKey,
  getAllSiteContent,
  updateSiteContentByKey,
} from '../controllers/site-content.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  updateSiteContentSchema,
  siteContentKeySchema,
} from '../validators/site-content.validator';

const router = Router();

// Public routes
router.get('/:key', validate(siteContentKeySchema, 'params'), getSiteContentByKey);

// Admin routes (super_admin only)
router.get('/admin/all', authMiddleware, requireRole(['super_admin']), getAllSiteContent);

router.put(
  '/admin/:key',
  authMiddleware,
  requireRole(['super_admin']),
  validate(siteContentKeySchema, 'params'),
  validate(updateSiteContentSchema),
  updateSiteContentByKey
);

export default router;
