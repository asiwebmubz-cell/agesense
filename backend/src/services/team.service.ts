import { db } from '../database';
import { ApiError } from '../utils/ApiError';
import type { CreateTeamMemberInput, UpdateTeamMemberInput } from '../validators/team.validator';

export interface TeamMember {
  id: string;
  branch_id: string;
  branch_name?: string;
  name: string;
  position: string;
  committee: 'Executive Committee' | 'Advisory Board';
  photo_url?: string | null;
  biography?: string | null;
  display_order: number;
  hierarchy_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const teamService = {
  /**
   * Get active team members for public display.
   * Can be filtered by branch_id or committee.
   */
  async getActive(branchId?: string, committee?: string): Promise<TeamMember[]> {
    let query = `
      SELECT t.*, b.name as branch_name
      FROM team_members t
      JOIN branches b ON t.branch_id = b.id
      WHERE t.is_active = true
    `;
    const params: any[] = [];

    if (branchId) {
      params.push(branchId);
      query += ` AND t.branch_id = $${params.length}`;
    }

    if (committee) {
      params.push(committee);
      query += ` AND t.committee = $${params.length}`;
    }

    query += ` ORDER BY t.committee ASC, t.display_order ASC, t.hierarchy_level ASC, t.name ASC`;
    return db.query<TeamMember>(query, params);
  },

  /**
   * Get all team members (admin).
   * Backend branch-scoping: if enforcedBranchId is supplied (for branch_manager), returns only that branch.
   */
  async getAll(enforcedBranchId?: string | null): Promise<TeamMember[]> {
    let query = `
      SELECT t.*, b.name as branch_name
      FROM team_members t
      JOIN branches b ON t.branch_id = b.id
    `;
    const params: any[] = [];

    if (enforcedBranchId) {
      params.push(enforcedBranchId);
      query += ` WHERE t.branch_id = $${params.length}`;
    }

    query += ` ORDER BY t.branch_id, t.committee ASC, t.display_order ASC, t.name ASC`;
    return db.query<TeamMember>(query, params);
  },

  async getById(id: string): Promise<TeamMember> {
    const rows = await db.query<TeamMember>(
      `SELECT t.*, b.name as branch_name FROM team_members t JOIN branches b ON t.branch_id = b.id WHERE t.id = $1`,
      [id]
    );
    if (rows.length === 0) throw new ApiError(404, 'Team member not found.');
    return rows[0];
  },

  /**
   * Create team member.
   * If enforcedBranchId is given, ensures branch_id cannot be spoofed to another branch.
   */
  async create(input: CreateTeamMemberInput, enforcedBranchId?: string | null): Promise<TeamMember> {
    const targetBranchId = enforcedBranchId || input.branch_id;

    // Verify target branch exists
    const branchCheck = await db.query('SELECT 1 FROM branches WHERE id = $1', [targetBranchId]);
    if (branchCheck.length === 0) throw new ApiError(400, 'Invalid branch_id. Branch does not exist.');

    const query = `
      INSERT INTO team_members (
        branch_id, name, position, committee, photo_url, biography, display_order, hierarchy_level, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    const params = [
      targetBranchId,
      input.name,
      input.position,
      input.committee,
      input.photo_url || null,
      input.biography || null,
      input.display_order !== undefined ? input.display_order : 0,
      input.hierarchy_level !== undefined ? input.hierarchy_level : 1,
      input.is_active !== undefined ? input.is_active : true,
    ];
    const rows = await db.query<TeamMember>(query, params);
    return rows[0];
  },

  /**
   * Update team member.
   * If enforcedBranchId is given, checks record belongs to caller's branch and forbids moving to another branch.
   */
  async update(id: string, input: UpdateTeamMemberInput, enforcedBranchId?: string | null): Promise<TeamMember> {
    const existing = await this.getById(id);

    if (enforcedBranchId && existing.branch_id !== enforcedBranchId) {
      throw new ApiError(403, 'Access denied. You can only update team members in your assigned branch.');
    }

    if (enforcedBranchId && input.branch_id && input.branch_id !== enforcedBranchId) {
      throw new ApiError(403, 'Access denied. You cannot reassign team members to a different branch.');
    }

    const query = `
      UPDATE team_members SET
        branch_id = COALESCE($1, branch_id),
        name = COALESCE($2, name),
        position = COALESCE($3, position),
        committee = COALESCE($4, committee),
        photo_url = COALESCE($5, photo_url),
        biography = COALESCE($6, biography),
        display_order = COALESCE($7, display_order),
        hierarchy_level = COALESCE($8, hierarchy_level),
        is_active = COALESCE($9, is_active),
        updated_at = NOW()
      WHERE id = $10
      RETURNING *;
    `;
    const params = [
      enforcedBranchId ? enforcedBranchId : (input.branch_id !== undefined ? input.branch_id : null),
      input.name !== undefined ? input.name : null,
      input.position !== undefined ? input.position : null,
      input.committee !== undefined ? input.committee : null,
      input.photo_url !== undefined ? input.photo_url : null,
      input.biography !== undefined ? input.biography : null,
      input.display_order !== undefined ? input.display_order : null,
      input.hierarchy_level !== undefined ? input.hierarchy_level : null,
      input.is_active !== undefined ? input.is_active : null,
      id,
    ];
    const rows = await db.query<TeamMember>(query, params);
    return rows[0];
  },

  /**
   * Delete team member.
   */
  async remove(id: string, enforcedBranchId?: string | null): Promise<TeamMember> {
    const existing = await this.getById(id);

    if (enforcedBranchId && existing.branch_id !== enforcedBranchId) {
      throw new ApiError(403, 'Access denied. You can only delete team members in your assigned branch.');
    }

    const rows = await db.query<TeamMember>('DELETE FROM team_members WHERE id = $1 RETURNING *', [id]);
    return rows[0];
  },
};
