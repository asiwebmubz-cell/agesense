import { db } from '../database';
import { ApiError } from '../utils/ApiError';
import type { CreateAnnualReportInput, UpdateAnnualReportInput } from '../validators/annual-reports.validator';

export interface AnnualReport {
  id: string;
  year: number;
  title: string;
  description?: string | null;
  pdf_url?: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const annualReportsService = {
  async getPublished(): Promise<AnnualReport[]> {
    return db.query<AnnualReport>(
      'SELECT * FROM annual_reports WHERE is_published = true ORDER BY display_order ASC, year DESC'
    );
  },

  async getAll(): Promise<AnnualReport[]> {
    return db.query<AnnualReport>(
      'SELECT * FROM annual_reports ORDER BY display_order ASC, year DESC'
    );
  },

  async getById(id: string): Promise<AnnualReport> {
    const rows = await db.query<AnnualReport>('SELECT * FROM annual_reports WHERE id = $1', [id]);
    if (rows.length === 0) throw new ApiError(404, 'Annual report not found.');
    return rows[0];
  },

  async create(input: CreateAnnualReportInput): Promise<AnnualReport> {
    const existing = await db.query('SELECT 1 FROM annual_reports WHERE year = $1', [input.year]);
    if (existing.length > 0) {
      throw new ApiError(400, `An annual report for year ${input.year} already exists.`);
    }

    const query = `
      INSERT INTO annual_reports (year, title, description, pdf_url, is_published, display_order)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const params = [
      input.year,
      input.title,
      input.description || null,
      input.pdf_url || null,
      input.is_published !== undefined ? input.is_published : false,
      input.display_order !== undefined ? input.display_order : 0,
    ];
    const rows = await db.query<AnnualReport>(query, params);
    return rows[0];
  },

  async update(id: string, input: UpdateAnnualReportInput): Promise<AnnualReport> {
    await this.getById(id);

    if (input.year !== undefined) {
      const existing = await db.query('SELECT 1 FROM annual_reports WHERE year = $1 AND id <> $2', [input.year, id]);
      if (existing.length > 0) {
        throw new ApiError(400, `An annual report for year ${input.year} already exists.`);
      }
    }

    const query = `
      UPDATE annual_reports SET
        year = COALESCE($1, year),
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        pdf_url = COALESCE($4, pdf_url),
        is_published = COALESCE($5, is_published),
        display_order = COALESCE($6, display_order),
        updated_at = NOW()
      WHERE id = $7
      RETURNING *;
    `;
    const params = [
      input.year !== undefined ? input.year : null,
      input.title !== undefined ? input.title : null,
      input.description !== undefined ? input.description : null,
      input.pdf_url !== undefined ? input.pdf_url : null,
      input.is_published !== undefined ? input.is_published : null,
      input.display_order !== undefined ? input.display_order : null,
      id,
    ];
    const rows = await db.query<AnnualReport>(query, params);
    return rows[0];
  },

  async remove(id: string): Promise<AnnualReport> {
    const rows = await db.query<AnnualReport>('DELETE FROM annual_reports WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0) throw new ApiError(404, 'Annual report not found.');
    return rows[0];
  },
};
