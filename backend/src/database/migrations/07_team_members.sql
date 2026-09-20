-- Migration 07: Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id       UUID NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
  name            VARCHAR(255) NOT NULL,
  position        VARCHAR(255) NOT NULL,
  committee       VARCHAR(50) NOT NULL CHECK (committee IN ('Executive Committee', 'Advisory Board')),
  photo_url       TEXT,
  biography       TEXT,
  display_order   INTEGER NOT NULL DEFAULT 0,
  hierarchy_level INTEGER NOT NULL DEFAULT 1,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_branch ON team_members(branch_id, is_active, committee, display_order);
