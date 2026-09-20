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
    '[Content to be provided by AgeSense Initiative]',
    '{}'::jsonb
  ),
  (
    'values',
    'Our Values',
    '[Content to be provided by AgeSense Initiative]',
    '{}'::jsonb
  ),
  (
    'founder_statement',
    'Founder''s Statement',
    'When I founded AgeSense Initiative, I believed that every older person deserves to age with dignity, respect, and the support of a caring community. Today, that belief continues to guide every project we undertake and every decision we make.

The 2025–26 financial year has been one of meaningful growth for our organization. Together with our volunteers, donors, partners, and well-wishers, we delivered five major programs, expanded our work beyond Dhaka by establishing our first regional branch in Rajshahi, and reached more than 1,100 individuals and families. More importantly, we strengthened the foundation of an organization that is committed to creating lasting impact for older adults across Bangladesh.

While these achievements are encouraging, they also remind us how much work remains. Thousands of older people continue to face challenges related to health, financial insecurity, loneliness, and social exclusion. Addressing these issues requires more than one-time assistance—it requires long-term commitment, innovation, partnerships, and stronger connections between generations.

This year, we also took important steps toward that future by strengthening our internal systems, expanding our volunteer network, and laying the groundwork for new initiatives focused on healthy ageing, community engagement, and sustainable impact. These efforts reflect our commitment to building an organization that can serve older adults more effectively for years to come.

None of this would have been possible without the dedication of our volunteers, the generosity of our donors, the trust of our beneficiaries, and the encouragement of our partners. I extend my heartfelt gratitude to everyone who has stood beside AgeSense Initiative throughout this journey.

As we look ahead, we remain committed to advancing healthy ageing, dignity, social inclusion, and stronger connections between generations through community action, innovation, and partnerships. We invite you to continue this journey with us as we work toward an age-inclusive Bangladesh where every older person can live with dignity, purpose, and hope.

Azraf Khan Zarif
Founder & Executive Director
AgeSense Initiative.',
    '{"image_url": ""}'::jsonb
  )
ON CONFLICT (key) DO NOTHING;
