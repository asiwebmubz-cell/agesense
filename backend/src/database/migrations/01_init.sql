-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Users Table ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── Programs Table ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- 'Our Programs' | 'Our Work' | 'Impact Stories'
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'Draft', -- 'Published' | 'Draft'
  
  -- Program Specific Details
  subtitle VARCHAR(255),
  video_url TEXT,
  goals TEXT,
  beneficiaries TEXT,
  expense_categories TEXT,
  project_areas VARCHAR(255),
  duration VARCHAR(255),
  active_years VARCHAR(255),
  packages_distributed VARCHAR(255),
  gallery_title_1 VARCHAR(255),
  gallery_link_1 TEXT,
  gallery_title_2 VARCHAR(255),
  gallery_link_2 TEXT,
  gallery_description TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── Volunteers Table ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending' | 'Approved' | 'Rejected'
  form_data_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── Donors Table ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL DEFAULT 'Anonymous',
  email VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending' | 'Completed' | 'Failed'
  transaction_id VARCHAR(100) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
