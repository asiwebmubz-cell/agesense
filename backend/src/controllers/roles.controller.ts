import { Response } from 'express';
import { rolesService } from '../services/roles.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';
import type { CreateRoleInput, UpdateRoleInput } from '../validators/roles.validator';

export const getAllRoles = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const roles = await rolesService.getAll();
  res.status(200).json(roles);
});

export const getRoleById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const role = await rolesService.getById(req.params.id);
  res.status(200).json(role);
});

export const createRole = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const input = req.body as CreateRoleInput;
  const role = await rolesService.create(input);
  res.status(201).json(role);
});

export const updateRole = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const input = req.body as UpdateRoleInput;
  const role = await rolesService.update(id, input);
  res.status(200).json(role);
});

export const deleteRole = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const role = await rolesService.remove(id);
  res.status(200).json({ message: 'Role deleted successfully.', item: role });
});