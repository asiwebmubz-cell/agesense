import { db } from '../database';
import { ApiError } from '../utils/ApiError';
import type { CreatePolicyInput, UpdatePolicyInput } from '../validators/policies.validator';

export interface Policy {
  id: string;
  title: string;
  description?: string | null;
  document_url?: string | null;
  category?: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const policiesService = {
  async getPublished(): Promise<Policy[]> {
    return db.query<Policy>(
      'SELECT * FROM policies WHERE is_published = true ORDER BY display_order ASC, created_at DESC'
    );
  },

  async getAll(): Promise<Policy[]> {
    return db.query<Policy>(
      'SELECT * FROM policies ORDER BY display_order ASC, created_at DESC'
    );
  },

  async getById(id: string): Promise<Policy> {
    const rows = await db.query<Policy>('SELECT * FROM policies WHERE id = $1', [id]);
    if (rows.length === 0) throw new ApiError(404, 'Policy not found.');
    return rows[0];
  },

  async create(input: CreatePolicyInput): Promise<Policy> {
    const query = `
      INSERT INTO policies (title, description, document_url, category, is_published, display_order)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const params = [
      input.title,
      input.description || null,
      input.document_url || null,
      input.category || null,
      input.is_published !== undefined ? input.is_published : false,
      input.display_order !== undefined ? input.display_order : 0,
    ];
    const rows = await db.query<Policy>(query, params);
    return rows[0];
  },

  async update(id: string, input: UpdatePolicyInput): Promise<Policy> {
    await this.getById(id);

    const query = `
      UPDATE policies SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        document_url = COALESCE($3, document_url),
        category = COALESCE($4, category),
        is_published = COALESCE($5, is_published),
        display_order = COALESCE($6, display_order),
        updated_at = NOW()
      WHERE id = $7
      RETURNING *;
    `;
    const params = [
      input.title !== undefined ? input.title : null,
      input.description !== undefined ? input.description : null,
      input.document_url !== undefined ? input.document_url : null,
      input.category !== undefined ? input.category : null,
      input.is_published !== undefined ? input.is_published : null,
      input.display_order !== undefined ? input.display_order : null,
      id,
    ];
    const rows = await db.query<Policy>(query, params);
    return rows[0];
  },

  async remove(id: string): Promise<Policy> {
    const rows = await db.query<Policy>('DELETE FROM policies WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) throw new ApiError(404, 'Policy not found.');
    return rows[0];
  },
};
