import { Router } from 'express';
import healthRouter from './health.routes';
import authRouter from './auth.routes';
import programsRouter from './programs.routes';
import volunteersRouter from './volunteers.routes';
import donorsRouter from './donors.routes';

const router = Router();

/**
 * API Route Registry
 *
 * All routes are prefixed with /api in app.ts.
 *
 * Health:      GET  /api/health
 * Auth:        POST /api/auth/login
 * Programs:    GET  /api/programs           (public)
 *              CRUD /api/programs/admin      (auth)
 * Volunteers:  POST /api/volunteers          (public)
 *              CRUD /api/volunteers/admin    (auth)
 * Donors:      POST /api/donors             (public)
 *              GET  /api/donors/admin        (auth)
 */
router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/programs', programsRouter);
router.use('/volunteers', volunteersRouter);
router.use('/donors', donorsRouter);

export default router;
