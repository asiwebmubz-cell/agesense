import { db } from '../database';
import { logger } from './logger';

export const logSecurityEvent = async (params: {
  userId?: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
}) => {
  try {
    await db.query(
      `INSERT INTO security_logs (user_id, action, ip_address, user_agent, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        params.userId || null,
        params.action,
        params.ipAddress || null,
        params.userAgent || null,
        params.metadata ? JSON.stringify(params.metadata) : null,
      ]
    );
  } catch (error) {
    logger.error('Failed to write security log:', error);
  }
};
