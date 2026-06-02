import { Request, Response } from 'express';
import { programsService } from '../services/programs.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { CreateProgramInput, UpdateProgramInput } from '../validators/programs.validator';

/**
 * GET /api/programs
 * Returns all published programs. Public.
 */
export const getPublishedPrograms = asyncHandler(async (_req: Request, res: Response) => {
  const programs = await programsService.getPublished();
  res.status(200).json(programs);
});

/**
 * GET /api/admin/programs
 * Returns all programs including drafts. Admin only.
 */
export const getAllPrograms = asyncHandler(async (_req: Request, res: Response) => {
  const programs = await programsService.getAll();
  res.status(200).json(programs);
});

/**
 * POST /api/admin/programs
 * Create a new program. Admin only.
 */
export const createProgram = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateProgramInput;
  const program = await programsService.create(input);
  res.status(201).json(program);
});

/**
 * PUT /api/admin/programs/:id
 * Update an existing program. Admin only.
 */
export const updateProgram = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input = req.body as UpdateProgramInput;
  const updated = await programsService.update(id, input);
  res.status(200).json(updated);
});

/**
 * DELETE /api/admin/programs/:id
 * Delete a program. Admin only.
 */
export const deleteProgram = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const removed = await programsService.remove(id);
  res.status(200).json({ message: 'Program deleted successfully.', item: removed });
});
