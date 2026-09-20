import { z } from 'zod';

export const createPolicySchema = z.object({
  title: z
    .string({ required_error: 'title is required.' })
    .min(3, 'title must be at least 3 characters.')
    .max(255, 'title must be under 255 characters.')
    .trim(),
  description: z.string().optional().nullable(),
  document_url: z.string().url('document_url must be a valid external URL.').optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  is_published: z.boolean().default(false),
  display_order: z.number().int().default(0),
}).strict();

export const updatePolicySchema = createPolicySchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update.' }
);

export const policyIdSchema = z.object({
  id: z.string().uuid('Policy ID must be a valid UUID.'),
}).strict();

export type CreatePolicyInput = z.infer<typeof createPolicySchema>;
export type UpdatePolicyInput = z.infer<typeof updatePolicySchema>;
