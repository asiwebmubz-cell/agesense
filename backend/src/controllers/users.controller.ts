import { Response } from 'express';
import { usersService } from '../services/users.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { CreateUserInput, UpdateUserInput } from '../validators/users.validator';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getAllUsers = asyncHandler(async (_req: AuthenticatedRequest, res: Response) => {
  const users = await usersService.getAll();
  res.status(200).json(users);
});

export const getUserById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = await usersService.getById(id);
  res.status(200).json(user);
});

export const createUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const input = req.body as CreateUserInput;
  const user = await usersService.create(input);
  res.status(201).json(user);
});

export const updateUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const input = req.body as UpdateUserInput;
  const updated = await usersService.update(id, input, req.user?.id);
  res.status(200).json(updated);
});

export const deleteUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const deleted = await usersService.remove(id, req.user?.id);
  res.status(200).json({ message: 'User deleted successfully.', item: deleted });
});
