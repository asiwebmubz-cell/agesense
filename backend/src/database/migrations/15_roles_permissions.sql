-- Migration 15: Role & permission management tables
--
-- Non-destructive and idempotent. Adds a DB-backed role -> permission layer on
-- top of the existing role-string system (users.role is unchanged).
-- super_admin is always enforced in code as full access ("*" bypass) — the
-- seeded rows are for visibility only.
-- Legacy roles (admin, content_manager) are seeded so existing accounts keep
-- working, but are marked non-assignable for NEW users.

CREATE TABLE IF NOT EXISTS roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  is_system   BOOLEAN NOT NULL DEFAULT false,
  assignable  BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  category    VARCHAR(50) NOT NULL DEFAULT 'general',
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id       UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);

-- ─── System roles ─────────────────────────────────────────────────────────────
INSERT INTO roles (name, description, is_system, assignable) VALUES
  ('super_admin',     'Full platform control. Cannot be edited or deleted.', true, true),
  ('marketing',       'Organization-wide content and partnership management.', true, true),
  ('branch_manager',  'Branch-scoped content and team management.', true, true),
  ('admin',           'Legacy role. Kept for existing accounts only.', true, false),
  ('content_manager', 'Legacy role. Kept for existing accounts only.', true, false)
ON CONFLICT (name) DO NOTHING;

-- ─── Permission catalog ───────────────────────────────────────────────────────
INSERT INTO permissions (key, description, category) VALUES
  ('view_users',            'View user accounts.', 'users'),
  ('create_users',          'Create user accounts.', 'users'),
  ('edit_users',            'Edit user accounts.', 'users'),
  ('delete_users',          'Delete user accounts.', 'users'),
  ('disable_users',         'Enable/disable user accounts.', 'users'),
  ('manage_roles',          'Create, edit and delete roles.', 'users'),
  ('manage_permissions',    'Assign permissions to roles.', 'users'),
  ('view_content',          'View programs, work and impact stories (admin).', 'content'),
  ('create_content',        'Create programs, work and impact stories.', 'content'),
  ('edit_content',          'Edit programs, work and impact stories.', 'content'),
  ('delete_content',        'Delete programs, work and impact stories.', 'content'),
  ('publish_content',       'Publish/unpublish content.', 'content'),
  ('view_team',             'View team members (admin).', 'team'),
  ('create_team',           'Create team members.', 'team'),
  ('edit_team',             'Edit team members.', 'team'),
  ('delete_team',           'Delete team members.', 'team'),
  ('view_branches',         'View branches (admin).', 'branches'),
  ('create_branches',       'Create branches.', 'branches'),
  ('edit_branches',         'Edit branches.', 'branches'),
  ('delete_branches',       'Delete branches.', 'branches')
ON CONFLICT (key) DO NOTHING;

INSERT INTO permissions (key, description, category) VALUES
  ('view_reports',          'View annual reports (admin).', 'reports'),
  ('create_reports',        'Create annual reports.', 'reports'),
  ('edit_reports',          'Edit annual reports.', 'reports'),
  ('delete_reports',        'Delete annual reports.', 'reports'),
  ('view_policies',         'View policies (admin).', 'policies'),
  ('create_policies',       'Create policies.', 'policies'),
  ('edit_policies',         'Edit policies.', 'policies'),
  ('delete_policies',       'Delete policies.', 'policies'),
  ('edit_our_story',        'Edit the Our Story page.', 'site_content'),
  ('edit_values',           'Edit the Values page.', 'site_content'),
  ('edit_founder_statement','Edit the Founder''s Statement page.', 'site_content'),
  ('view_volunteers',       'View volunteer submissions.', 'volunteers'),
  ('manage_volunteers',     'Manage volunteer submissions.', 'volunteers'),
  ('view_donors',           'View donor records.', 'donors'),
  ('manage_donors',         'Manage donor records.', 'donors'),
  ('view_partnerships',     'View partnership inquiries.', 'partnerships'),
  ('manage_partnerships',   'Manage partnership inquiries.', 'partnerships'),
  ('upload_images',         'Upload images to Cloudinary.', 'uploads'),
  ('delete_images',         'Reserved: delete uploaded images.', 'uploads')
ON CONFLICT (key) DO NOTHING;

-- ─── super_admin + legacy admin: ALL permissions ──────────────────────────────
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name IN ('super_admin', 'admin')
ON CONFLICT DO NOTHING;

-- ─── marketing: org-wide content + partnerships + uploads ─────────────────────
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.key IN (
  'view_content', 'create_content', 'edit_content', 'delete_content', 'publish_content',
  'upload_images', 'view_partnerships', 'manage_partnerships'
) WHERE r.name = 'marketing'
ON CONFLICT DO NOTHING;

-- ─── branch_manager: branch-scoped content + team + uploads ───────────────────
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.key IN (
  'view_content', 'create_content', 'edit_content', 'delete_content',
  'view_team', 'create_team', 'edit_team', 'delete_team',
  'upload_images'
) WHERE r.name = 'branch_manager'
ON CONFLICT DO NOTHING;

-- ─── legacy content_manager: content + uploads ────────────────────────────────
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.key IN (
  'view_content', 'create_content', 'edit_content', 'delete_content', 'publish_content',
  'upload_images'
) WHERE r.name = 'content_manager'
ON CONFLICT DO NOTHING;