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

-- =========================================================
-- PHASE 6: RESEARCH INSTITUTION LAYER
-- =========================================================

CREATE TABLE IF NOT EXISTS graph_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_type TEXT NOT NULL CHECK(node_type IN ('THEME','PERSON','SOURCE','AYAH','HADITH','ARTICLE')),
  entity_id UUID,
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  review_status TEXT NOT NULL DEFAULT 'DRAFT',
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS graph_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_node_id UUID NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
  to_node_id UUID NOT NULL REFERENCES graph_nodes(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL,
  explanation TEXT,
  review_status TEXT NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(from_node_id,to_node_id,relationship_type)
);
CREATE TABLE IF NOT EXISTS graph_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  edge_id UUID NOT NULL REFERENCES graph_edges(id) ON DELETE CASCADE,
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  reference TEXT NOT NULL,
  evidence_note TEXT,
  review_status TEXT NOT NULL DEFAULT 'DRAFT'
);

CREATE TABLE IF NOT EXISTS research_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  private BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES research_collections(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  annotation TEXT,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(collection_id,entity_type,entity_id)
);
CREATE TABLE IF NOT EXISTS saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  query TEXT NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS bibliographies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  citation_style TEXT NOT NULL DEFAULT 'Chicago',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS bibliography_items (
  bibliography_id UUID NOT NULL REFERENCES bibliographies(id) ON DELETE CASCADE,
  source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  notes TEXT,
  PRIMARY KEY(bibliography_id,source_id)
);

CREATE TABLE IF NOT EXISTS scholar_works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID NOT NULL,
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  work_type TEXT,
  publication_year INTEGER,
  canonical_url TEXT,
  review_status TEXT NOT NULL DEFAULT 'DRAFT'
);
CREATE TABLE IF NOT EXISTS scholar_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_person_id UUID NOT NULL,
  to_person_id UUID NOT NULL,
  relationship_type TEXT NOT NULL,
  source_note TEXT,
  review_status TEXT NOT NULL DEFAULT 'DRAFT',
  UNIQUE(from_person_id,to_person_id,relationship_type)
);

CREATE TABLE IF NOT EXISTS media_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  review_status TEXT NOT NULL DEFAULT 'DRAFT'
);
CREATE TABLE IF NOT EXISTS media_playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'DRAFT'
);
CREATE TABLE IF NOT EXISTS media_playlist_items (
  playlist_id UUID NOT NULL REFERENCES media_playlists(id) ON DELETE CASCADE,
  media_item_id UUID NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(playlist_id,media_item_id)
);

CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  level TEXT NOT NULL DEFAULT 'BEGINNER',
  status TEXT NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  body_markdown TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  source_links JSONB NOT NULL DEFAULT '[]',
  review_status TEXT NOT NULL DEFAULT 'DRAFT',
  UNIQUE(course_id,slug)
);
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id,course_id)
);
CREATE TABLE IF NOT EXISTS lesson_progress (
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  reflection TEXT,
  PRIMARY KEY(enrollment_id,lesson_id)
);

CREATE TABLE IF NOT EXISTS abdul_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  preferred_language TEXT DEFAULT 'en',
  preferred_mode TEXT DEFAULT 'LEARN',
  voice_enabled BOOLEAN DEFAULT true,
  memory_enabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS abdul_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL,
  memory_text TEXT NOT NULL,
  source_session_id UUID REFERENCES abdul_sessions(id) ON DELETE SET NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS charity_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  charity_id UUID NOT NULL REFERENCES charities(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  country_code TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS charity_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES charity_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  evidence_urls JSONB NOT NULL DEFAULT '[]',
  review_status TEXT NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS resource_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES help_resources(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  availability_note TEXT,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  next_review_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  properties JSONB NOT NULL DEFAULT '{}',
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_analytics_event_time ON analytics_events(event_name,occurred_at);
CREATE TABLE IF NOT EXISTS search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anonymous_id TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  filters JSONB NOT NULL DEFAULT '{}',
  result_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS job_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL,
  status TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  severity TEXT NOT NULL,
  source TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}',
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
