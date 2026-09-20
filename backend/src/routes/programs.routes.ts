import { Router } from 'express';
import {
  getPublishedPrograms,
  getAllPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../controllers/programs.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole, requirePermission } from '../middleware/rbac.middleware';
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
// Role gate + granular permission gate (super_admin bypasses permissions).
router.get('/admin', authMiddleware, requireRole(['super_admin', 'marketing', 'branch_manager', 'admin', 'content_manager']), requirePermission('view_content'), getAllPrograms);

router.post(
  '/admin',
  authMiddleware,
  requireRole(['super_admin', 'marketing', 'branch_manager', 'admin', 'content_manager']),
  requirePermission('create_content'),
  validate(createProgramSchema),
  createProgram
);

router.put(
  '/admin/:id',
  authMiddleware,
  requireRole(['super_admin', 'marketing', 'branch_manager', 'admin', 'content_manager']),
  requirePermission('edit_content'),
  validate(programIdSchema, 'params'),
  validate(updateProgramSchema),
  updateProgram
);

router.delete(
  '/admin/:id',
  authMiddleware,
  requireRole(['super_admin', 'marketing', 'branch_manager', 'admin', 'content_manager']),
  requirePermission('delete_content'),
  validate(programIdSchema, 'params'),
  deleteProgram
);

export default router;
