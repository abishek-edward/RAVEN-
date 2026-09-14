-- ============================================================
-- RAVEN Civic Intelligence Platform — PostgreSQL Schema
-- Database: Supabase PostgreSQL
-- ============================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id VARCHAR(64) PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Citizen',
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Schemes Table (Module A: Government Scheme & Policy Promise Tracker)
CREATE TABLE IF NOT EXISTS schemes (
  id VARCHAR(64) PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  department TEXT,
  location TEXT,
  category TEXT,
  official_status TEXT,
  trust_label VARCHAR(32) DEFAULT 'OFFICIAL',
  is_demo_record BOOLEAN DEFAULT FALSE,
  official_source JSONB DEFAULT '{}'::jsonb,
  objective TEXT,
  benefit TEXT,
  eligibility TEXT,
  required_documents JSONB DEFAULT '[]'::jsonb,
  application_process TEXT,
  timeline TEXT,
  simple_english_explanation TEXT,
  simple_tamil_explanation TEXT,
  official_channel_key TEXT,
  official_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Scheme Experience Reports Table (Citizen Ground Submissions)
CREATE TABLE IF NOT EXISTS scheme_reports (
  id VARCHAR(64) PRIMARY KEY,
  scheme_id VARCHAR(64) REFERENCES schemes(id) ON DELETE CASCADE,
  user_id VARCHAR(64) REFERENCES profiles(id) ON DELETE SET NULL,
  citizen_name TEXT DEFAULT 'Anonymous Citizen',
  is_anonymous BOOLEAN DEFAULT TRUE,
  district TEXT,
  college TEXT,
  location_detail TEXT,
  category TEXT NOT NULL,
  language TEXT DEFAULT 'English',
  report_text TEXT NOT NULL,
  delay_days INTEGER,
  attachments JSONB DEFAULT '[]'::jsonb,
  evidence_count INTEGER DEFAULT 0,
  evidence_type TEXT DEFAULT 'Citizen testimony',
  status TEXT DEFAULT 'Citizen-Reported',
  date_reported DATE DEFAULT CURRENT_DATE,
  upvotes INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Scheme Clusters / Aggregated Implementation Gap Analysis Table
CREATE TABLE IF NOT EXISTS scheme_clusters (
  id VARCHAR(64) PRIMARY KEY,
  scheme_id VARCHAR(64) REFERENCES schemes(id) ON DELETE CASCADE UNIQUE,
  total_citizen_reports INTEGER DEFAULT 0,
  evidence_count INTEGER DEFAULT 0,
  reported_districts JSONB DEFAULT '[]'::jsonb,
  breakdown JSONB DEFAULT '[]'::jsonb,
  platform_summary TEXT,
  average_delay_days INTEGER DEFAULT 0,
  implementation_gap_status TEXT DEFAULT 'Under observation',
  official_response TEXT,
  last_analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Issue Clusters Table (Module B: Everyday Civic Issue Correlated Clusters)
CREATE TABLE IF NOT EXISTS issue_clusters (
  id VARCHAR(64) PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  department TEXT,
  official_channel_key TEXT,
  location TEXT NOT NULL,
  district TEXT NOT NULL,
  latitude DOUBLE PRECISION DEFAULT 13.0827,
  longitude DOUBLE PRECISION DEFAULT 80.2707,
  reports_count INTEGER DEFAULT 1,
  confirmations_count INTEGER DEFAULT 0,
  evidence_count INTEGER DEFAULT 0,
  affected_locations JSONB DEFAULT '[]'::jsonb,
  severity TEXT DEFAULT 'Medium',
  duration_days INTEGER DEFAULT 7,
  public_support_score INTEGER DEFAULT 0,
  ai_priority_data JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'Monitoring',
  first_reported_date DATE DEFAULT CURRENT_DATE,
  last_reported_date DATE DEFAULT CURRENT_DATE,
  trust_label VARCHAR(32) DEFAULT 'ANALYSIS',
  ai_summary TEXT,
  common_keywords JSONB DEFAULT '[]'::jsonb,
  relevant_official_channels JSONB DEFAULT '{}'::jsonb,
  grievance_status TEXT DEFAULT 'Under Monitoring',
  official_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Issue Reports Table (Individual Citizen Civic Reports)
CREATE TABLE IF NOT EXISTS issue_reports (
  id VARCHAR(64) PRIMARY KEY,
  cluster_id VARCHAR(64) REFERENCES issue_clusters(id) ON DELETE SET NULL,
  user_id VARCHAR(64) REFERENCES profiles(id) ON DELETE SET NULL,
  text TEXT NOT NULL,
  language TEXT DEFAULT 'English',
  location TEXT NOT NULL,
  district TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_issue TEXT,
  reported_by TEXT DEFAULT 'Anonymous Citizen',
  is_anonymous BOOLEAN DEFAULT TRUE,
  date DATE DEFAULT CURRENT_DATE,
  attachments JSONB DEFAULT '[]'::jsonb,
  has_photo BOOLEAN DEFAULT FALSE,
  photo_url TEXT,
  duration_days INTEGER DEFAULT 7,
  status TEXT DEFAULT 'Citizen-Reported',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Confirmations Table (Module B: Confirmation Loop "Is this still a problem?")
CREATE TABLE IF NOT EXISTS confirmations (
  id SERIAL PRIMARY KEY,
  cluster_id VARCHAR(64) REFERENCES issue_clusters(id) ON DELETE CASCADE,
  is_still_problem BOOLEAN NOT NULL,
  citizen TEXT DEFAULT 'Anonymous Citizen',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_scheme_reports_scheme ON scheme_reports(scheme_id);
CREATE INDEX IF NOT EXISTS idx_scheme_clusters_scheme ON scheme_clusters(scheme_id);
CREATE INDEX IF NOT EXISTS idx_issue_reports_cluster ON issue_reports(cluster_id);
CREATE INDEX IF NOT EXISTS idx_confirmations_cluster ON confirmations(cluster_id);
