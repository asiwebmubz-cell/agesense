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
  
  // Dynamic multi-images
  images?: string[];
}

export const programsService = {
  /**
   * Get all published programs (public).
   */
  async getPublished(): Promise<Program[]> {
    const programs = await db.query<Program>(
      `SELECT * FROM programs WHERE status = 'Published' ORDER BY created_at DESC`
    );
    if (programs.length === 0) return [];

    const programIds = programs.map(p => p.id);
    const images = await db.query<{ program_id: string; image_url: string }>(
      `SELECT program_id, image_url FROM program_images WHERE program_id = ANY($1) ORDER BY created_at ASC`,
      [programIds]
    );

    programs.forEach(p => {
      p.images = images.filter(img => img.program_id === p.id).map(img => img.image_url);
    });

    return programs;
  },

  /**
   * Get all programs including drafts (admin).
   */
  async getAll(): Promise<Program[]> {
    const programs = await db.query<Program>(
      `SELECT * FROM programs ORDER BY created_at DESC`
    );
    if (programs.length === 0) return [];

    const programIds = programs.map(p => p.id);
    const images = await db.query<{ program_id: string; image_url: string }>(
      `SELECT program_id, image_url FROM program_images WHERE program_id = ANY($1) ORDER BY created_at ASC`,
      [programIds]
    );

    programs.forEach(p => {
      p.images = images.filter(img => img.program_id === p.id).map(img => img.image_url);
    });

    return programs;
  },

  /**
   * Create a new program entry.
   */
  async create(input: CreateProgramInput): Promise<Program> {
    const { images, ...rawInput } = input as any;

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
      rawInput.type,
      rawInput.title,
      rawInput.description,
      rawInput.image_url || null,
      rawInput.status || 'Draft',
      rawInput.subtitle || null,
      rawInput.video_url || null,
      rawInput.goals || null,
      rawInput.beneficiaries || null,
      rawInput.expense_categories || null,
      rawInput.project_areas || null,
      rawInput.duration || null,
      rawInput.active_years || null,
      rawInput.packages_distributed || null,
      rawInput.gallery_title_1 || null,
      rawInput.gallery_link_1 || null,
      rawInput.gallery_title_2 || null,
      rawInput.gallery_link_2 || null,
      rawInput.gallery_description || null,
    ];

    const rows = await db.query<Program>(queryText, params);
    const createdProgram = rows[0];

    if (images && images.length > 0) {
      for (const imgUrl of images) {
        await db.query(
          `INSERT INTO program_images (program_id, image_url) VALUES ($1, $2)`,
          [createdProgram.id, imgUrl]
        );
      }
      createdProgram.images = images;
    } else {
      createdProgram.images = [];
    }

    return createdProgram;
  },

  /**
   * Update an existing program.
   */
  async update(id: string, input: UpdateProgramInput): Promise<Program> {
    const { images, ...rawInput } = input as any;

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
      rawInput.type !== undefined ? rawInput.type : null,
      rawInput.title !== undefined ? rawInput.title : null,
      rawInput.description !== undefined ? rawInput.description : null,
      rawInput.image_url !== undefined ? rawInput.image_url : null,
      rawInput.status !== undefined ? rawInput.status : null,
      rawInput.subtitle !== undefined ? rawInput.subtitle : null,
      rawInput.video_url !== undefined ? rawInput.video_url : null,
      rawInput.goals !== undefined ? rawInput.goals : null,
      rawInput.beneficiaries !== undefined ? rawInput.beneficiaries : null,
      rawInput.expense_categories !== undefined ? rawInput.expense_categories : null,
      rawInput.project_areas !== undefined ? rawInput.project_areas : null,
      rawInput.duration !== undefined ? rawInput.duration : null,
      rawInput.active_years !== undefined ? rawInput.active_years : null,
      rawInput.packages_distributed !== undefined ? rawInput.packages_distributed : null,
      rawInput.gallery_title_1 !== undefined ? rawInput.gallery_title_1 : null,
      rawInput.gallery_link_1 !== undefined ? rawInput.gallery_link_1 : null,
      rawInput.gallery_title_2 !== undefined ? rawInput.gallery_title_2 : null,
      rawInput.gallery_link_2 !== undefined ? rawInput.gallery_link_2 : null,
      rawInput.gallery_description !== undefined ? rawInput.gallery_description : null,
      id,
    ];

    const rows = await db.query<Program>(queryText, params);
    if (rows.length === 0) throw new ApiError(404, 'Program not found.');
    const updatedProgram = rows[0];

    if (images !== undefined) {
      // Clear out existing associated images first
      await db.query(`DELETE FROM program_images WHERE program_id = $1`, [id]);
      if (images && images.length > 0) {
        for (const imgUrl of images) {
          await db.query(
            `INSERT INTO program_images (program_id, image_url) VALUES ($1, $2)`,
            [id, imgUrl]
          );
        }
      }
      updatedProgram.images = images;
    } else {
      const dbImages = await db.query<{ image_url: string }>(
        `SELECT image_url FROM program_images WHERE program_id = $1 ORDER BY created_at ASC`,
        [id]
      );
      updatedProgram.images = dbImages.map(img => img.image_url);
    }

    return updatedProgram;
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
