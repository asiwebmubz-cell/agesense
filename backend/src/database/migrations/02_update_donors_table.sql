-- ─── Alter Donors Table ──────────────────────────────────────────────────────
ALTER TABLE donors 
ADD COLUMN IF NOT EXISTS phone VARCHAR(50),
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(100),
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS verified_by VARCHAR(255),
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_status_change_at TIMESTAMP WITH TIME ZONE;

-- ─── Migrate Existing payment_status values ─────────────────────────────────
UPDATE donors 
SET payment_status = 'Verified' 
WHERE payment_status = 'Completed';

UPDATE donors 
SET payment_status = 'Rejected' 
WHERE payment_status = 'Failed';

-- ─── Backfill last_status_change_at with updated_at ─────────────────────────
UPDATE donors
SET last_status_change_at = updated_at
WHERE last_status_change_at IS NULL;
