import type { CorsOptions } from 'cors';
import { env } from './env';

// Helper to normalize origins: trim spaces and strip trailing slashes
const normalizeOrigin = (url: string): string => {
  return url.trim().replace(/\/+$/, '');
};

// Build the base whitelist of static origins
const getStaticOrigins = (): string[] => {
  const list = [env.FRONTEND_URL];

  // If ALLOWED_ORIGINS is provided, parse and append it
  if (env.ALLOWED_ORIGINS) {
    const dynamicOrigins = env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean);
    list.push(...dynamicOrigins);
  }

  // Add localhost if in dev mode
  if (env.NODE_ENV === 'development') {
    list.push('http://localhost:3000');
    list.push('http://localhost:3001');
  }

  return list.map(normalizeOrigin);
};

// RegEx to securely match Vercel preview deployments (e.g., https://agesense-git-main.vercel.app)
const vercelPreviewRegex = /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/;

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // 1. Allow non-browser requests (e.g., server-to-server, Curl, Postman, Render health checks)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);
    const allowedOrigins = getStaticOrigins();

    // 2. Check direct whitelist matches
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // 3. Check Vercel preview subdomains pattern matches
    if (vercelPreviewRegex.test(normalizedOrigin)) {
      return callback(null, true);
    }

    // Reject all other origins
    return callback(new Error(`CORS policy does not allow origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 204,
};
