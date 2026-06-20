import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import * as argon2 from 'argon2';
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

    let isValidPassword = false;
    let needsMigration = false;

    if (user.password.length === 64 && /^[0-9a-f]{64}$/i.test(user.password)) {
      // Legacy SHA-256
      const hashedLegacy = crypto.createHash('sha256').update(password).digest('hex');
      if (user.password === hashedLegacy) {
        isValidPassword = true;
        needsMigration = true;
      }
    } else {
      // Argon2id
      try {
        isValidPassword = await argon2.verify(user.password, password);
      } catch (err) {
        isValidPassword = false;
      }
    }

    if (!isValidPassword) {
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

    // If legacy password matched, migrate to Argon2id immediately
    if (needsMigration) {
      const newHash = await argon2.hash(password, { type: argon2.argon2id });
      await db.query('UPDATE users SET password = $1 WHERE id = $2', [newHash, user.id]);
    }

    // Login successful
    await db.query(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = $1',
      [user.id]
    );

    const jti = crypto.randomUUID();
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role, jti },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const hashedRefreshToken = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const userAgent = req.headers['user-agent'] || '';

    await db.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at, user_agent) VALUES ($1, $2, $3, $4)',
      [user.id, hashedRefreshToken, refreshExpiresAt, userAgent]
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

    // Verify User-Agent fingerprint
    const incomingUserAgent = req.headers['user-agent'] || '';
    if (tokenRecord.user_agent !== incomingUserAgent) {
      // Fingerprint mismatch! Revoke the entire token family
      await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [tokenRecord.user_id]);
      
      await logSecurityEvent({
        userId: tokenRecord.user_id,
        action: 'refresh_failure',
        ipAddress: req.ip,
        userAgent: incomingUserAgent,
        metadata: { reason: 'fingerprint_mismatch', stored_agent: tokenRecord.user_agent }
      });
      throw new ApiError(401, 'Session context mismatch. Please log in again.');
    }

    const users = await db.query('SELECT * FROM users WHERE id = $1', [tokenRecord.user_id]);
    const user = users[0];

    if (!user) throw new ApiError(401, 'User not found.');

    const jti = crypto.randomUUID();
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role, jti },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Update last_used_at
    await db.query('UPDATE refresh_tokens SET last_used_at = NOW() WHERE token_hash = $1', [hashedToken]);

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

    // Extract JTI from Access Token to revoke it
    const authHeader = req.headers.authorization;
    let userId = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const decoded = jwt.verify(authHeader.split(' ')[1], env.JWT_SECRET) as any;
        userId = decoded.id;
        
        if (decoded.jti && decoded.exp) {
          const expiresAt = new Date(decoded.exp * 1000);
          await db.query(
            'INSERT INTO revoked_tokens (token_jti, expires_at) VALUES ($1, $2)',
            [decoded.jti, expiresAt]
          );
        }
      } catch (e) {
        // Token might already be expired, which is fine
      }
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
