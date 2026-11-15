-- Guest posts ("Write for us") for Cloudflare D1 (SQLite). Uses the same D1 database as the newsletter.
-- Run once:  npx wrangler d1 execute newsletter --remote --file=database/d1-guest-posts.sql
-- Help: https://developers.cloudflare.com/d1/wrangler-commands/#d1-execute
--
-- Status flow: SUBMITTED -> IN_REVIEW -> CHANGES_REQUESTED -> RESUBMITTED -> PUBLISHED
--                                     \-> DECLINED
CREATE TABLE IF NOT EXISTS guest_posts (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,          -- tracking code shown to the writer, e.g. KG-7F3K9Q
  edit_token TEXT NOT NULL,           -- secret in the "edit and resubmit" link
  status TEXT NOT NULL DEFAULT 'SUBMITTED',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  bio TEXT NOT NULL,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  refs TEXT NOT NULL,
  slug TEXT UNIQUE,                   -- set when published: /blog/guest/<slug>
  editor_note TEXT,                   -- last note to the writer (changes requested / declined)
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  published_at TEXT,
  last_reminded_at TEXT
);
CREATE INDEX IF NOT EXISTS guest_posts_status ON guest_posts(status, updated_at);

-- History of every step, shown on the admin screen.
CREATE TABLE IF NOT EXISTS guest_post_events (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  event TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS guest_post_events_post ON guest_post_events(post_id, created_at);
