import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

/**
 * General API rate limiter — applied to all routes.
 * Allows 100 requests per 15-minute window per IP.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,   // Disable the deprecated `X-RateLimit-*` headers
  message: {
    error: 'Too many requests from this IP. Please try again after 15 minutes.',
  },
  skip: () => env.NODE_ENV === 'development', // Bypass in development
});

/**
 * Strict limiter for sensitive endpoints (auth, form submissions).
 * Allows 10 requests per 15-minute window per IP.
 */
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many attempts. Please try again after 15 minutes.',
  },
  skip: () => env.NODE_ENV === 'development',
});
