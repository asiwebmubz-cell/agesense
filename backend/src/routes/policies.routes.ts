import { Router } from 'express';
import {
  getPublishedPolicies,
  getAllPolicies,
  getPolicyById,
  createPolicy,
  updatePolicy,
  deletePolicy,
} from '../controllers/policies.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole, requirePermission } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createPolicySchema,
  updatePolicySchema,
  policyIdSchema,
} from '../validators/policies.validator';

const router = Router();

// Public routes
router.get('/', getPublishedPolicies);
router.get('/:id', validate(policyIdSchema, 'params'), getPolicyById);

// Admin routes (super_admin only)
router.get('/admin/all', authMiddleware, requireRole(['super_admin']), requirePermission('view_policies'), getAllPolicies);

router.post(
  '/admin',
  authMiddleware,
  requireRole(['super_admin']),
  requirePermission('create_policies'),
  validate(createPolicySchema),
  createPolicy
);

router.put(
  '/admin/:id',
  authMiddleware,
  requireRole(['super_admin']),
  requirePermission('edit_policies'),
  validate(policyIdSchema, 'params'),
  validate(updatePolicySchema),
  updatePolicy
);

router.delete(
  '/admin/:id',
  authMiddleware,
  requireRole(['super_admin']),
  requirePermission('delete_policies'),
  validate(policyIdSchema, 'params'),
  deletePolicy
);

export default router;
