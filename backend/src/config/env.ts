import { z } from 'zod';

// Helper to treat empty strings as undefined for optional environment variables
const emptyStringToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((val) => (val === '' ? undefined : val), schema);

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),

  // CORS
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  ALLOWED_ORIGINS: emptyStringToUndefined(z.string().optional()),

  // Auth
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email address'),
  ADMIN_PASSWORD: z.string().min(6, 'ADMIN_PASSWORD must be at least 6 characters'),

  // Database connection string
  DATABASE_URL: z.string({ required_error: 'DATABASE_URL is required' }).min(1),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string({ required_error: 'CLOUDINARY_CLOUD_NAME is required' }).min(1),
  CLOUDINARY_API_KEY: z.string({ required_error: 'CLOUDINARY_API_KEY is required' }).min(1),
  CLOUDINARY_API_SECRET: z.string({ required_error: 'CLOUDINARY_API_SECRET is required' }).min(1),

  // ImgBB (optional / legacy)
  IMGBB_API_KEY: emptyStringToUndefined(z.string().optional()),

  // Render keep-alive
  RENDER_EXTERNAL_URL: emptyStringToUndefined(z.string().url().optional()),
});

type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:\n', result.error.format());
    process.exit(1);
  }

  return result.data;
}

export const env = loadEnv();


