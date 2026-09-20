import { Router } from 'express';
import {
  getActiveBranches,
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
} from '../controllers/branches.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createBranchSchema,
  updateBranchSchema,
  branchIdSchema,
} from '../validators/branches.validator';

const router = Router();

// Public routes
router.get('/', getActiveBranches);
router.get('/:id', validate(branchIdSchema, 'params'), getBranchById);

// Admin routes (super_admin only for branch structure management)
router.get('/admin/all', authMiddleware, requireRole(['super_admin']), getAllBranches);

router.post(
  '/admin',
  authMiddleware,
  requireRole(['super_admin']),
  validate(createBranchSchema),
  createBranch
);

router.put(
  '/admin/:id',
  authMiddleware,
  requireRole(['super_admin']),
  validate(branchIdSchema, 'params'),
  validate(updateBranchSchema),
  updateBranch
);

router.delete(
  '/admin/:id',
  authMiddleware,
  requireRole(['super_admin']),
  validate(branchIdSchema, 'params'),
  deleteBranch
);

export default router;
