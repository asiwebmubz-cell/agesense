import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'email is required.' })
    .email('Please enter a valid email address.')
    .trim(),
  password: z
    .string({ required_error: 'password is required.' })
    .min(6, 'password must be at least 6 characters.'),
}).strict();

export type LoginInput = z.infer<typeof loginSchema>;
