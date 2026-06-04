/**
 * Donors Service
 *
 * Business logic layer for donors resource backed by PostgreSQL.
 */

import type { CreateDonorInput } from '../validators/donors.validator';
import { ApiError } from '../utils/ApiError';
import { db } from '../database';

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  payment_method?: string;
  amount: number;
  payment_status: 'Pending' | 'Verified' | 'Rejected';
  transaction_id?: string;
  admin_notes?: string;
  verified_by?: string;
  verified_at?: string;
  last_status_change_at?: string;
  created_at: string;
  updated_at: string;
}

export const donorsService = {
  /**
   * Get all donor records (admin).
   */
  async getAll(): Promise<Donor[]> {
    return db.query<Donor>(
      `SELECT * FROM donors ORDER BY created_at DESC`
    );
  },

  /**
   * Record a new donation (public submit).
   */
  async create(input: CreateDonorInput): Promise<Donor> {
    const queryText = `
      INSERT INTO donors (name, email, phone, amount, payment_method, payment_status, transaction_id, last_status_change_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *;
    `;
    const params = [
      input.name || 'Anonymous',
      input.email,
      input.phone,
      input.amount,
      input.payment_method,
      input.payment_status || 'Pending',
      input.transaction_id,
    ];

    try {
      const rows = await db.query<Donor>(queryText, params);
      return rows[0];
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ApiError(400, 'This transaction ID has already been submitted.');
      }
      throw err;
    }
  },

  /**
   * Get a single donor by ID (admin).
   */
  async getById(id: string): Promise<Donor> {
    const rows = await db.query<Donor>(
      `SELECT * FROM donors WHERE id = $1`,
      [id]
    );
    if (rows.length === 0) throw new ApiError(404, 'Donor record not found.');
    return rows[0];
  },

  /**
   * Update donation status and logging details (admin).
   */
  async updateStatus(
    id: string,
    status: 'Pending' | 'Verified' | 'Rejected',
    adminNotes: string | undefined,
    adminEmail: string
  ): Promise<Donor> {
    const queryText = `
      UPDATE donors 
      SET payment_status = $1,
          admin_notes = $2,
          verified_by = $3,
          verified_at = NOW(),
          last_status_change_at = NOW(),
          updated_at = NOW()
      WHERE id = $4
      RETURNING *;
    `;
    const params = [status, adminNotes || null, adminEmail, id];
    const rows = await db.query<Donor>(queryText, params);
    if (rows.length === 0) throw new ApiError(404, 'Donation record not found.');
    return rows[0];
  }
};
