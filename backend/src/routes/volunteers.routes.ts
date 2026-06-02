import { Router } from 'express';
import {
  getAllVolunteers,
  createVolunteer,
  updateVolunteerStatus,
} from '../controllers/volunteers.controller';
import { authMiddleware } from '../middleware/auth.middleware';
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
router.get('/admin', authMiddleware, getAllVolunteers);

router.put(
  '/admin/:id',
  authMiddleware,
  validate(volunteerIdSchema, 'params'),
  validate(updateVolunteerStatusSchema),
  updateVolunteerStatus
);

export default router;
