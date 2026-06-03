-- ─── Partnership Inquiries Table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partnership_inquiries (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name VARCHAR(255) NOT NULL,
  contact_person    VARCHAR(255) NOT NULL,
  email             VARCHAR(255) NOT NULL,
  phone             VARCHAR(50),
  partnership_type  VARCHAR(100) NOT NULL,
  message           TEXT         NOT NULL,
  status            VARCHAR(50)  NOT NULL DEFAULT 'New',
  -- 'New' | 'Contacted' | 'In Discussion' | 'Approved' | 'Rejected' | 'Closed'
  internal_notes    TEXT,
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── Activity Timeline Table ──────────────────────────────────────────────────
-- Tracks every status change for a full audit trail.
-- Decoupled from inquiries so future fields (actor, IP, etc.) can be added.
CREATE TABLE IF NOT EXISTS partnership_activity (
  id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID         NOT NULL REFERENCES partnership_inquiries(id) ON DELETE CASCADE,
  action     VARCHAR(255) NOT NULL,   -- e.g. "Created", "Marked Contacted", "Approved"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── Performance Indexes ──────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_partnership_status
  ON partnership_inquiries(status);

CREATE INDEX IF NOT EXISTS idx_partnership_created_at
  ON partnership_inquiries(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_partnership_type
  ON partnership_inquiries(partnership_type);

CREATE INDEX IF NOT EXISTS idx_partnership_activity_inquiry
  ON partnership_activity(inquiry_id);
