/**
 * Donors Service
 *
 * Business logic layer for donors resource.
 * Currently returns stub data. Replace with database queries in the DB sprint.
 */

import type { CreateDonorInput } from '../validators/donors.validator';
import { ApiError } from '../utils/ApiError';

export interface Donor {
  id: string;
  name: string;
  email: string;
  amount: number;
  payment_status: 'Pending' | 'Completed' | 'Failed';
  transaction_id?: string;
  created_at: string;
}

// ─── In-memory stub store ─────────────────────────────────────────────────────
const stub: Donor[] = [];

export const donorsService = {
  /**
   * Get all donor records (admin).
   */
  async getAll(): Promise<Donor[]> {
    // TODO: SELECT * FROM donors ORDER BY created_at DESC
    return [...stub].reverse();
  },

  /**
   * Record a new donation (public submit).
   */
  async create(input: CreateDonorInput): Promise<Donor> {
    // TODO: INSERT INTO donors (name, email, amount, payment_status, transaction_id) VALUES (...) RETURNING *
    const newDonor: Donor = {
      id: crypto.randomUUID(),
      name: input.name,
      email: input.email,
      amount: input.amount,
      payment_status: input.payment_status,
      transaction_id: input.transaction_id,
      created_at: new Date().toISOString(),
    };
    stub.push(newDonor);
    return newDonor;
  },

  /**
   * Get a single donor by ID (admin).
   */
  async getById(id: string): Promise<Donor> {
    // TODO: SELECT * FROM donors WHERE id = $1
    const donor = stub.find((d) => d.id === id);
    if (!donor) throw new ApiError(404, 'Donor record not found.');
    return donor;
  },
};
