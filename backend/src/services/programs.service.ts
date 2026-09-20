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
  branch_id?: string | null;
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
  async getPublished(branchId?: string): Promise<Program[]> {
    let queryText = `SELECT * FROM programs WHERE status = 'Published'`;
    const params: any[] = [];

    if (branchId) {
      queryText += ` AND (branch_id = $1 OR branch_id IS NULL)`;
      params.push(branchId);
    }
    queryText += ` ORDER BY created_at DESC`;

    const programs = await db.query<Program>(queryText, params);
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
   * If branchId is specified (e.g. For branch_manager), only returns programs belonging to that branch.
   */
  async getAll(branchId?: string | null): Promise<Program[]> {
    let queryText = `SELECT * FROM programs`;
    const params: any[] = [];

    if (branchId) {
      queryText += ` WHERE branch_id = $1`;
      params.push(branchId);
    }
    queryText += ` ORDER BY created_at DESC`;

    const programs = await db.query<Program>(queryText, params);
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
   * Auto-assigns branch_id if caller is scoped.
   */
  async create(input: CreateProgramInput, enforcedBranchId?: string | null): Promise<Program> {
    const { images, ...rawInput } = input as any;
    const targetBranchId = enforcedBranchId !== undefined ? enforcedBranchId : (rawInput.branch_id || null);

    const queryText = `
      INSERT INTO programs (
        type, title, description, image_url, status, subtitle, video_url,
        goals, beneficiaries, expense_categories, project_areas, duration,
        active_years, packages_distributed, gallery_title_1, gallery_link_1,
        gallery_title_2, gallery_link_2, gallery_description, branch_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
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
      targetBranchId,
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
   * Validates branch ownership if caller is branch-scoped.
   */
  async update(id: string, input: UpdateProgramInput, enforcedBranchId?: string | null): Promise<Program> {
    const existing = await db.query<Program>('SELECT * FROM programs WHERE id = $1', [id]);
    if (existing.length === 0) throw new ApiError(404, 'Program not found.');

    if (enforcedBranchId && existing[0].branch_id !== enforcedBranchId) {
      throw new ApiError(403, 'Access denied. You can only update content belonging to your branch.');
    }

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
        branch_id = COALESCE($20, branch_id),
        updated_at = NOW()
      WHERE id = $21
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
      enforcedBranchId !== undefined ? enforcedBranchId : (rawInput.branch_id !== undefined ? rawInput.branch_id : null),
      id,
    ];

    const rows = await db.query<Program>(queryText, params);
    if (rows.length === 0) throw new ApiError(404, 'Program not found.');
    const updatedProgram = rows[0];

    if (images !== undefined) {
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
   * Validates branch ownership if caller is branch-scoped.
   */
  async remove(id: string, enforcedBranchId?: string | null): Promise<Program> {
    const existing = await db.query<Program>('SELECT * FROM programs WHERE id = $1', [id]);
    if (existing.length === 0) throw new ApiError(404, 'Program not found.');

    if (enforcedBranchId && existing[0].branch_id !== enforcedBranchId) {
      throw new ApiError(403, 'Access denied. You can only delete content belonging to your branch.');
    }

    const rows = await db.query<Program>(
      `DELETE FROM programs WHERE id = $1 RETURNING *`,
      [id]
    );
    return rows[0];
  },
};

