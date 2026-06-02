/**
 * Programs Service
 *
 * Business logic layer for programs resource backed by PostgreSQL.
 */

import type { CreateProgramInput, UpdateProgramInput } from '../validators/programs.validator';
import { ApiError } from '../utils/ApiError';
import { db } from '../database';

export interface Program {
  id: string;
  type: 'Our Programs' | 'Our Work' | 'Impact Stories';
  title: string;
  description: string;
  image_url?: string;
  status: 'Published' | 'Draft';
  created_at: string;
  updated_at: string;

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

export const programsService = {
  /**
   * Get all published programs (public).
   */
  async getPublished(): Promise<Program[]> {
    return db.query<Program>(
      `SELECT * FROM programs WHERE status = 'Published' ORDER BY created_at DESC`
    );
  },

  /**
   * Get all programs including drafts (admin).
   */
  async getAll(): Promise<Program[]> {
    return db.query<Program>(
      `SELECT * FROM programs ORDER BY created_at DESC`
    );
  },

  /**
   * Create a new program entry.
   */
  async create(input: CreateProgramInput): Promise<Program> {
    const queryText = `
      INSERT INTO programs (
        type, title, description, image_url, status, subtitle, video_url,
        goals, beneficiaries, expense_categories, project_areas, duration,
        active_years, packages_distributed, gallery_title_1, gallery_link_1,
        gallery_title_2, gallery_link_2, gallery_description
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19
      ) RETURNING *;
    `;
    const params = [
      input.type,
      input.title,
      input.description,
      input.image_url || null,
      input.status || 'Draft',
      input.subtitle || null,
      input.video_url || null,
      input.goals || null,
      input.beneficiaries || null,
      input.expense_categories || null,
      input.project_areas || null,
      input.duration || null,
      input.active_years || null,
      input.packages_distributed || null,
      input.gallery_title_1 || null,
      input.gallery_link_1 || null,
      input.gallery_title_2 || null,
      input.gallery_link_2 || null,
      input.gallery_description || null,
    ];

    const rows = await db.query<Program>(queryText, params);
    return rows[0];
  },

  /**
   * Update an existing program.
   */
  async update(id: string, input: UpdateProgramInput): Promise<Program> {
    const queryText = `
      UPDATE programs SET
        type = COALESCE($1, type),
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        image_url = COALESCE($4, image_url),
        status = COALESCE($5, status),
        subtitle = COALESCE($6, subtitle),
        video_url = COALESCE($7, video_url),
        goals = COALESCE($8, goals),
        beneficiaries = COALESCE($9, beneficiaries),
        expense_categories = COALESCE($10, expense_categories),
        project_areas = COALESCE($11, project_areas),
        duration = COALESCE($12, duration),
        active_years = COALESCE($13, active_years),
        packages_distributed = COALESCE($14, packages_distributed),
        gallery_title_1 = COALESCE($15, gallery_title_1),
        gallery_link_1 = COALESCE($16, gallery_link_1),
        gallery_title_2 = COALESCE($17, gallery_title_2),
        gallery_link_2 = COALESCE($18, gallery_link_2),
        gallery_description = COALESCE($19, gallery_description),
        updated_at = NOW()
      WHERE id = $20
      RETURNING *;
    `;
    const params = [
      input.type !== undefined ? input.type : null,
      input.title !== undefined ? input.title : null,
      input.description !== undefined ? input.description : null,
      input.image_url !== undefined ? input.image_url : null,
      input.status !== undefined ? input.status : null,
      input.subtitle !== undefined ? input.subtitle : null,
      input.video_url !== undefined ? input.video_url : null,
      input.goals !== undefined ? input.goals : null,
      input.beneficiaries !== undefined ? input.beneficiaries : null,
      input.expense_categories !== undefined ? input.expense_categories : null,
      input.project_areas !== undefined ? input.project_areas : null,
      input.duration !== undefined ? input.duration : null,
      input.active_years !== undefined ? input.active_years : null,
      input.packages_distributed !== undefined ? input.packages_distributed : null,
      input.gallery_title_1 !== undefined ? input.gallery_title_1 : null,
      input.gallery_link_1 !== undefined ? input.gallery_link_1 : null,
      input.gallery_title_2 !== undefined ? input.gallery_title_2 : null,
      input.gallery_link_2 !== undefined ? input.gallery_link_2 : null,
      input.gallery_description !== undefined ? input.gallery_description : null,
      id,
    ];

    const rows = await db.query<Program>(queryText, params);
    if (rows.length === 0) throw new ApiError(404, 'Program not found.');
    return rows[0];
  },

  /**
   * Delete a program by ID.
   */
  async remove(id: string): Promise<Program> {
    const rows = await db.query<Program>(
      `DELETE FROM programs WHERE id = $1 RETURNING *`,
      [id]
    );
    if (rows.length === 0) throw new ApiError(404, 'Program not found.');
    return rows[0];
  },
};
