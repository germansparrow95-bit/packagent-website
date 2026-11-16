CREATE TABLE IF NOT EXISTS releases (
  id TEXT PRIMARY KEY NOT NULL,
  version TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'stable',
  platform TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT,
  file_size INTEGER,
  sha256 TEXT,
  release_notes TEXT NOT NULL DEFAULT '',
  is_published INTEGER NOT NULL DEFAULT 0,
  download_count INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS releases_version_platform_channel_unique
  ON releases (version, platform, channel);

CREATE INDEX IF NOT EXISTS releases_published_lookup
  ON releases (platform, channel, is_published, published_at);

CREATE TABLE IF NOT EXISTS download_events (
  id TEXT PRIMARY KEY NOT NULL,
  release_id TEXT NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
  source TEXT NOT NULL DEFAULT 'website',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS download_events_release_created
  ON download_events (release_id, created_at);

CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'other',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS feedback_status_created
  ON feedback (status, created_at);
