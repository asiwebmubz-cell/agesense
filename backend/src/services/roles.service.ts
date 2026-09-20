import { db } from '../database';
import { ApiError } from '../utils/ApiError';
import type { CreateRoleInput, UpdateRoleInput } from '../validators/roles.validator';

export interface RoleWithPermissions {
  id: string;
  name: string;
  description?: string | null;
  is_system: boolean;
  assignable: boolean;
  permissions: string[];
  user_count: number;
  created_at: string;
  updated_at: string;
}

/** The super_admin role is immutable: full access is enforced in code. */
const LOCKED_ROLE = 'super_admin';

async function assertAllPermissionsExist(keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  const rows = await db.query<{ key: string }>(
    'SELECT key FROM permissions WHERE key = ANY($1)',
    [keys]
  );
  if (rows.length !== new Set(keys).size) {
    const found = new Set(rows.map((r) => r.key));
    const missing = keys.filter((k) => !found.has(k));
    throw new ApiError(400, `Unknown permission(s): ${missing.join(', ')}`);
  }
}

export const rolesService = {
  async getAll(): Promise<RoleWithPermissions[]> {
    const roles = await db.query<Omit<RoleWithPermissions, 'permissions'>>(
      `SELECT r.*,
              (SELECT COUNT(*)::int FROM users u WHERE u.role = r.name) AS user_count
       FROM roles r
       ORDER BY r.is_system DESC, r.name ASC`
    );
    const permRows = await db.query<{ role_id: string; key: string }>(
      `SELECT rp.role_id, p.key
       FROM role_permissions rp
       JOIN permissions p ON p.id = rp.permission_id
       ORDER BY p.key ASC`
    );
    return roles.map((role) => ({
      ...role,
      permissions: permRows.filter((p) => p.role_id === role.id).map((p) => p.key),
    }));
  },

  async getById(id: string): Promise<RoleWithPermissions> {
    const roles = await db.query<RoleWithPermissions>(
      `SELECT r.*,
              (SELECT COUNT(*)::int FROM users u WHERE u.role = r.name) AS user_count
       FROM roles r WHERE r.id = $1`,
      [id]
    );
    if (roles.length === 0) throw new ApiError(404, 'Role not found.');
    const perms = await db.query<{ key: string }>(
      `SELECT p.key FROM role_permissions rp
       JOIN permissions p ON p.id = rp.permission_id
       WHERE rp.role_id = $1 ORDER BY p.key ASC`,
      [id]
    );
    return { ...roles[0], permissions: perms.map((p) => p.key) };
  },

  async create(input: CreateRoleInput): Promise<RoleWithPermissions> {
    const existing = await db.query('SELECT 1 FROM roles WHERE name = $1', [input.name]);
    if (existing.length > 0) {
      throw new ApiError(400, `Role '${input.name}' already exists.`);
    }
    if (input.permissions) {
      await assertAllPermissionsExist(input.permissions);
    }

    const inserted = await db.query<{ id: string }>(
      'INSERT INTO roles (name, description, is_system, assignable) VALUES ($1, $2, false, true) RETURNING id',
      [input.name, input.description || null]
    );
    const roleId = inserted[0].id;

    if (input.permissions && input.permissions.length > 0) {
      await db.query(
        `INSERT INTO role_permissions (role_id, permission_id)
         SELECT $1, p.id FROM permissions p WHERE p.key = ANY($2)
         ON CONFLICT DO NOTHING`,
        [roleId, input.permissions]
      );
    }
    return this.getById(roleId);
  },

  async update(id: string, input: UpdateRoleInput): Promise<RoleWithPermissions> {
    const role = await this.getById(id);
    if (role.name === LOCKED_ROLE) {
      throw new ApiError(403, 'The super_admin role is locked and cannot be modified.');
    }

    if (input.description !== undefined) {
      await db.query('UPDATE roles SET description = $1, updated_at = NOW() WHERE id = $2', [
        input.description || null,
        id,
      ]);
    }

    if (input.permissions !== undefined) {
      await assertAllPermissionsExist(input.permissions);
      await db.query('DELETE FROM role_permissions WHERE role_id = $1', [id]);
      if (input.permissions.length > 0) {
        await db.query(
          `INSERT INTO role_permissions (role_id, permission_id)
           SELECT $1, p.id FROM permissions p WHERE p.key = ANY($2)
           ON CONFLICT DO NOTHING`,
          [id, input.permissions]
        );
      }
    }

    return this.getById(id);
  },

  async remove(id: string): Promise<RoleWithPermissions> {
    const role = await this.getById(id);
    if (role.is_system) {
      throw new ApiError(403, 'System roles cannot be deleted.');
    }
    if (role.user_count > 0) {
      throw new ApiError(400, `Cannot delete role '${role.name}' because ${role.user_count} user(s) still use it. Reassign those users first.`);
    }
    await db.query('DELETE FROM roles WHERE id = $1', [id]);
    return role;
  },
};