import { Request, Response } from 'express';
import { db } from '../database';

/**
 * GET /api/db-health
 * Dedicated database health check endpoint.
 */
export const dbHealthCheck = async (_req: Request, res: Response): Promise<void> => {
  const result = await db.checkConnection();

  if (!result.connected) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: result.error,
      diagnostics: result.diagnostics,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  res.status(200).json({
    status: 'healthy',
    database: 'connected',
    diagnostics: result.diagnostics,
    timestamp: new Date().toISOString(),
  });
};
