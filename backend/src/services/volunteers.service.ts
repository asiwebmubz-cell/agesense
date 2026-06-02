/**
 * Volunteers Service
 *
 * Business logic layer for volunteers resource backed by PostgreSQL.
 */

import type {
  CreateVolunteerInput,
  UpdateVolunteerStatusInput,
} from '../validators/volunteers.validator';
import { ApiError } from '../utils/ApiError';
import { db } from '../database';

export interface Volunteer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  form_data_json?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export const volunteersService = {
  /**
   * Get all volunteer applications (admin).
   */
  async getAll(): Promise<Volunteer[]> {
    return db.query<Volunteer>(
      `SELECT * FROM volunteers ORDER BY created_at DESC`
    );
  },

  /**
   * Create a new volunteer application (public submit).
   */
  async create(input: CreateVolunteerInput): Promise<Volunteer> {
    const queryText = `
      INSERT INTO volunteers (full_name, email, phone, status, form_data_json)
      VALUES ($1, $2, $3, 'Pending', $4)
      RETURNING *;
    `;
    const params = [
      input.full_name,
      input.email,
      input.phone || null,
      input.form_data || null,
    ];

    try {
      const rows = await db.query<Volunteer>(queryText, params);
      return rows[0];
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ApiError(400, 'A volunteer application with this email already exists.');
      }
      throw err;
    }
  },

  /**
   * Update volunteer application status (admin).
   */
  async updateStatus(id: string, input: UpdateVolunteerStatusInput): Promise<Volunteer> {
    const queryText = `
      UPDATE volunteers 
      SET status = $1, updated_at = NOW() 
      WHERE id = $2 
      RETURNING *;
    `;
    const params = [input.status, id];

    const rows = await db.query<Volunteer>(queryText, params);
    if (rows.length === 0) throw new ApiError(404, 'Volunteer application not found.');
    return rows[0];
  },
};
