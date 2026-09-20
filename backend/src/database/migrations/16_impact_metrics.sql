-- Migration 16: Seed impact_metrics into site_content and register permission
INSERT INTO site_content (key, title, body, metadata)
VALUES (
  'impact_metrics',
  'Our Impact',
  'Key headline figures displayed across public pages',
  '{"elders_helped": 1100, "aid_delivered": 500, "voluntary_hours": 1200, "years_active": 2}'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- Register permission for impact metrics editing
INSERT INTO permissions (key, description, category)
VALUES ('edit_impact_metrics', 'Edit the Our Impact numbers on the homepage.', 'site_content')
ON CONFLICT (key) DO NOTHING;

-- Map to super_admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name IN ('super_admin', 'admin') AND p.key = 'edit_impact_metrics'
ON CONFLICT DO NOTHING;
