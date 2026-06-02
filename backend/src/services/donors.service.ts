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
  amount: number;
  payment_status: 'Pending' | 'Completed' | 'Failed';
  transaction_id?: string;
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
      INSERT INTO donors (name, email, amount, payment_status, transaction_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const params = [
      input.name || 'Anonymous',
      input.email,
      input.amount,
      input.payment_status || 'Pending',
      input.transaction_id || null,
    ];

    const rows = await db.query<Donor>(queryText, params);
    return rows[0];
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
};
