import { Router } from 'express';
import { login, refresh, logout, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import {
  loginSchema,
  refreshSchema,
  logoutSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validators/auth.validator';
import { strictLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * POST /api/auth/login
 * Public login endpoint with rate limiting
 */
router.post('/login', strictLimiter, validate(loginSchema), login);

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', strictLimiter, validate(refreshSchema), refresh);

/**
 * POST /api/auth/logout
 * Invalidate refresh token
 */
router.post('/logout', strictLimiter, validate(logoutSchema), logout);

/**
 * POST /api/auth/forgot-password
 * Public forgot password endpoint
 */
router.post('/forgot-password', strictLimiter, validate(forgotPasswordSchema), forgotPassword);

/**
 * POST /api/auth/reset-password
 * Public reset password endpoint
 */
router.post('/reset-password', strictLimiter, validate(resetPasswordSchema), resetPassword);

export default router;

