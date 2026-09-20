-- Migration 13: Content scoping with branch_id in programs table
ALTER TABLE programs
  ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES branches(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_programs_branch ON programs(branch_id);
