import { Request, Response, NextFunction } from 'express';
import { sanitizeObject } from '../utils/sanitize.utils';

/**
 * Middleware to deep sanitize the req.body, req.query, and req.params using DOMPurify.
 */
export const sanitizeMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query as Record<string, any>);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
};
