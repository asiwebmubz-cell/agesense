import { Request, Response } from 'express';
import { volunteersService } from '../services/volunteers.service';
import { asyncHandler } from '../utils/asyncHandler';
import type {
  CreateVolunteerInput,
  UpdateVolunteerStatusInput,
} from '../validators/volunteers.validator';

/**
 * GET /api/admin/volunteers
 * Returns all volunteer applications. Admin only.
 */
export const getAllVolunteers = asyncHandler(async (_req: Request, res: Response) => {
  const volunteers = await volunteersService.getAll();
  res.status(200).json(volunteers);
});

/**
 * POST /api/volunteers
 * Submit a volunteer application. Public.
 */
export const createVolunteer = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateVolunteerInput;
  const volunteer = await volunteersService.create(input);
  res.status(201).json(volunteer);
});

/**
 * PUT /api/admin/volunteers/:id
 * Update volunteer status (Approve / Reject). Admin only.
 */
export const updateVolunteerStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input = req.body as UpdateVolunteerStatusInput;
  const updated = await volunteersService.updateStatus(id, input);
  res.status(200).json(updated);
});

/**
 * GET /api/admin/volunteers/export
 * Export volunteer submissions to Excel/CSV sheet. Admin only.
 */
export const exportVolunteers = asyncHandler(async (_req: Request, res: Response) => {
  const volunteers = await volunteersService.getAll();
  
  let csv = 'ID,Full Name,Email,Phone,Status,Applied At\n';
  volunteers.forEach(v => {
    const cleanName = (v.full_name || '').replace(/"/g, '""');
    csv += `"${v.id}","${cleanName}","${v.email}","${v.phone || ''}","${v.status}","${v.created_at}"\n`;
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=volunteers.xlsx');
  res.status(200).send(Buffer.from(csv, 'utf-8'));
});
