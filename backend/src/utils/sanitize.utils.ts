import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes an HTML string to prevent XSS attacks.
 * Rejects scripts, executables, and malicious HTML injection.
 */
export const sanitizeHtml = (dirtyHtml: string): string => {
  if (!dirtyHtml) return dirtyHtml;
  return DOMPurify.sanitize(dirtyHtml, {
    USE_PROFILES: { html: true }, // Safe HTML only
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  });
};

/**
 * Deep sanitizes all string properties in an object.
 */
export const sanitizeObject = <T extends Record<string, any>>(obj: T): T => {
  const sanitized = { ...obj };
  for (const key of Object.keys(sanitized)) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeHtml(sanitized[key] as string) as any;
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeObject(sanitized[key]);
    }
  }
  return sanitized;
};
