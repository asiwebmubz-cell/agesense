import { z } from 'zod';

export const createDonorSchema = z.object({
  name: z
    .string({ required_error: 'name is required.' })
    .min(2, 'name must be at least 2 characters.')
    .max(100, 'name must be under 100 characters.')
    .trim(),
  email: z
    .string({ required_error: 'email is required.' })
    .email('email must be a valid email address.')
    .toLowerCase(),
  amount: z
    .number({ required_error: 'amount is required.', invalid_type_error: 'amount must be a number.' })
    .positive('amount must be a positive number.')
    .finite(),
  payment_status: z
    .enum(['Pending', 'Completed', 'Failed'])
    .default('Pending'),
  transaction_id: z
    .string()
    .max(100, 'transaction_id must be under 100 characters.')
    .optional(),
});

export const donorIdSchema = z.object({
  id: z.string().uuid('Donor ID must be a valid UUID.'),
});

export type CreateDonorInput = z.infer<typeof createDonorSchema>;
