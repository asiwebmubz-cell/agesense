import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import type { LoginInput } from '../validators/auth.validator';
import { db } from '../database';
import { logSecurityEvent } from '../utils/securityLogger';

export const login = asyncHandler(
  async (req: Request<{}, {}, LoginInput>, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const users = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (users.length === 0) {
      await logSecurityEvent({
        action: 'login_failure',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { email, reason: 'user_not_found' }
      });
      throw new ApiError(401, 'Invalid email or password.');
    }

    const user = users[0];

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      await logSecurityEvent({
        userId: user.id,
        action: 'login_failure',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { reason: 'account_locked' }
      });
      throw new ApiError(403, 'Account is locked. Please try again later.');
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    if (user.password !== hashedPassword) {
      const attempts = (user.failed_login_attempts || 0) + 1;
      let lockedUntil = null;
      if (attempts >= 5) {
        // Lock for 15 minutes
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await db.query(
        'UPDATE users SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3',
        [attempts, lockedUntil, user.id]
      );

      await logSecurityEvent({
        userId: user.id,
        action: 'login_failure',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { reason: 'invalid_password', attempts }
      });

      throw new ApiError(401, 'Invalid email or password.');
    }

    // Login successful
    await db.query(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = $1',
      [user.id]
    );

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const hashedRefreshToken = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, hashedRefreshToken, refreshExpiresAt]
    );

    await logSecurityEvent({
      userId: user.id,
      action: 'login_success',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      accessToken,
      refreshToken: rawRefreshToken
    });
  }
);

export const refresh = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new ApiError(400, 'Refresh token required.');

    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    
    // Find the token in DB
    const tokens = await db.query(
      'SELECT * FROM refresh_tokens WHERE token_hash = $1 AND expires_at > NOW()',
      [hashedToken]
    );

    if (tokens.length === 0) {
      await logSecurityEvent({
        action: 'refresh_failure',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { reason: 'invalid_or_expired_token' }
      });
      throw new ApiError(401, 'Invalid or expired refresh token.');
    }

    const tokenRecord = tokens[0];
    const users = await db.query('SELECT * FROM users WHERE id = $1', [tokenRecord.user_id]);
    const user = users[0];

    if (!user) throw new ApiError(401, 'User not found.');

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    await logSecurityEvent({
      userId: user.id,
      action: 'token_refresh',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({ success: true, accessToken });
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    
    if (refreshToken) {
      const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await db.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [hashedToken]);
    }

    // Try to get userId if access token was provided in header
    const authHeader = req.headers.authorization;
    let userId = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], env.JWT_SECRET) as any;
        userId = decoded.id;
      } catch (e) {}
    }

    await logSecurityEvent({
      userId,
      action: 'logout',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(200).json({ success: true, message: 'Logged out successfully.' });
  }
);
