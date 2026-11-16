import "server-only";

import { createHash } from "node:crypto";

type WindowState = {
  count: number;
  resetsAt: number;
};

const windows = new Map<string, WindowState>();
const MAX_TRACKED_KEYS = 5_000;

export function requestFingerprint(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip") || "local";
  const userAgent = request.headers.get("user-agent") || "unknown";
  return createHash("sha256").update(`${address}|${userAgent}`).digest("hex");
}

export function consumeRateLimit(
  key: string,
  {
    limit = 5,
    windowMs = 10 * 60 * 1_000,
  }: { limit?: number; windowMs?: number } = {},
) {
  const now = Date.now();
  const current = windows.get(key);

  if (!current || current.resetsAt <= now) {
    windows.set(key, { count: 1, resetsAt: now + windowMs });
  } else {
    current.count += 1;
  }

  if (windows.size > MAX_TRACKED_KEYS) {
    for (const [entryKey, entry] of windows) {
      if (entry.resetsAt <= now) windows.delete(entryKey);
    }
  }

  const state = windows.get(key)!;
  return {
    limited: state.count > limit,
    remaining: Math.max(0, limit - state.count),
    resetAt: state.resetsAt,
  };
}
