import { z } from 'zod';

const PROGRAM_TYPES = ['Our Programs', 'Our Work', 'Impact Stories'] as const;
const PROGRAM_STATUSES = ['Published', 'Draft'] as const;

export const createProgramSchema = z.object({
  type: z.enum(PROGRAM_TYPES, {
    errorMap: () => ({
      message: `type must be one of: ${PROGRAM_TYPES.join(', ')}`,
    }),
  }),
  title: z
    .string({ required_error: 'title is required.' })
    .min(3, 'title must be at least 3 characters.')
    .max(120, 'title must be under 120 characters.')
    .trim(),
  description: z
    .string({ required_error: 'description is required.' })
    .min(10, 'description must be at least 10 characters.')
    .trim(),
  image_url: z.string().url('image_url must be a valid URL.').or(z.literal('')).optional(),
  status: z.enum(PROGRAM_STATUSES).default('Draft'),

  // Extra details
  subtitle: z.string().optional(),
  video_url: z.string().url('video_url must be a valid URL.').or(z.literal('')).optional(),
  goals: z.string().optional(),
  beneficiaries: z.string().optional(),
  expense_categories: z.string().optional(),
  project_areas: z.string().optional(),
  duration: z.string().optional(),
  active_years: z.string().optional(),
  packages_distributed: z.string().optional(),
  gallery_title_1: z.string().optional(),
  gallery_link_1: z.string().url('gallery_link_1 must be a valid URL.').or(z.literal('')).optional(),
  gallery_title_2: z.string().optional(),
  gallery_link_2: z.string().url('gallery_link_2 must be a valid URL.').or(z.literal('')).optional(),
  gallery_description: z.string().optional(),
  images: z.array(z.string()).optional(),
}).strict();

export const updateProgramSchema = createProgramSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update.' }
);

export const programIdSchema = z.object({
  id: z.string().uuid('Program ID must be a valid UUID.'),
}).strict();

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
export type UpdateProgramInput = z.infer<typeof updateProgramSchema>;
