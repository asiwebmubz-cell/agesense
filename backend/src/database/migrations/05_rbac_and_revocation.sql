-- 1. Add role to users
ALTER TABLE users
ADD COLUMN role VARCHAR(50) DEFAULT 'admin';

-- 2. Create revoked_tokens table
CREATE TABLE IF NOT EXISTS revoked_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_jti VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Add fingerprinting to refresh_tokens
ALTER TABLE refresh_tokens
ADD COLUMN user_agent TEXT,
ADD COLUMN last_used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_revoked_tokens_jti ON revoked_tokens(token_jti);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_security_logs_created ON security_logs(created_at);
