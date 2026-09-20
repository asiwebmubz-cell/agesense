import { Router } from 'express';
import {
  getPublishedAnnualReports,
  getAllAnnualReports,
  getAnnualReportById,
  createAnnualReport,
  updateAnnualReport,
  deleteAnnualReport,
} from '../controllers/annual-reports.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createAnnualReportSchema,
  updateAnnualReportSchema,
  annualReportIdSchema,
} from '../validators/annual-reports.validator';

const router = Router();

// Public routes
router.get('/', getPublishedAnnualReports);
router.get('/:id', validate(annualReportIdSchema, 'params'), getAnnualReportById);

// Admin routes (super_admin only)
router.get('/admin/all', authMiddleware, requireRole(['super_admin']), getAllAnnualReports);

router.post(
  '/admin',
  authMiddleware,
  requireRole(['super_admin']),
  validate(createAnnualReportSchema),
  createAnnualReport
);

router.put(
  '/admin/:id',
  authMiddleware,
  requireRole(['super_admin']),
  validate(annualReportIdSchema, 'params'),
  validate(updateAnnualReportSchema),
  updateAnnualReport
);

router.delete(
  '/admin/:id',
  authMiddleware,
  requireRole(['super_admin']),
  validate(annualReportIdSchema, 'params'),
  deleteAnnualReport
);

export default router;
