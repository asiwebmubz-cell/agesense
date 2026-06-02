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
   * Pings the database and returns details.
   */
  async checkConnection(): Promise<{ connected: boolean; error?: string; diagnostics: any }> {
    let host = 'unknown';
    let port = '5432';
    let database = 'unknown';

    try {
      if (env.DATABASE_URL.startsWith('postgresql://') || env.DATABASE_URL.startsWith('postgres://')) {
        const urlObj = new URL(env.DATABASE_URL);
        host = urlObj.hostname;
        port = urlObj.port || '5432';
        database = urlObj.pathname.replace(/^\//, '');
      } else {
        const hostMatch = env.DATABASE_URL.match(/host=([^; ]+)/);
        const portMatch = env.DATABASE_URL.match(/port=([^; ]+)/);
        const dbMatch = env.DATABASE_URL.match(/(?:dbname|database)=([^; ]+)/);
        if (hostMatch) host = hostMatch[1];
        if (portMatch) port = portMatch[1];
        if (dbMatch) database = dbMatch[1];
      }
    } catch (e) {
      // Ignored - fallback to unknown
    }

    const diagnostics = {
      host,
      port,
      database,
      ssl: 'rejectUnauthorized: false (Pool Configured)',
    };

    try {
      const client = await pool.connect();
      client.release();
      return { connected: true, diagnostics };
    } catch (err: any) {
      logger.error('Database connection test failed:', err);
      return { 
        connected: false, 
        error: err.message || String(err), 
        diagnostics 
      };
    }
  },
};
