import 'dotenv/config';
import https from 'https';
import cron from 'node-cron';

import { createApp } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const app = createApp();
const PORT = parseInt(env.PORT, 10);

// ─── Start HTTP server ────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  logger.info(`🚀 AgeSense Backend running on port ${PORT} [${env.NODE_ENV}]`);
  logger.info(`   Health check: http://localhost:${PORT}/api/health`);
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────
const shutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });

  // Force exit after 10s if connections don't drain
  setTimeout(() => {
    logger.error('Forced exit after timeout.');
    process.exit(1);
  }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// ─── Unhandled rejection / exception guards ───────────────────────────────────
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Promise Rejection:', reason);
  // Do NOT exit — let the app continue and report via error middleware
});

process.on('uncaughtException', (err: Error) => {
  logger.error('Uncaught Exception — shutting down:', err);
  process.exit(1); // Uncaught exceptions leave the app in undefined state
});

// ─── Background cron tasks ────────────────────────────────────────────────────

/**
 * Self-ping to prevent Render free tier from sleeping (every 12 minutes).
 */
cron.schedule('*/12 * * * *', () => {
  const externalUrl = env.RENDER_EXTERNAL_URL;
  if (!externalUrl) return;

  logger.debug('[Cron] Self-ping → keeping Render service active...');
  https
    .get(`${externalUrl}/api/health`, (res) => {
      logger.debug(`[Cron] Self-ping response: ${res.statusCode}`);
    })
    .on('error', (err) => {
      logger.warn(`[Cron] Self-ping failed: ${err.message}`);
    });
});

export default app;
