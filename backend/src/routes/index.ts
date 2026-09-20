import { Router } from 'express';
import healthRouter from './health.routes';
import authRouter from './auth.routes';
import programsRouter from './programs.routes';
import volunteersRouter from './volunteers.routes';
import donorsRouter from './donors.routes';
import statsRouter from './stats.routes';
import partnershipsRouter from './partnerships.routes';
import branchesRouter from './branches.routes';
import teamRouter from './team.routes';
import annualReportsRouter from './annual-reports.routes';
import policiesRouter from './policies.routes';
import siteContentRouter from './site-content.routes';
import usersRouter from './users.routes';
import rolesRouter from './roles.routes';
import { dbHealthCheck } from '../controllers/db-health.controller';
import { handleImageUpload, handleMultipleImagesUpload, upload } from '../controllers/upload.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole, requirePermission } from '../middleware/rbac.middleware';
import { cloudinaryHealthCheck } from '../controllers/cloudinary-health.controller';

import multer from 'multer';

const router = Router();

const handleUploadMiddleware = (uploadField: any) => {
  return (req: any, res: any, next: any) => {
    uploadField(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

/**
 * API Route Registry
 *
 * All routes are prefixed with /api in app.ts.
 */
router.use('/health', healthRouter);
router.get('/db-health', dbHealthCheck);
router.get('/cloudinary-health', cloudinaryHealthCheck);
router.use('/auth', authRouter);

// Uploads: open to super_admin, marketing, branch_manager (and legacy roles)
const UPLOAD_ROLES = ['super_admin', 'marketing', 'branch_manager', 'admin', 'content_manager'];
router.post('/admin/upload', authMiddleware, requireRole(UPLOAD_ROLES), requirePermission('upload_images'), handleUploadMiddleware(upload.single('image')), handleImageUpload);
router.post('/admin/upload-multiple', authMiddleware, requireRole(UPLOAD_ROLES), requirePermission('upload_images'), handleUploadMiddleware(upload.array('images', 20)), handleMultipleImagesUpload);

router.use('/programs', programsRouter);
router.use('/volunteers', volunteersRouter);
router.use('/donors', donorsRouter);
router.use('/stats', statsRouter);
router.use('/partnerships', partnershipsRouter);
router.use('/branches', branchesRouter);
router.use('/team', teamRouter);
router.use('/annual-reports', annualReportsRouter);
router.use('/policies', policiesRouter);
router.use('/site-content', siteContentRouter);
router.use('/users/admin', usersRouter);
router.use('/roles/admin', rolesRouter);

export default router;

