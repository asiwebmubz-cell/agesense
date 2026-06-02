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

/**
 * GET /api/admin/donors/export
 * Export donor transactions to Excel/CSV sheet. Admin only.
 */
export const exportDonors = asyncHandler(async (_req: Request, res: Response) => {
  const donors = await donorsService.getAll();

  let csv = 'ID,Name,Email,Amount,Payment Status,Transaction ID,Donated At\n';
  donors.forEach(d => {
    const cleanName = (d.name || '').replace(/"/g, '""');
    csv += `"${d.id}","${cleanName}","${d.email}",${d.amount},"${d.payment_status}","${d.transaction_id || ''}","${d.created_at}"\n`;
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=donors.xlsx');
  res.status(200).send(Buffer.from(csv, 'utf-8'));
});
