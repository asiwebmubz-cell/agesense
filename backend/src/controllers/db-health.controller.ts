import { Request, Response } from 'express';
import { db } from '../database';

/**
 * GET /api/db-health
 * Dedicated database health check endpoint.
 */
export const dbHealthCheck = async (_req: Request, res: Response): Promise<void> => {
  const isConnected = await db.checkConnection();

  if (!isConnected) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.status(200).json({
    status: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString(),
  });
};
