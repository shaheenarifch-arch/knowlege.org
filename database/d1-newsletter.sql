-- Knowlege Letter subscribers table for Cloudflare D1 (SQLite).
-- Run once:  npx wrangler d1 execute newsletter --remote --file=database/d1-newsletter.sql
-- Help: https://developers.cloudflare.com/d1/wrangler-commands/#d1-execute
CREATE TABLE IF NOT EXISTS subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  language TEXT DEFAULT 'en',
  country TEXT,
  consent_at TEXT NOT NULL,
  verified_at TEXT,
  unsubscribed_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
