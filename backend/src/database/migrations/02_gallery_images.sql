-- ─── Program Images Table (Gallery Support) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS program_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
