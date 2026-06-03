import { Request, Response } from 'express';
import { partnershipsService } from '../services/partnerships.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { CreatePartnershipInput, UpdatePartnershipStatusInput } from '../validators/partnerships.validator';

/**
 * POST /api/partnerships
 * Submit a partnership inquiry. Public — rate limited.
 */
export const createPartnership = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreatePartnershipInput;
  const inquiry = await partnershipsService.create(input);
  res.status(201).json(inquiry);
});

/**
 * GET /api/partnerships/admin
 * Returns all partnership inquiries. Admin only.
 */
export const getAllPartnerships = asyncHandler(async (_req: Request, res: Response) => {
  const inquiries = await partnershipsService.getAll();
  res.status(200).json(inquiries);
});

/**
 * GET /api/partnerships/admin/:id
 * Returns a single inquiry with full activity timeline. Admin only.
 */
export const getPartnershipById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const inquiry = await partnershipsService.getById(id);
  res.status(200).json(inquiry);
});

/**
 * PUT /api/partnerships/admin/:id
 * Update status and/or internal notes. Admin only.
 */
export const updatePartnershipStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input = req.body as UpdatePartnershipStatusInput;
  const updated = await partnershipsService.updateStatus(id, input);
  res.status(200).json(updated);
});

/**
 * GET /api/partnerships/admin/stats
 * Dashboard aggregate statistics. Admin only.
 */
export const getPartnershipStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await partnershipsService.getStats();
  res.status(200).json(stats);
});
