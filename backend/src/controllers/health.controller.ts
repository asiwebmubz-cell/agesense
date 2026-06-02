import { Request, Response } from 'express';
import { env } from '../config/env';

/**
 * GET /api/health
 * Public health check endpoint.
 */
export const healthCheck = (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'healthy',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
};
