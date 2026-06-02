/**
 * Volunteers Service
 *
 * Business logic layer for volunteers resource.
 * Currently returns stub data. Replace with database queries in the DB sprint.
 */

import type {
  CreateVolunteerInput,
  UpdateVolunteerStatusInput,
} from '../validators/volunteers.validator';
import { ApiError } from '../utils/ApiError';

export interface Volunteer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  form_data_json?: Record<string, unknown>;
  created_at: string;
}

// ─── In-memory stub store ─────────────────────────────────────────────────────
const stub: Volunteer[] = [];

export const volunteersService = {
  /**
   * Get all volunteer applications (admin).
   */
  async getAll(): Promise<Volunteer[]> {
    // TODO: SELECT * FROM volunteers ORDER BY created_at DESC
    return [...stub].reverse();
  },

  /**
   * Create a new volunteer application (public submit).
   */
  async create(input: CreateVolunteerInput): Promise<Volunteer> {
    // TODO: INSERT INTO volunteers (full_name, email, phone, form_data_json) VALUES (...) RETURNING *
    const newVolunteer: Volunteer = {
      id: crypto.randomUUID(),
      full_name: input.full_name,
      email: input.email,
      phone: input.phone,
      status: 'Pending',
      form_data_json: input.form_data,
      created_at: new Date().toISOString(),
    };
    stub.push(newVolunteer);
    return newVolunteer;
  },

  /**
   * Update volunteer application status (admin).
   */
  async updateStatus(id: string, input: UpdateVolunteerStatusInput): Promise<Volunteer> {
    // TODO: UPDATE volunteers SET status = $1 WHERE id = $2 RETURNING *
    const index = stub.findIndex((v) => v.id === id);
    if (index === -1) throw new ApiError(404, 'Volunteer application not found.');

    stub[index].status = input.status;
    return stub[index];
  },
};
