import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "@/db/client";
import { downloadEvents, releases, type ReleaseRow } from "@/db/schema";
import type { z } from "zod";
import {
  normalizeReleaseUrl,
  releaseInputSchema,
  releasePatchSchema,
} from "@/lib/validation";

type ReleaseInput = z.infer<typeof releaseInputSchema>;
type ReleasePatch = z.infer<typeof releasePatchSchema>;

export type PublicRelease = {
  id: string;
  version: string;
  channel: string;
  platform: string;
  fileName: string;
  fileSize: number | null;
  sha256: string | null;
  releaseNotes: string;
  downloadCount: number;
  publishedAt: string;
};

function toPublicRelease(row: ReleaseRow): PublicRelease {
  return {
    id: row.id,
    version: row.version,
    channel: row.channel,
    platform: row.platform,
    fileName: row.fileName,
    fileSize: row.fileSize,
    sha256: row.sha256,
    releaseNotes: row.releaseNotes,
    downloadCount: row.downloadCount,
    publishedAt: row.publishedAt || row.createdAt,
  };
}

export async function getLatestPublicRelease(
  platform = "win-x64",
  channel = "stable",
) {
  const [row] = await db
    .select()
    .from(releases)
    .where(
      and(
        eq(releases.platform, platform),
        eq(releases.channel, channel),
        eq(releases.isPublished, true),
      ),
    )
    .orderBy(desc(releases.publishedAt), desc(releases.createdAt))
    .limit(1);

  return row ? toPublicRelease(row) : null;
}

export async function listReleases() {
  return db.select().from(releases).orderBy(desc(releases.createdAt)).limit(200);
}

export async function createRelease(input: ReleaseInput) {
  const now = new Date().toISOString();
  const fileUrl = normalizeReleaseUrl(input.fileUrl);
  if (input.isPublished && !fileUrl) {
    throw new Error("发布版本前必须填写安装地址");
  }

  const [row] = await db
    .insert(releases)
    .values({
      id: randomUUID(),
      version: input.version,
      channel: input.channel,
      platform: input.platform,
      fileName: input.fileName,
      fileUrl,
      fileSize: input.fileSize ?? null,
      sha256: input.sha256 || null,
      releaseNotes: input.releaseNotes,
      isPublished: input.isPublished,
      publishedAt: input.isPublished ? now : null,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return row;
}

export async function updateRelease(id: string, patch: ReleasePatch) {
  const [existing] = await db
    .select()
    .from(releases)
    .where(eq(releases.id, id))
    .limit(1);
  if (!existing) return null;

  const now = new Date().toISOString();
  const fileUrl =
    patch.fileUrl === undefined
      ? existing.fileUrl
      : normalizeReleaseUrl(patch.fileUrl);
  const isPublished = patch.isPublished ?? existing.isPublished;

  if (isPublished && !fileUrl) {
    throw new Error("发布版本前必须填写安装地址");
  }

  const [row] = await db
    .update(releases)
    .set({
      version: patch.version ?? existing.version,
      channel: patch.channel ?? existing.channel,
      platform: patch.platform ?? existing.platform,
      fileName: patch.fileName ?? existing.fileName,
      fileUrl,
      fileSize:
        patch.fileSize === undefined ? existing.fileSize : patch.fileSize,
      sha256:
        patch.sha256 === undefined ? existing.sha256 : patch.sha256 || null,
      releaseNotes: patch.releaseNotes ?? existing.releaseNotes,
      isPublished,
      publishedAt: isPublished
        ? existing.publishedAt || now
        : null,
      updatedAt: now,
    })
    .where(eq(releases.id, id))
    .returning();

  return row;
}

export async function recordDownload(id: string, source: string) {
  return db.transaction(async (tx) => {
    const [row] = await tx
      .update(releases)
      .set({ downloadCount: sql`${releases.downloadCount} + 1` })
      .where(and(eq(releases.id, id), eq(releases.isPublished, true)))
      .returning();

    if (!row?.fileUrl) return null;

    await tx.insert(downloadEvents).values({
      id: randomUUID(),
      releaseId: row.id,
      source,
      createdAt: new Date().toISOString(),
    });

    return { fileUrl: row.fileUrl };
  });
}

export async function deleteDraftRelease(id: string) {
  const [existing] = await db
    .select({ id: releases.id, isPublished: releases.isPublished })
    .from(releases)
    .where(eq(releases.id, id))
    .limit(1);
  if (!existing) return null;
  if (existing.isPublished) {
    throw new Error("请先取消发布，再删除版本");
  }

  await db.delete(releases).where(eq(releases.id, id));
  return existing;
}
