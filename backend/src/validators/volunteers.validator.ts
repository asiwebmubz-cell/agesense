import { z } from 'zod';

export const createVolunteerSchema = z.object({
  full_name: z
    .string({ required_error: 'full_name is required.' })
    .min(2, 'full_name must be at least 2 characters.')
    .max(100, 'full_name must be under 100 characters.')
    .trim(),
  email: z
    .string({ required_error: 'email is required.' })
    .email('email must be a valid email address.')
    .toLowerCase(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-().]{7,20}$/, 'phone must be a valid phone number.')
    .optional(),
  form_data: z.record(z.unknown()).optional(),
});

export const updateVolunteerStatusSchema = z.object({
  status: z.enum(['Pending', 'Approved', 'Rejected'], {
    errorMap: () => ({ message: 'status must be Pending, Approved, or Rejected.' }),
  }),
});

export const volunteerIdSchema = z.object({
  id: z.string().uuid('Volunteer ID must be a valid UUID.'),
});

export type CreateVolunteerInput = z.infer<typeof createVolunteerSchema>;
export type UpdateVolunteerStatusInput = z.infer<typeof updateVolunteerStatusSchema>;
