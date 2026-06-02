import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import type { LoginInput } from '../validators/auth.validator';

/**
 * POST /api/auth/login
 * Authenticate admin and return JWT token
 */
export const login = asyncHandler(
  async (req: Request<{}, {}, LoginInput>, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Check credentials against environment variables
    if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    // Generate JWT token (expires in 8 hours)
    const token = jwt.sign(
      { email: env.ADMIN_EMAIL },
      env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
    });
  }
);
