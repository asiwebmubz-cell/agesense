import { Router } from 'express';
import { getAllDonors, createDonor, exportDonors, updateDonorStatus } from '../controllers/donors.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { strictLimiter } from '../middleware/rateLimiter';
import { createDonorSchema, donorIdSchema, updateDonorStatusSchema } from '../validators/donors.validator';

const router = Router();

// ─── Public routes ─────────────────────────────────────────────────────────────
router.post(
  '/',
  strictLimiter,
  validate(createDonorSchema),
  createDonor
);

// ─── Admin routes ──────────────────────────────────────────────────────────────
router.get('/admin', authMiddleware, getAllDonors);
router.get('/admin/export', authMiddleware, exportDonors);
router.put(
  '/admin/:id',
  authMiddleware,
  validate(donorIdSchema, 'params'),
  validate(updateDonorStatusSchema),
  updateDonorStatus
);

export default router;

