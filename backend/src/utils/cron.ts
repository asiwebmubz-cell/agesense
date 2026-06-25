import cron from 'node-cron';
import { pool } from '../database';
import { logger } from './logger';

/**
 * Initializes scheduled cron jobs for the backend.
 */
export const initCronJobs = () => {
  // Run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    logger.info('Starting daily database cleanup cron job...');
    
    try {
      // 1. Clean up expired revoked access tokens
      const revokedResult = await pool.query('DELETE FROM revoked_tokens WHERE expires_at < NOW()');
      logger.info(`Deleted ${revokedResult.rowCount} expired revoked tokens.`);

      // 2. Clean up expired refresh tokens
      const refreshResult = await pool.query('DELETE FROM refresh_tokens WHERE expires_at < NOW()');
      logger.info(`Deleted ${refreshResult.rowCount} expired refresh tokens.`);

      // 3. Clean up security logs older than 180 days
      const logsResult = await pool.query("DELETE FROM security_logs WHERE created_at < NOW() - INTERVAL '180 days'");
      logger.info(`Deleted ${logsResult.rowCount} old security logs.`);

    } catch (err: any) {
      logger.error(`Error during database cleanup cron job: ${err.message}`);
    }
  });

  logger.info('Cron jobs initialized successfully.');
};
