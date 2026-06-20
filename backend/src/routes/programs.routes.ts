import { Router } from 'express';
import {
  getPublishedPrograms,
  getAllPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../controllers/programs.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createProgramSchema,
  updateProgramSchema,
  programIdSchema,
} from '../validators/programs.validator';

const router = Router();

// ─── Public routes ─────────────────────────────────────────────────────────────
router.get('/', getPublishedPrograms);

// ─── Admin routes (require auth) ──────────────────────────────────────────────
router.get('/admin', authMiddleware, requireRole(['super_admin', 'admin', 'content_manager']), getAllPrograms);

router.post(
  '/admin',
  authMiddleware,
  requireRole(['super_admin', 'admin', 'content_manager']),
  validate(createProgramSchema),
  createProgram
);

router.put(
  '/admin/:id',
  authMiddleware,
  requireRole(['super_admin', 'admin', 'content_manager']),
  validate(programIdSchema, 'params'),
  validate(updateProgramSchema),
  updateProgram
);

router.delete(
  '/admin/:id',
  authMiddleware,
  requireRole(['super_admin', 'admin', 'content_manager']),
  validate(programIdSchema, 'params'),
  deleteProgram
);

export default router;
