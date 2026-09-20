import { db } from '../database';
import { ApiError } from '../utils/ApiError';
import type { UpdateSiteContentInput } from '../validators/site-content.validator';

export interface SiteContent {
  id: string;
  key: string;
  title?: string | null;
  body: string;
  metadata?: any;
  updated_by?: string | null;
  updated_at: string;
}

export const siteContentService = {
  async getByKey(key: string): Promise<SiteContent> {
    const rows = await db.query<SiteContent>('SELECT * FROM site_content WHERE key = $1', [key]);
    if (rows.length === 0) {
      throw new ApiError(404, `Site content for key '${key}' not found.`);
    }
    return rows[0];
  },

  async getAll(): Promise<SiteContent[]> {
    return db.query<SiteContent>('SELECT * FROM site_content ORDER BY key ASC');
  },

  async updateByKey(key: string, input: UpdateSiteContentInput, updatedByUserId?: string | null): Promise<SiteContent> {
    // Check if key exists or upsert
    const existing = await db.query<SiteContent>('SELECT * FROM site_content WHERE key = $1', [key]);

    if (existing.length === 0) {
      const query = `
        INSERT INTO site_content (key, title, body, metadata, updated_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const params = [
        key,
        input.title || null,
        input.body,
        input.metadata ? JSON.stringify(input.metadata) : '{}',
        updatedByUserId || null,
      ];
      const rows = await db.query<SiteContent>(query, params);
      return rows[0];
    }

    const query = `
      UPDATE site_content SET
        title = COALESCE($1, title),
        body = $2,
        metadata = COALESCE($3, metadata),
        updated_by = $4,
        updated_at = NOW()
      WHERE key = $5
      RETURNING *;
    `;
    const params = [
      input.title !== undefined ? input.title : null,
      input.body,
      input.metadata ? JSON.stringify(input.metadata) : null,
      updatedByUserId || null,
      key,
    ];
    const rows = await db.query<SiteContent>(query, params);
    return rows[0];
  },
};
