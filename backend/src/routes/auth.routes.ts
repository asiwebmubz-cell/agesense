import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { loginSchema } from '../validators/auth.validator';
import { strictLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * POST /api/auth/login
 * Public login endpoint with rate limiting
 */
router.post('/login', strictLimiter, validate(loginSchema), login);

export default router;
