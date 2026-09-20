import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from '../validators/users.validator';
import { requirePermission } from '../middleware/rbac.middleware';

const router = Router();

// All user management routes strictly require super_admin
router.use(authMiddleware, requireRole(['super_admin']));

router.get('/', requirePermission('view_users'), getAllUsers);
router.get('/:id', validate(userIdSchema, 'params'), requirePermission('view_users'), getUserById);
router.post('/', validate(createUserSchema), requirePermission('create_users'), createUser);
router.put('/:id', validate(userIdSchema, 'params'), validate(updateUserSchema), requirePermission('edit_users'), updateUser);
router.delete('/:id', validate(userIdSchema, 'params'), requirePermission('delete_users'), deleteUser);

export default router;
