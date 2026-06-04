import { Request, Response } from 'express';
import { donorsService } from '../services/donors.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { CreateDonorInput, UpdateDonorStatusInput } from '../validators/donors.validator';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

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

/**
 * PUT /api/donors/admin/:id
 * Update donor verification status and details. Admin only.
 */
export const updateDonorStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const adminEmail = req.user?.email || 'System';
  const { status, admin_notes } = req.body as UpdateDonorStatusInput;
  const updated = await donorsService.updateStatus(id, status, admin_notes, adminEmail);
  res.status(200).json(updated);
});

/**
 * GET /api/admin/donors/export
 * Export donor transactions to CSV sheet. Admin only.
 */
export const exportDonors = asyncHandler(async (_req: Request, res: Response) => {
  const donors = await donorsService.getAll();

  let csv = 'Name,Email,Phone,Amount,Payment Method,Transaction ID,Status,Verified By,Verified At,Created At\n';
  donors.forEach(d => {
    const cleanName = (d.name || '').replace(/"/g, '""');
    const cleanEmail = (d.email || '').replace(/"/g, '""');
    const cleanPhone = (d.phone || '').replace(/"/g, '""');
    const cleanPaymentMethod = (d.payment_method || '').replace(/"/g, '""');
    const cleanStatus = (d.payment_status || '').replace(/"/g, '""');
    const cleanVerifiedBy = (d.verified_by || '').replace(/"/g, '""');
    const cleanVerifiedAt = d.verified_at ? new Date(d.verified_at).toISOString() : '';
    const cleanCreatedAt = d.created_at ? new Date(d.created_at).toISOString() : '';
    csv += `"${cleanName}","${cleanEmail}","${cleanPhone}",${d.amount},"${cleanPaymentMethod}","${d.transaction_id || ''}","${cleanStatus}","${cleanVerifiedBy}","${cleanVerifiedAt}","${cleanCreatedAt}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=donors.csv');
  res.status(200).send(Buffer.from(csv, 'utf-8'));
});

