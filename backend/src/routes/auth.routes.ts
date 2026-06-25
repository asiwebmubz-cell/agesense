import { Router } from 'express';
import { login, refresh, logout } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { loginSchema, refreshSchema, logoutSchema } from '../validators/auth.validator';
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

export default router;
