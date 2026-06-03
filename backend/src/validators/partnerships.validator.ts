import { z } from 'zod';

// ─── Enum ──────────────────────────────────────────────────────────────────────

export const PARTNERSHIP_TYPES = [
  'Corporate Partnership',
  'NGO Partnership',
  'Academic Partnership',
  'Healthcare Partnership',
  'Research Collaboration',
  'Sponsorship',
  'Volunteer Organization Partnership',
  'Technology Partnership',
  'Other',
] as const;

export type PartnershipType = typeof PARTNERSHIP_TYPES[number];

export const PARTNERSHIP_STATUSES = [
  'New',
  'Contacted',
  'In Discussion',
  'Approved',
  'Rejected',
  'Closed',
] as const;

export type PartnershipStatus = typeof PARTNERSHIP_STATUSES[number];

// ─── Schemas ───────────────────────────────────────────────────────────────────

/** Public form submission schema */
export const createPartnershipSchema = z.object({
  organization_name: z
    .string({ required_error: 'organization_name is required.' })
    .min(2, 'organization_name must be at least 2 characters.')
    .max(255, 'organization_name must be under 255 characters.')
    .trim(),

  contact_person: z
    .string({ required_error: 'contact_person is required.' })
    .min(2, 'contact_person must be at least 2 characters.')
    .max(255, 'contact_person must be under 255 characters.')
    .trim(),

  email: z
    .string({ required_error: 'email is required.' })
    .email('email must be a valid email address.')
    .max(255, 'email must be under 255 characters.')
    .toLowerCase()
    .trim(),

  phone: z
    .string()
    .regex(/^\+?[\d\s\-().]{7,25}$/, 'phone must be a valid phone number.')
    .optional()
    .or(z.literal('')),

  partnership_type: z.enum(PARTNERSHIP_TYPES, {
    errorMap: () => ({
      message: `partnership_type must be one of: ${PARTNERSHIP_TYPES.join(', ')}.`,
    }),
  }),

  message: z
    .string({ required_error: 'message is required.' })
    .min(10, 'message must be at least 10 characters.')
    .max(5000, 'message must be under 5000 characters.')
    .trim(),
});

/** Admin status update schema */
export const updatePartnershipStatusSchema = z.object({
  status: z.enum(PARTNERSHIP_STATUSES, {
    errorMap: () => ({
      message: `status must be one of: ${PARTNERSHIP_STATUSES.join(', ')}.`,
    }),
  }),
  internal_notes: z.string().max(10000).optional(),
});

/** UUID param validation */
export const partnershipIdSchema = z.object({
  id: z.string().uuid('Partnership ID must be a valid UUID.'),
});

// ─── Inferred Types ────────────────────────────────────────────────────────────

export type CreatePartnershipInput = z.infer<typeof createPartnershipSchema>;
export type UpdatePartnershipStatusInput = z.infer<typeof updatePartnershipStatusSchema>;
