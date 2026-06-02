/**
 * Programs Service
 *
 * Business logic layer for programs resource.
 * Currently returns stub data. Replace with database queries in the DB sprint.
 *
 * Each function accepts typed inputs and returns typed outputs.
 * DB errors should bubble up to the global error handler via asyncHandler.
 */

import type { CreateProgramInput, UpdateProgramInput } from '../validators/programs.validator';
import { ApiError } from '../utils/ApiError';

// ─── Stub types (will be replaced by DB row types) ───────────────────────────
export interface Program {
  id: string;
  type: 'Our Programs' | 'Our Work' | 'Impact Stories';
  title: string;
  description: string;
  image_url?: string;
  status: 'Published' | 'Draft';
  created_at: string;

  // Extra details
  subtitle?: string;
  video_url?: string;
  goals?: string;
  beneficiaries?: string;
  expense_categories?: string;
  project_areas?: string;
  duration?: string;
  active_years?: string;
  packages_distributed?: string;
  gallery_title_1?: string;
  gallery_link_1?: string;
  gallery_title_2?: string;
  gallery_link_2?: string;
  gallery_description?: string;
}

// ─── In-memory stub store (replace with DB queries) ──────────────────────────
const stub: Program[] = [];

export const programsService = {
  /**
   * Get all published programs (public).
   */
  async getPublished(): Promise<Program[]> {
    // TODO: SELECT * FROM programs WHERE status = 'Published' ORDER BY created_at DESC
    return stub.filter((p) => p.status === 'Published');
  },

  /**
   * Get all programs including drafts (admin).
   */
  async getAll(): Promise<Program[]> {
    // TODO: SELECT * FROM programs ORDER BY created_at DESC
    return [...stub].reverse();
  },

  /**
   * Create a new program entry.
   */
  async create(input: CreateProgramInput): Promise<Program> {
    // TODO: INSERT INTO programs ... RETURNING *
    const newProgram: Program = {
      id: crypto.randomUUID(),
      ...input,
      created_at: new Date().toISOString(),
    };
    stub.push(newProgram);
    return newProgram;
  },

  /**
   * Update an existing program.
   */
  async update(id: string, input: UpdateProgramInput): Promise<Program> {
    // TODO: UPDATE programs SET ... WHERE id = $1 RETURNING *
    const index = stub.findIndex((p) => p.id === id);
    if (index === -1) throw new ApiError(404, 'Program not found.');

    stub[index] = { ...stub[index], ...input };
    return stub[index];
  },

  /**
   * Delete a program by ID.
   */
  async remove(id: string): Promise<Program> {
    // TODO: DELETE FROM programs WHERE id = $1 RETURNING *
    const index = stub.findIndex((p) => p.id === id);
    if (index === -1) throw new ApiError(404, 'Program not found.');

    const [removed] = stub.splice(index, 1);
    return removed;
  },
};
