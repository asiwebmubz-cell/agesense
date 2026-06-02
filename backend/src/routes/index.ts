import { Router } from 'express';
import healthRouter from './health.routes';
import authRouter from './auth.routes';
import programsRouter from './programs.routes';
import volunteersRouter from './volunteers.routes';
import donorsRouter from './donors.routes';
import statsRouter from './stats.routes';
import { dbHealthCheck } from '../controllers/db-health.controller';
import { handleImageUpload, upload } from '../controllers/upload.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { cloudinaryHealthCheck } from '../controllers/cloudinary-health.controller';

const router = Router();

/**
 * API Route Registry
 *
 * All routes are prefixed with /api in app.ts.
 *
 * Health:           GET  /api/health
 * DB Health:        GET  /api/db-health
 * Cloudinary Health: GET /api/cloudinary-health
 * Auth:             POST /api/auth/login
 * Admin Upload:     POST /api/admin/upload       (auth)
 * Programs:         GET  /api/programs           (public)
 *                   CRUD /api/programs/admin      (auth)
 * Volunteers:       POST /api/volunteers          (public)
 *                   CRUD /api/volunteers/admin    (auth)
 * Donors:           POST /api/donors             (public)
 *                   GET  /api/donors/admin        (auth)
 * Stats:            GET  /api/stats              (public)
 */
router.use('/health', healthRouter);
router.get('/db-health', dbHealthCheck);
router.get('/cloudinary-health', cloudinaryHealthCheck);
router.use('/auth', authRouter);
router.post('/admin/upload', authMiddleware, upload.single('image'), handleImageUpload);
router.use('/programs', programsRouter);
router.use('/volunteers', volunteersRouter);
router.use('/donors', donorsRouter);
router.use('/stats', statsRouter);

export default router;
