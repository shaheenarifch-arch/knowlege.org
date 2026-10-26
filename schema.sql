CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE subscribers(id UUID PRIMARY KEY,email TEXT UNIQUE NOT NULL,language TEXT DEFAULT 'en',country TEXT,consent_at TIMESTAMPTZ NOT NULL,verified_at TIMESTAMPTZ,unsubscribed_at TIMESTAMPTZ,created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE newsletter_campaigns(id UUID PRIMARY KEY,title TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'DRAFT',segment JSONB DEFAULT '{}',body_markdown TEXT NOT NULL,scheduled_at TIMESTAMPTZ,sent_at TIMESTAMPTZ,created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE newsletter_events(id UUID PRIMARY KEY,subscriber_id UUID REFERENCES subscribers(id),campaign_id UUID REFERENCES newsletter_campaigns(id),event_type TEXT NOT NULL,created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE editorial_items(id UUID PRIMARY KEY,slug TEXT UNIQUE NOT NULL,title TEXT NOT NULL,content_type TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'DRAFT',language TEXT DEFAULT 'en',body_markdown TEXT NOT NULL,source_notes JSONB DEFAULT '[]',reviewer TEXT,published_at TIMESTAMPTZ,created_at TIMESTAMPTZ DEFAULT now());
CREATE TABLE charities(id UUID PRIMARY KEY,name TEXT NOT NULL,country TEXT NOT NULL,registration_number TEXT,official_url TEXT NOT NULL,service_types TEXT[] DEFAULT '{}',verification_status TEXT DEFAULT 'PENDING',last_reviewed TIMESTAMPTZ,active BOOLEAN DEFAULT false);
CREATE TABLE help_resources(id UUID PRIMARY KEY,name TEXT NOT NULL,country TEXT NOT NULL,region TEXT,service_type TEXT NOT NULL,official_url TEXT NOT NULL,eligibility TEXT,languages TEXT[] DEFAULT '{}',verification_status TEXT DEFAULT 'PENDING',last_reviewed TIMESTAMPTZ,active BOOLEAN DEFAULT false);
CREATE TABLE scholars(id UUID PRIMARY KEY,slug TEXT UNIQUE NOT NULL,name TEXT NOT NULL,biography TEXT,works JSONB DEFAULT '[]',subjects TEXT[] DEFAULT '{}',review_status TEXT DEFAULT 'PENDING');
CREATE TABLE media_items(id UUID PRIMARY KEY,slug TEXT UNIQUE NOT NULL,title TEXT NOT NULL,media_type TEXT NOT NULL,source_url TEXT NOT NULL,speaker TEXT,language TEXT,transcript_status TEXT DEFAULT 'NONE',rights_status TEXT DEFAULT 'PENDING',review_status TEXT DEFAULT 'PENDING');
CREATE TABLE research_sources(id UUID PRIMARY KEY,title TEXT NOT NULL,source_type TEXT NOT NULL,author TEXT,edition TEXT,language TEXT,license TEXT,canonical_url TEXT,checksum TEXT,review_status TEXT DEFAULT 'PENDING',last_reviewed TIMESTAMPTZ);
CREATE TABLE corrections(id UUID PRIMARY KEY,entity_type TEXT NOT NULL,entity_id UUID,reporter_email TEXT,description TEXT NOT NULL,status TEXT DEFAULT 'OPEN',created_at TIMESTAMPTZ DEFAULT now());

CREATE TABLE abdul_sessions(id UUID PRIMARY KEY, user_id UUID, language TEXT DEFAULT 'en', mode TEXT DEFAULT 'learn', created_at TIMESTAMPTZ DEFAULT now(), expires_at TIMESTAMPTZ);
CREATE TABLE abdul_messages(id UUID PRIMARY KEY, session_id UUID REFERENCES abdul_sessions(id) ON DELETE CASCADE, role TEXT NOT NULL, content TEXT NOT NULL, citations JSONB DEFAULT '[]', safety_category TEXT, created_at TIMESTAMPTZ DEFAULT now());

-- Phase 5 production MVP additions
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email CITEXT UNIQUE NOT NULL,
  display_name TEXT,
  preferred_language TEXT DEFAULT 'en',
  email_verified_at TIMESTAMPTZ,
  disabled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('USER','EDITOR','REVIEWER','ADMIN')),
  PRIMARY KEY(user_id,role)
);
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  translator TEXT,
  edition TEXT,
  language TEXT,
  canonical_url TEXT,
  license_name TEXT,
  license_url TEXT,
  attribution_text TEXT,
  checksum TEXT,
  review_status TEXT DEFAULT 'DRAFT',
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  last_reviewed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS theme_source_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id UUID REFERENCES themes(id) ON DELETE CASCADE,
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  reference TEXT NOT NULL,
  editorial_note TEXT,
  review_status TEXT DEFAULT 'DRAFT'
);
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id,entity_type,entity_id)
);
CREATE TABLE IF NOT EXISTS user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  private BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER,
  status TEXT DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE TABLE IF NOT EXISTS study_plan_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_plan_id UUID REFERENCES study_plans(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  instructions TEXT,
  source_links JSONB DEFAULT '[]',
  UNIQUE(study_plan_id,day_number)
);
CREATE TABLE IF NOT EXISTS user_study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  study_plan_id UUID REFERENCES study_plans(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id,study_plan_id)
);
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  before_data JSONB,
  after_data JSONB,
  request_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
