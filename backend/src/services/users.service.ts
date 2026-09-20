import * as argon2 from 'argon2';
import { db } from '../database';
import { ApiError } from '../utils/ApiError';
import type { CreateUserInput, UpdateUserInput } from '../validators/users.validator';

export interface UserSummary {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  branch_id?: string | null;
  branch_name?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const usersService = {
  async getAll(): Promise<UserSummary[]> {
    const query = `
      SELECT u.id, u.name, u.email, u.role, u.branch_id, u.is_active, u.created_at, u.updated_at,
             b.name as branch_name
      FROM users u
      LEFT JOIN branches b ON u.branch_id = b.id
      ORDER BY u.created_at DESC
    `;
    return db.query<UserSummary>(query);
  },

  async getById(id: string): Promise<UserSummary> {
    const query = `
      SELECT u.id, u.name, u.email, u.role, u.branch_id, u.is_active, u.created_at, u.updated_at,
             b.name as branch_name
      FROM users u
      LEFT JOIN branches b ON u.branch_id = b.id
      WHERE u.id = $1
    `;
    const rows = await db.query<UserSummary>(query, [id]);
    if (rows.length === 0) throw new ApiError(404, 'User not found.');
    return rows[0];
  },

  async create(input: CreateUserInput): Promise<UserSummary> {
    const existing = await db.query('SELECT 1 FROM users WHERE email = $1', [input.email]);
    if (existing.length > 0) {
      throw new ApiError(400, 'A user with this email address already exists.');
    }

    if (input.branch_id) {
      const branchExists = await db.query('SELECT 1 FROM branches WHERE id = $1', [input.branch_id]);
      if (branchExists.length === 0) {
        throw new ApiError(400, 'Specified branch does not exist.');
      }
    }

    const hashedPassword = await argon2.hash(input.password, { type: argon2.argon2id });

    const query = `
      INSERT INTO users (name, email, password, role, branch_id, is_active)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, role, branch_id, is_active, created_at, updated_at;
    `;
    const params = [
      input.name,
      input.email,
      hashedPassword,
      input.role,
      input.branch_id || null,
      input.is_active !== undefined ? input.is_active : true,
    ];
    const rows = await db.query<UserSummary>(query, params);
    return this.getById(rows[0].id);
  },

  async update(id: string, input: UpdateUserInput, currentUserId?: string): Promise<UserSummary> {
    const existing = await this.getById(id);

    if (input.email && input.email !== existing.email) {
      const checkEmail = await db.query('SELECT 1 FROM users WHERE email = $1 AND id <> $2', [input.email, id]);
      if (checkEmail.length > 0) {
        throw new ApiError(400, 'A user with this email address already exists.');
      }
    }

    if (input.branch_id) {
      const branchExists = await db.query('SELECT 1 FROM branches WHERE id = $1', [input.branch_id]);
      if (branchExists.length === 0) {
        throw new ApiError(400, 'Specified branch does not exist.');
      }
    }

    // Protect against self-demotion or self-disabling
    if (currentUserId && currentUserId === id) {
      if (input.is_active === false) {
        throw new ApiError(400, 'You cannot deactivate your own account.');
      }
      if (input.role && input.role !== 'super_admin') {
        throw new ApiError(400, 'You cannot change your own super_admin role.');
      }
    }

    let passwordHash = null;
    if (input.password) {
      passwordHash = await argon2.hash(input.password, { type: argon2.argon2id });
    }

    const query = `
      UPDATE users SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        password = COALESCE($3, password),
        role = COALESCE($4, role),
        branch_id = COALESCE($5, branch_id),
        is_active = COALESCE($6, is_active),
        updated_at = NOW()
      WHERE id = $7
      RETURNING id;
    `;
    const params = [
      input.name !== undefined ? input.name : null,
      input.email !== undefined ? input.email : null,
      passwordHash,
      input.role !== undefined ? input.role : null,
      input.branch_id !== undefined ? input.branch_id : null,
      input.is_active !== undefined ? input.is_active : null,
      id,
    ];
    await db.query(query, params);

    // If password or is_active was updated, revoke their refresh tokens
    if (passwordHash || input.is_active === false) {
      await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [id]);
    }

    return this.getById(id);
  },

  async remove(id: string, currentUserId?: string): Promise<UserSummary> {
    if (currentUserId && currentUserId === id) {
      throw new ApiError(400, 'You cannot delete your own account.');
    }

    const existing = await this.getById(id);
    await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [id]);
    await db.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [id]);
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    return existing;
  },
};
