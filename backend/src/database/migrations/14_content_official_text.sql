-- Migration 14: Replace implementer-written seed content with the official
-- Founder's Statement and neutral placeholders.
--
-- SAFE BY DESIGN:
-- * Only UPDATEs rows whose body still exactly matches the old implementer-
--   written seed text. If a Super Admin has already edited a row via the CMS,
--   the WHERE clause will not match and the row is left untouched.
-- * Never deletes, truncates, or resets any data.
-- * For fresh databases, Migration 12 already seeds the official text, so
--   these updates are no-ops there.

-- 1) Founder's Statement: replace invented seed text with the official
--    statement (exact text, provided by the organization).
UPDATE site_content
SET body = 'When I founded AgeSense Initiative, I believed that every older person deserves to age with dignity, respect, and the support of a caring community. Today, that belief continues to guide every project we undertake and every decision we make.

The 2025–26 financial year has been one of meaningful growth for our organization. Together with our volunteers, donors, partners, and well-wishers, we delivered five major programs, expanded our work beyond Dhaka by establishing our first regional branch in Rajshahi, and reached more than 1,100 individuals and families. More importantly, we strengthened the foundation of an organization that is committed to creating lasting impact for older adults across Bangladesh.

While these achievements are encouraging, they also remind us how much work remains. Thousands of older people continue to face challenges related to health, financial insecurity, loneliness, and social exclusion. Addressing these issues requires more than one-time assistance—it requires long-term commitment, innovation, partnerships, and stronger connections between generations.

This year, we also took important steps toward that future by strengthening our internal systems, expanding our volunteer network, and laying the groundwork for new initiatives focused on healthy ageing, community engagement, and sustainable impact. These efforts reflect our commitment to building an organization that can serve older adults more effectively for years to come.

None of this would have been possible without the dedication of our volunteers, the generosity of our donors, the trust of our beneficiaries, and the encouragement of our partners. I extend my heartfelt gratitude to everyone who has stood beside AgeSense Initiative throughout this journey.

As we look ahead, we remain committed to advancing healthy ageing, dignity, social inclusion, and stronger connections between generations through community action, innovation, and partnerships. We invite you to continue this journey with us as we work toward an age-inclusive Bangladesh where every older person can live with dignity, purpose, and hope.

Azraf Khan Zarif
Founder & Executive Director
AgeSense Initiative.',
    updated_at = NOW()
WHERE key = 'founder_statement'
  AND body = 'Welcome to AgeSense Initiative. We envision a society where aging is embraced with dignity, reverence, and abundant care. Together with our partners, volunteers, and regional chapters, we are redefining elderly care across Bangladesh.';

-- 2) Our Story: replace implementer-written text with a neutral placeholder.
UPDATE site_content
SET body = '[Content to be provided by AgeSense Initiative]',
    updated_at = NOW()
WHERE key = 'our_story'
  AND body = 'AgeSense Initiative was founded to champion the well-being, dignity, and active inclusion of older adults. Through intergenerational solidarity, healthcare accessibility, and community engagement, we build systems that honor every stage of life.';

-- 3) Values: replace implementer-written text with a neutral placeholder.
--    Note: the legacy seed stored literal backslash-n sequences, so the
--    guard below matches those exactly as stored.
UPDATE site_content
SET body = '[Content to be provided by AgeSense Initiative]',
    updated_at = NOW()
WHERE key = 'values'
  AND body = 'Dignity & Compassion: Respecting the lifelong contribution of seniors.\nInclusion & Equity: Ensuring accessible support across all regions.\nCommunity Partnership: Empowering local leaders to drive elder care.\nTransparency & Accountability: Operating with integrity in every initiative.';