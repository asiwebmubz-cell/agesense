import { Request, Response } from 'express';
import { statsService } from '../services/stats.service';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * GET /api/stats
 * Public endpoint to fetch real database stats/metrics.
 */
export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const metrics = await statsService.getMetrics();
  res.status(200).json(metrics);
});
