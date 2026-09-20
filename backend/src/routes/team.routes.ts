import { Router } from 'express';
import {
  getActiveTeam,
  getAllTeam,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/team.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole, requirePermission } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createTeamMemberSchema,
  updateTeamMemberSchema,
  teamMemberIdSchema,
} from '../validators/team.validator';

const router = Router();

// Public routes
router.get('/', getActiveTeam);
router.get('/:id', validate(teamMemberIdSchema, 'params'), getTeamMemberById);

// Admin routes (super_admin has full control; branch_manager can manage within own branch)
router.get(
  '/admin/all',
  authMiddleware,
  requireRole(['super_admin', 'branch_manager']),
  requirePermission('view_team'),
  getAllTeam
);

router.post(
  '/admin',
  authMiddleware,
  requireRole(['super_admin', 'branch_manager']),
  requirePermission('create_team'),
  validate(createTeamMemberSchema),
  createTeamMember
);

router.put(
  '/admin/:id',
  authMiddleware,
  requireRole(['super_admin', 'branch_manager']),
  requirePermission('edit_team'),
  validate(teamMemberIdSchema, 'params'),
  validate(updateTeamMemberSchema),
  updateTeamMember
);

router.delete(
  '/admin/:id',
  authMiddleware,
  requireRole(['super_admin', 'branch_manager']),
  requirePermission('delete_team'),
  validate(teamMemberIdSchema, 'params'),
  deleteTeamMember
);

export default router;
