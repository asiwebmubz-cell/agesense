import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z
    .string({ required_error: 'name is required.' })
    .regex(/^[a-z][a-z_]{1,49}$/, 'name must be a lowercase identifier (letters and underscores).'),
  description: z.string().max(300).optional(),
  permissions: z.array(z.string()).optional(),
}).strict();

export const updateRoleSchema = z.object({
  description: z.string().max(300).optional(),
  permissions: z.array(z.string()).optional(),
}).strict().refine(
  (data) => data.description !== undefined || data.permissions !== undefined,
  { message: 'At least one field must be provided for update.' }
);

export const roleIdSchema = z.object({
  id: z.string().uuid('Role ID must be a valid UUID.'),
}).strict();

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;