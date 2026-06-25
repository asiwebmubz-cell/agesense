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
const sanitizeValue = (value: unknown, seen: WeakSet<object>): unknown => {
  if (typeof value === 'string') {
    return sanitizeHtml(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, seen));
  }

  if (value && typeof value === 'object') {
    return sanitizeObject(value as Record<string, unknown>, seen);
  }

  return value;
};

export const sanitizeObject = <T extends Record<string, unknown>>(
  obj: T,
  seen = new WeakSet<object>()
): T => {
  if (seen.has(obj)) {
    return obj;
  }

  seen.add(obj);

  const sanitized: any = Array.isArray(obj) ? [] : {};

  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeValue(value, seen);
  }

  return sanitized as T;
};
