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

const router = Router();

// All user management routes strictly require super_admin
router.use(authMiddleware, requireRole(['super_admin']));

router.get('/', getAllUsers);
router.get('/:id', validate(userIdSchema, 'params'), getUserById);
router.post('/', validate(createUserSchema), createUser);
router.put('/:id', validate(userIdSchema, 'params'), validate(updateUserSchema), updateUser);
router.delete('/:id', validate(userIdSchema, 'params'), deleteUser);

export default router;
