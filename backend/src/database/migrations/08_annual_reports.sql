-- Migration 08: Annual reports table
CREATE TABLE IF NOT EXISTS annual_reports (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year           INTEGER NOT NULL,
  title          VARCHAR(255) NOT NULL,
  description    TEXT,
  pdf_url        TEXT,
  is_published   BOOLEAN NOT NULL DEFAULT false,
  display_order  INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_annual_reports_year ON annual_reports(year);
CREATE INDEX IF NOT EXISTS idx_annual_reports_published ON annual_reports(is_published, display_order, year DESC);
