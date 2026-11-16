import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const releases = sqliteTable(
  "releases",
  {
    id: text("id").primaryKey(),
    version: text("version").notNull(),
    channel: text("channel").notNull().default("stable"),
    platform: text("platform").notNull(),
    fileName: text("file_name").notNull(),
    fileUrl: text("file_url"),
    fileSize: integer("file_size"),
    sha256: text("sha256"),
    releaseNotes: text("release_notes").notNull().default(""),
    isPublished: integer("is_published", { mode: "boolean" })
      .notNull()
      .default(false),
    downloadCount: integer("download_count").notNull().default(0),
    publishedAt: text("published_at"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("releases_version_platform_channel_unique").on(
      table.version,
      table.platform,
      table.channel,
    ),
    index("releases_published_lookup").on(
      table.platform,
      table.channel,
      table.isPublished,
      table.publishedAt,
    ),
  ],
);

export const downloadEvents = sqliteTable(
  "download_events",
  {
    id: text("id").primaryKey(),
    releaseId: text("release_id")
      .notNull()
      .references(() => releases.id, { onDelete: "cascade" }),
    source: text("source").notNull().default("website"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    index("download_events_release_created").on(
      table.releaseId,
      table.createdAt,
    ),
  ],
);

export const feedback = sqliteTable(
  "feedback",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull().default(""),
    email: text("email").notNull().default(""),
    category: text("category").notNull().default("other"),
    message: text("message").notNull(),
    status: text("status").notNull().default("new"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    index("feedback_status_created").on(table.status, table.createdAt),
  ],
);

export type ReleaseRow = typeof releases.$inferSelect;
export type FeedbackRow = typeof feedback.$inferSelect;
