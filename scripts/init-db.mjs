import { createClient } from "@libsql/client";
import { mkdir, readFile } from "node:fs/promises";

const databaseUrl = process.env.DATABASE_URL || "file:data/packagent.db";
const authToken = process.env.DATABASE_AUTH_TOKEN || undefined;

if (databaseUrl.startsWith("file:")) {
  await mkdir("data", { recursive: true });
}

const client = createClient({ url: databaseUrl, authToken });
const migration = await readFile("drizzle/0000_initial.sql", "utf8");
await client.executeMultiple(migration);

const now = new Date().toISOString();
await client.execute({
  sql: `insert into releases (
    id, version, channel, platform, file_name, release_notes,
    is_published, download_count, created_at, updated_at
  ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  on conflict(version, platform, channel) do nothing`,
  args: [
    "release-0.1.4-win-x64",
    "0.1.4",
    "stable",
    "win-x64",
    "PackAgent-Setup-0.1.4-win-x64.exe",
    "PackAgent 首个 Windows 发布版本。",
    0,
    0,
    now,
    now,
  ],
});

const tables = await client.execute(
  "select name from sqlite_master where type = 'table' and name not like 'sqlite_%' order by name",
);
console.log(`Database ready: ${databaseUrl}`);
console.log(`Tables: ${tables.rows.map((row) => row.name).join(", ")}`);
