import { z } from 'zod';

export const createAnnualReportSchema = z.object({
  year: z
    .number({ required_error: 'year is required.' })
    .int('year must be an integer.')
    .min(2000, 'year must be 2000 or later.')
    .max(2100, 'year must be 2100 or earlier.'),
  title: z
    .string({ required_error: 'title is required.' })
    .min(3, 'title must be at least 3 characters.')
    .max(255, 'title must be under 255 characters.')
    .trim(),
  description: z.string().optional().nullable(),
  pdf_url: z.string().url('pdf_url must be a valid external URL.').optional().nullable(),
  is_published: z.boolean().default(false),
  display_order: z.number().int().default(0),
}).strict();

export const updateAnnualReportSchema = createAnnualReportSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update.' }
);

export const annualReportIdSchema = z.object({
  id: z.string().uuid('Report ID must be a valid UUID.'),
}).strict();

export type CreateAnnualReportInput = z.infer<typeof createAnnualReportSchema>;
export type UpdateAnnualReportInput = z.infer<typeof updateAnnualReportSchema>;
