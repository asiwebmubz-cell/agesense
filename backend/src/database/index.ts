import { Pool } from 'pg';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 20,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
});

export const db = {
  /**
   * Helper to execute a query and return rows.
   */
  async query<T = any>(text: string, params?: any[]): Promise<T[]> {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug('executed query', { text, duration, rows: res.rowCount });
    return res.rows;
  },

  /**
   * Pings the database to verify active connection.
   */
  async checkConnection(): Promise<boolean> {
    try {
      const client = await pool.connect();
      client.release();
      return true;
    } catch (err) {
      logger.error('Database connection test failed:', err);
      return false;
    }
  },
};
