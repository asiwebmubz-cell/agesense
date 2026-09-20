-- Migration 06: Branches table
CREATE TABLE IF NOT EXISTS branches (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           VARCHAR(255) NOT NULL,
  division       VARCHAR(255) NOT NULL,
  description    TEXT,
  location       TEXT,
  contact_info   JSONB,
  image_url      TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT true,
  display_order  INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_branches_active ON branches(is_active, display_order);

-- Initial seed data: Dhaka and Rajshahi chapters
INSERT INTO branches (name, division, description, location, is_active, display_order)
SELECT 'Dhaka Central', 'Dhaka', 'Central headquarters serving older adults across the greater Dhaka division.', 'Dhaka, Bangladesh', true, 1
WHERE NOT EXISTS (SELECT 1 FROM branches WHERE name = 'Dhaka Central');

INSERT INTO branches (name, division, description, location, is_active, display_order)
SELECT 'Rajshahi Regional Chapter', 'Rajshahi', 'Pioneering healthcare access, social inclusion, and community engagement in northern Bangladesh.', 'Rajshahi, Bangladesh', true, 2
WHERE NOT EXISTS (SELECT 1 FROM branches WHERE name = 'Rajshahi Regional Chapter');
