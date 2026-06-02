import { Router } from 'express';
import {
  getPublishedPrograms,
  getAllPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../controllers/programs.controller';
import { authMiddleware } from '../middleware/auth.middleware';
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
router.get('/admin', authMiddleware, getAllPrograms);

router.post(
  '/admin',
  authMiddleware,
  validate(createProgramSchema),
  createProgram
);

router.put(
  '/admin/:id',
  authMiddleware,
  validate(programIdSchema, 'params'),
  validate(updateProgramSchema),
  updateProgram
);

router.delete(
  '/admin/:id',
  authMiddleware,
  validate(programIdSchema, 'params'),
  deleteProgram
);

export default router;
