import { z } from 'zod';

const COMMITTEES = ['Executive Committee', 'Advisory Board'] as const;

export const createTeamMemberSchema = z.object({
  branch_id: z.string({ required_error: 'branch_id is required.' }).uuid('branch_id must be a valid UUID.'),
  name: z
    .string({ required_error: 'name is required.' })
    .min(2, 'name must be at least 2 characters.')
    .max(150, 'name must be under 150 characters.')
    .trim(),
  position: z
    .string({ required_error: 'position is required.' })
    .min(2, 'position must be at least 2 characters.')
    .max(150, 'position must be under 150 characters.')
    .trim(),
  committee: z.enum(COMMITTEES, {
    errorMap: () => ({ message: `committee must be one of: ${COMMITTEES.join(', ')}` }),
  }),
  photo_url: z.string().url('photo_url must be a valid URL.').or(z.literal('')).optional().nullable(),
  biography: z.string().optional().nullable(),
  display_order: z.number().int().default(0),
  hierarchy_level: z.number().int().min(1).default(1),
  is_active: z.boolean().default(true),
}).strict();

export const updateTeamMemberSchema = createTeamMemberSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update.' }
);

export const teamMemberIdSchema = z.object({
  id: z.string().uuid('Team Member ID must be a valid UUID.'),
}).strict();

export type CreateTeamMemberInput = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberSchema>;
