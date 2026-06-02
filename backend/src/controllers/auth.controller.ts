import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import type { LoginInput } from '../validators/auth.validator';
import { db } from '../database';

/**
 * POST /api/auth/login
 * Authenticate admin and return JWT token
 */
export const login = asyncHandler(
  async (req: Request<{}, {}, LoginInput>, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Check credentials against database
    const users = await db.query('SELECT * FROM users WHERE email = $1 AND password = $2', [
      email,
      hashedPassword,
    ]);

    if (users.length === 0) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    // Generate JWT token (expires in 8 hours)
    const token = jwt.sign(
      { email },
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
