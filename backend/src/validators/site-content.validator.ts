import { z } from 'zod';

export const updateSiteContentSchema = z.object({
  title: z.string().max(255).optional().nullable(),
  body: z.string({ required_error: 'body is required.' }).min(1, 'body cannot be empty.'),
  metadata: z.record(z.any()).optional().nullable(),
}).strict();

export const siteContentKeySchema = z.object({
  key: z.string().min(1, 'key is required.').max(100).regex(/^[a-z0-9_-]+$/, 'key must be alphanumeric with underscores or hyphens.'),
}).strict();

export type UpdateSiteContentInput = z.infer<typeof updateSiteContentSchema>;
