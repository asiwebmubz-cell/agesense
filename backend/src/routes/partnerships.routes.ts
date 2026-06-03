import { Router } from 'express';
import {
  createPartnership,
  getAllPartnerships,
  getPartnershipById,
  updatePartnershipStatus,
  getPartnershipStats,
} from '../controllers/partnerships.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { strictLimiter } from '../middleware/rateLimiter';
import {
  createPartnershipSchema,
  updatePartnershipStatusSchema,
  partnershipIdSchema,
} from '../validators/partnerships.validator';

const router = Router();

// ─── Public routes ─────────────────────────────────────────────────────────────
// Strict rate limit: max 10 submissions per 15 minutes per IP
router.post(
  '/',
  strictLimiter,
  validate(createPartnershipSchema),
  createPartnership
);

// ─── Admin routes (auth required) ─────────────────────────────────────────────
// Stats must be registered before /:id to avoid route conflict
router.get('/admin/stats', authMiddleware, getPartnershipStats);
router.get('/admin', authMiddleware, getAllPartnerships);

router.get(
  '/admin/:id',
  authMiddleware,
  validate(partnershipIdSchema, 'params'),
  getPartnershipById
);

router.put(
  '/admin/:id',
  authMiddleware,
  validate(partnershipIdSchema, 'params'),
  validate(updatePartnershipStatusSchema),
  updatePartnershipStatus
);

export default router;
