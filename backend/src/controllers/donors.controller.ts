import { Request, Response } from 'express';
import { donorsService } from '../services/donors.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { CreateDonorInput } from '../validators/donors.validator';

/**
 * GET /api/admin/donors
 * Returns all donor records. Admin only.
 */
export const getAllDonors = asyncHandler(async (_req: Request, res: Response) => {
  const donors = await donorsService.getAll();
  res.status(200).json(donors);
});

/**
 * POST /api/donors
 * Record a new donation. Public.
 */
export const createDonor = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateDonorInput;
  const donor = await donorsService.create(input);
  res.status(201).json(donor);
});
