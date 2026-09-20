import { db } from '../database';
import { ApiError } from '../utils/ApiError';
import type { CreateBranchInput, UpdateBranchInput } from '../validators/branches.validator';

export interface Branch {
  id: string;
  name: string;
  division: string;
  description?: string | null;
  location?: string | null;
  contact_info?: any;
  image_url?: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const branchesService = {
  async getActive(): Promise<Branch[]> {
    return db.query<Branch>(
      'SELECT * FROM branches WHERE is_active = true ORDER BY display_order ASC, name ASC'
    );
  },

  async getAll(): Promise<Branch[]> {
    return db.query<Branch>(
      'SELECT * FROM branches ORDER BY display_order ASC, name ASC'
    );
  },

  async getById(id: string): Promise<Branch> {
    const rows = await db.query<Branch>('SELECT * FROM branches WHERE id = $1', [id]);
    if (rows.length === 0) throw new ApiError(404, 'Branch not found.');
    return rows[0];
  },

  async create(input: CreateBranchInput): Promise<Branch> {
    const query = `
      INSERT INTO branches (name, division, description, location, contact_info, image_url, is_active, display_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const params = [
      input.name,
      input.division,
      input.description || null,
      input.location || null,
      input.contact_info ? JSON.stringify(input.contact_info) : null,
      input.image_url || null,
      input.is_active !== undefined ? input.is_active : true,
      input.display_order !== undefined ? input.display_order : 0,
    ];
    const rows = await db.query<Branch>(query, params);
    return rows[0];
  },

  async update(id: string, input: UpdateBranchInput): Promise<Branch> {
    const existing = await this.getById(id);
    const query = `
      UPDATE branches SET
        name = COALESCE($1, name),
        division = COALESCE($2, division),
        description = COALESCE($3, description),
        location = COALESCE($4, location),
        contact_info = COALESCE($5, contact_info),
        image_url = COALESCE($6, image_url),
        is_active = COALESCE($7, is_active),
        display_order = COALESCE($8, display_order),
        updated_at = NOW()
      WHERE id = $9
      RETURNING *;
    `;
    const params = [
      input.name !== undefined ? input.name : null,
      input.division !== undefined ? input.division : null,
      input.description !== undefined ? input.description : null,
      input.location !== undefined ? input.location : null,
      input.contact_info !== undefined ? JSON.stringify(input.contact_info) : null,
      input.image_url !== undefined ? input.image_url : null,
      input.is_active !== undefined ? input.is_active : null,
      input.display_order !== undefined ? input.display_order : null,
      id,
    ];
    const rows = await db.query<Branch>(query, params);
    return rows[0];
  },

  async remove(id: string): Promise<Branch> {
    // Check if team members are linked to this branch
    const teamMembers = await db.query('SELECT 1 FROM team_members WHERE branch_id = $1 LIMIT 1', [id]);
    if (teamMembers.length > 0) {
      throw new ApiError(400, 'Cannot delete branch because it still has associated team members. Please reassign or remove them first.');
    }

    const rows = await db.query<Branch>('DELETE FROM branches WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) throw new ApiError(404, 'Branch not found.');
    return rows[0];
  },
};
