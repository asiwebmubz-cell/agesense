import { Router } from 'express';
import {
  getAllVolunteers,
  createVolunteer,
  updateVolunteerStatus,
  exportVolunteers,
} from '../controllers/volunteers.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import { strictLimiter } from '../middleware/rateLimiter';
import {
  createVolunteerSchema,
  updateVolunteerStatusSchema,
  volunteerIdSchema,
} from '../validators/volunteers.validator';

const router = Router();

// ─── Public routes ─────────────────────────────────────────────────────────────
// Apply strict rate limit to form submissions
router.post(
  '/',
  strictLimiter,
  validate(createVolunteerSchema),
  createVolunteer
);

// ─── Admin routes ──────────────────────────────────────────────────────────────
router.get('/admin', authMiddleware, requireRole(['super_admin', 'admin']), getAllVolunteers);
router.get('/admin/export', authMiddleware, requireRole(['super_admin', 'admin']), exportVolunteers);

router.put(
  '/admin/:id',
  authMiddleware,
  requireRole(['super_admin', 'admin']),
  validate(volunteerIdSchema, 'params'),
  validate(updateVolunteerStatusSchema),
  updateVolunteerStatus
);

export default router;
