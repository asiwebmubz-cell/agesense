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

export const refreshSchema = z.object({
  refreshToken: z.string({ required_error: 'refreshToken is required.' }).min(1),
}).strict();

export const logoutSchema = z.object({
  refreshToken: z.string().optional(),
}).strict();

export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'email is required.' })
    .email('Please enter a valid email address.')
    .trim(),
}).strict();

export const resetPasswordSchema = z.object({
  token: z.string({ required_error: 'token is required.' }).min(1),
  newPassword: z
    .string({ required_error: 'newPassword is required.' })
    .min(8, 'newPassword must be at least 8 characters.'),
}).strict();

export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
