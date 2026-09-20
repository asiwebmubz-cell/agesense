import { Request, Response } from 'express';
import { branchesService } from '../services/branches.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { CreateBranchInput, UpdateBranchInput } from '../validators/branches.validator';

export const getActiveBranches = asyncHandler(async (_req: Request, res: Response) => {
  const branches = await branchesService.getActive();
  res.status(200).json(branches);
});

export const getAllBranches = asyncHandler(async (_req: Request, res: Response) => {
  const branches = await branchesService.getAll();
  res.status(200).json(branches);
});

export const getBranchById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const branch = await branchesService.getById(id);
  res.status(200).json(branch);
});

export const createBranch = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateBranchInput;
  const branch = await branchesService.create(input);
  res.status(201).json(branch);
});

export const updateBranch = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input = req.body as UpdateBranchInput;
  const branch = await branchesService.update(id, input);
  res.status(200).json(branch);
});

export const deleteBranch = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const branch = await branchesService.remove(id);
  res.status(200).json({ message: 'Branch deleted successfully.', item: branch });
});
