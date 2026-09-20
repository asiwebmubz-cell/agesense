import { z } from 'zod';

// Role values are validated against the `roles` table in the service layer
// (supports the three active roles plus future custom roles).
// Legacy roles (admin, content_manager) exist in the roles table but are
// marked non-assignable, so they cannot be given to NEW users.
const roleSchema = z
  .string({ required_error: 'role is required.' })
  .regex(/^[a-z][a-z_]{1,49}$/, 'role must be a lowercase identifier (letters and underscores).');

export const createUserSchema = z.object({
  name: z
    .string({ required_error: 'name is required.' })
    .min(2, 'name must be at least 2 characters.')
    .max(150, 'name must be under 150 characters.')
    .trim(),
  email: z
    .string({ required_error: 'email is required.' })
    .email('Please enter a valid email address.')
    .trim(),
  password: z
    .string({ required_error: 'password is required.' })
    .min(8, 'password must be at least 8 characters.'),
  role: roleSchema,
  branch_id: z.string().uuid('branch_id must be a valid UUID.').optional().nullable(),
  is_active: z.boolean().default(true),
}).superRefine((data, ctx) => {
  if (data.role === 'branch_manager' && !data.branch_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'branch_id is required when role is branch_manager.',
      path: ['branch_id'],
    });
  }
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(150).trim().optional(),
  email: z.string().email().trim().optional(),
  password: z.string().min(8).optional(),
  role: roleSchema.optional(),
  branch_id: z.string().uuid().optional().nullable(),
  is_active: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update.' }
);

export const userIdSchema = z.object({
  id: z.string().uuid('User ID must be a valid UUID.'),
}).strict();

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
