import { Router } from 'express';
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from '../controllers/roles.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole, requirePermission } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createRoleSchema,
  updateRoleSchema,
  roleIdSchema,
} from '../validators/roles.validator';

const router = Router();

// Role/permission management: super_admin only, with granular permission checks
router.use(authMiddleware, requireRole(['super_admin']));

router.get('/', requirePermission('manage_roles'), getAllRoles);
router.get('/:id', validate(roleIdSchema, 'params'), requirePermission('manage_roles'), getRoleById);
router.post('/', validate(createRoleSchema), requirePermission('manage_roles'), createRole);
router.put('/:id', validate(roleIdSchema, 'params'), validate(updateRoleSchema), requirePermission('manage_permissions'), updateRole);
router.delete('/:id', validate(roleIdSchema, 'params'), requirePermission('manage_roles'), deleteRole);

export default router;