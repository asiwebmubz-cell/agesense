-- Migration 12: Site content CMS table
CREATE TABLE IF NOT EXISTS site_content (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key        VARCHAR(100) UNIQUE NOT NULL,
  title      VARCHAR(255),
  body       TEXT,
  metadata   JSONB DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content(key);

-- Seed initial records for Our Story, Values, and Founder's Statement
INSERT INTO site_content (key, title, body, metadata)
VALUES
  (
    'our_story',
    'Our Story',
    'AgeSense Initiative was founded to champion the well-being, dignity, and active inclusion of older adults. Through intergenerational solidarity, healthcare accessibility, and community engagement, we build systems that honor every stage of life.',
    '{}'::jsonb
  ),
  (
    'values',
    'Our Values',
    'Dignity & Compassion: Respecting the lifelong contribution of seniors.\nInclusion & Equity: Ensuring accessible support across all regions.\nCommunity Partnership: Empowering local leaders to drive elder care.\nTransparency & Accountability: Operating with integrity in every initiative.',
    '{}'::jsonb
  ),
  (
    'founder_statement',
    'Founder''s Statement',
    'Welcome to AgeSense Initiative. We envision a society where aging is embraced with dignity, reverence, and abundant care. Together with our partners, volunteers, and regional chapters, we are redefining elderly care across Bangladesh.',
    '{"image_url": ""}'::jsonb
  )
ON CONFLICT (key) DO NOTHING;
