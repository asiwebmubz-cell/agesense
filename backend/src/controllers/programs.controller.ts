import { Request, Response } from 'express';
import { programsService } from '../services/programs.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { CreateProgramInput, UpdateProgramInput } from '../validators/programs.validator';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

/**
 * GET /api/programs
 * Returns all published programs. Public.
 */
export const getPublishedPrograms = asyncHandler(async (req: Request, res: Response) => {
  const branchId = req.query.branch_id as string | undefined;
  const programs = await programsService.getPublished(branchId);
  res.status(200).json(programs);
});

/**
 * GET /api/programs/admin
 * Returns all programs including drafts. Admin only.
 * Branch managers only see their branch programs.
 */
export const getAllPrograms = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const isBranchManager = req.user?.role === 'branch_manager';
  const branchId = isBranchManager ? req.user?.branch_id : null;
  const programs = await programsService.getAll(branchId);
  res.status(200).json(programs);
});

/**
 * POST /api/programs/admin
 * Create a new program. Admin only.
 */
export const createProgram = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const input = req.body as CreateProgramInput;
  const isBranchManager = req.user?.role === 'branch_manager';
  const enforcedBranchId = isBranchManager ? req.user?.branch_id : undefined;

  const program = await programsService.create(input, enforcedBranchId);
  res.status(201).json(program);
});

/**
 * PUT /api/programs/admin/:id
 * Update an existing program. Admin only.
 */
export const updateProgram = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const input = req.body as UpdateProgramInput;
  const isBranchManager = req.user?.role === 'branch_manager';
  const enforcedBranchId = isBranchManager ? req.user?.branch_id : undefined;

  const updated = await programsService.update(id, input, enforcedBranchId);
  res.status(200).json(updated);
});

/**
 * DELETE /api/programs/admin/:id
 * Delete a program. Admin only.
 */
export const deleteProgram = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const isBranchManager = req.user?.role === 'branch_manager';
  const enforcedBranchId = isBranchManager ? req.user?.branch_id : undefined;

  const removed = await programsService.remove(id, enforcedBranchId);
  res.status(200).json({ message: 'Program deleted successfully.', item: removed });
});

