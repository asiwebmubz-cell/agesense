import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

/**
 * GET /api/cloudinary-health
 * Dedicated Cloudinary connection health check endpoint.
 */
export const cloudinaryHealthCheck = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Ping Cloudinary Admin API to test authentication credentials and routing connection
    await cloudinary.api.ping();

    res.status(200).json({
      status: 'healthy',
      cloudinary: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(503).json({
      status: 'unhealthy',
      cloudinary: 'disconnected',
      error: err.message || 'Authentication or API ping failed.',
      timestamp: new Date().toISOString(),
    });
  }
};
