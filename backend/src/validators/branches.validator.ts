import { z } from 'zod';

export const createBranchSchema = z.object({
  name: z
    .string({ required_error: 'name is required.' })
    .min(2, 'name must be at least 2 characters.')
    .max(100, 'name must be under 100 characters.')
    .trim(),
  division: z
    .string({ required_error: 'division is required.' })
    .min(2, 'division must be at least 2 characters.')
    .max(100, 'division must be under 100 characters.')
    .trim(),
  description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  contact_info: z.any().optional().nullable(),
  image_url: z.string().url('image_url must be a valid URL.').or(z.literal('')).optional().nullable(),
  is_active: z.boolean().default(true),
  display_order: z.number().int().default(0),
}).strict();

export const updateBranchSchema = createBranchSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update.' }
);

export const branchIdSchema = z.object({
  id: z.string().uuid('Branch ID must be a valid UUID.'),
}).strict();

export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
