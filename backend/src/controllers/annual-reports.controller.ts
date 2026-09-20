import { Request, Response } from 'express';
import { annualReportsService } from '../services/annual-reports.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { CreateAnnualReportInput, UpdateAnnualReportInput } from '../validators/annual-reports.validator';

export const getPublishedAnnualReports = asyncHandler(async (_req: Request, res: Response) => {
  const reports = await annualReportsService.getPublished();
  res.status(200).json(reports);
});

export const getAllAnnualReports = asyncHandler(async (_req: Request, res: Response) => {
  const reports = await annualReportsService.getAll();
  res.status(200).json(reports);
});

export const getAnnualReportById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const report = await annualReportsService.getById(id);
  res.status(200).json(report);
});

export const createAnnualReport = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateAnnualReportInput;
  const report = await annualReportsService.create(input);
  res.status(201).json(report);
});

export const updateAnnualReport = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const input = req.body as UpdateAnnualReportInput;
  const report = await annualReportsService.update(id, input);
  res.status(200).json(report);
});

export const deleteAnnualReport = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const report = await annualReportsService.remove(id);
  res.status(200).json({ message: 'Annual report deleted successfully.', item: report });
});
