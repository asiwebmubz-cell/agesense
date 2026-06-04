import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { corsOptions } from './config/cors';
import { env } from './config/env';
import { generalLimiter } from './middleware/rateLimiter';
import { notFoundMiddleware } from './middleware/notFound.middleware';
import { errorMiddleware } from './middleware/error.middleware';
import { morganStream } from './utils/logger';
import apiRouter from './routes/index';

/**
 * Express App Factory
 *
 * Creates and configures the Express application.
 * Separated from server.ts so the app can be tested without starting a server.
 *
 * Middleware stack order:
 *  1. Security (Helmet)
 *  2. CORS
 *  3. Request logging (Morgan)
 *  4. Body parsing
 *  5. Global rate limiting
 *  6. API routes
 *  7. 404 handler
 *  8. Global error handler
 */
export function createApp(): Application {
  const app = express();

  // Trust Render's proxy layer for accurate client IP tracking
  app.set('trust proxy', 1);

  // ─── 1. Security headers ───────────────────────────────────────────────────
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // ─── 2. CORS ───────────────────────────────────────────────────────────────
  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions)); // Pre-flight for all routes

  // ─── 3. HTTP request logging ───────────────────────────────────────────────
  const morganFormat = env.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(morgan(morganFormat, { stream: morganStream }));

  // ─── 4. Body parsing ───────────────────────────────────────────────────────
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // ─── 5. Global rate limiting ───────────────────────────────────────────────
  app.use(generalLimiter);

  // ─── 6. API Routes ─────────────────────────────────────────────────────────
  app.use('/api', apiRouter);

  // ─── 7. 404 — must come after all routes ──────────────────────────────────
  app.use(notFoundMiddleware);

  // ─── 8. Global error handler — must be last ───────────────────────────────
  app.use(errorMiddleware);

  return app;
}
