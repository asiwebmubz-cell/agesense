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
  phone: z
    .string({ required_error: 'phone is required.' })
    .min(6, 'phone must be at least 6 characters.')
    .max(50, 'phone must be under 50 characters.')
    .trim(),
  amount: z
    .number({ required_error: 'amount is required.', invalid_type_error: 'amount must be a number.' })
    .positive('amount must be a positive number.')
    .finite(),
  payment_method: z
    .enum(['bKash', 'Nagad', 'Rocket', 'Bank Transfer'], { required_error: 'payment_method is required.' }),
  payment_status: z
    .enum(['Pending', 'Verified', 'Rejected'])
    .default('Pending'),
  transaction_id: z
    .string({ required_error: 'transaction_id is required.' })
    .min(3, 'transaction_id must be at least 3 characters.')
    .max(100, 'transaction_id must be under 100 characters.')
    .trim(),
});

export const updateDonorStatusSchema = z.object({
  status: z.enum(['Pending', 'Verified', 'Rejected'], { required_error: 'status is required.' }),
  admin_notes: z.string().max(1000, 'admin_notes must be under 1000 characters.').optional(),
});

export const donorIdSchema = z.object({
  id: z.string().uuid('Donor ID must be a valid UUID.'),
});

export type CreateDonorInput = z.infer<typeof createDonorSchema>;
export type UpdateDonorStatusInput = z.infer<typeof updateDonorStatusSchema>;

