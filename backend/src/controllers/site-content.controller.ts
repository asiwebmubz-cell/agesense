import { Request, Response } from 'express';
import { siteContentService } from '../services/site-content.service';
import { asyncHandler } from '../utils/asyncHandler';
import type { UpdateSiteContentInput } from '../validators/site-content.validator';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

export const getSiteContentByKey = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;
  const content = await siteContentService.getByKey(key);
  res.status(200).json(content);
});

export const getAllSiteContent = asyncHandler(async (_req: Request, res: Response) => {
  const all = await siteContentService.getAll();
  res.status(200).json(all);
});

export const updateSiteContentByKey = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { key } = req.params;
  const input = req.body as UpdateSiteContentInput;
  const updated = await siteContentService.updateByKey(key, input, req.user?.id);
  res.status(200).json(updated);
});
