import { createClient } from "@libsql/client";
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";

const databaseUrl = process.env.DATABASE_URL || "file:data/packagent.db";
const authToken = process.env.DATABASE_AUTH_TOKEN || undefined;
const installerPath =
  process.argv[2] ||
  "public/downloads/PackAgent-Setup-0.1.4-win-x64.exe";
const fileName = path.basename(installerPath);

if (!/^PackAgent-Setup-\d+\.\d+\.\d+-win-x64\.exe$/i.test(fileName)) {
  throw new Error("Installer filename does not match the expected version format");
}

const version = fileName.match(/^PackAgent-Setup-(\d+\.\d+\.\d+)-win-x64\.exe$/i)?.[1];
if (!version) throw new Error("Unable to determine installer version");

const details = await stat(installerPath);
const hash = createHash("sha256");
for await (const chunk of createReadStream(installerPath)) hash.update(chunk);
const sha256 = hash.digest("hex").toUpperCase();
const now = new Date().toISOString();

const client = createClient({ url: databaseUrl, authToken });
await client.execute({
  sql: `insert into releases (
    id, version, channel, platform, file_name, file_url, file_size, sha256,
    release_notes, is_published, download_count, published_at, created_at, updated_at
  ) values (?, ?, 'stable', 'win-x64', ?, ?, ?, ?, ?, 1, 0, ?, ?, ?)
  on conflict(version, platform, channel) do update set
    file_name = excluded.file_name,
    file_url = excluded.file_url,
    file_size = excluded.file_size,
    sha256 = excluded.sha256,
    release_notes = excluded.release_notes,
    is_published = 1,
    published_at = coalesce(releases.published_at, excluded.published_at),
    updated_at = excluded.updated_at`,
  args: [
    `release-${version}-win-x64`,
    version,
    fileName,
    `/downloads/${fileName}`,
    details.size,
    sha256,
    `PackAgent ${version} Windows 发布版本。`,
    now,
    now,
    now,
  ],
});

console.log(
  JSON.stringify(
    {
      version,
      fileName,
      fileSize: details.size,
      sha256,
      published: true,
      databaseUrl,
    },
    null,
    2,
  ),
);
