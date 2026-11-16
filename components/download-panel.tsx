"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PublicRelease = {
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

function formatBytes(bytes: number | null) {
  if (!bytes) return "大小待定";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden="true">
      <path d="M4 9h10M10 5l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function DownloadPanel() {
  const [release, setRelease] = useState<PublicRelease | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/releases/latest?platform=win-x64&channel=stable")
      .then(async (response) => {
        if (!response.ok) return { release: null };
        return (await response.json()) as { release: PublicRelease | null };
      })
      .then((data) => {
        if (active) setRelease(data.release);
      })
      .catch(() => {
        if (active) setRelease(null);
      })
      .finally(() => {
        if (active) setLoaded(true);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="download-card">
      <div className="download-icon" aria-hidden="true">
        <span />
        <i />
      </div>
      <div className="download-info">
        <span>PackAgent for Windows</span>
        <strong>
          {!loaded
            ? "正在检查最新版本…"
            : release
              ? `${formatBytes(release.fileSize)} · Windows 10 / 11`
              : "Windows 10 / 11 · 64-bit"}
        </strong>
      </div>
      <div className="download-spec">
        <span>版本</span>
        <strong>{release?.version || "0.1.4"}</strong>
      </div>
      {release ? (
        <a
          className="button button-white"
          href={`/api/download/${encodeURIComponent(release.id)}?source=website`}
        >
          下载 Windows 版
          <ArrowIcon />
        </a>
      ) : (
        <Link className="button button-white" href="/install">
          {loaded ? "安装与要求" : "查看最新版本"}
          <ArrowIcon />
        </Link>
      )}
      {release?.sha256 ? (
        <p className="download-hash">
          SHA256 <code>{release.sha256.slice(0, 20)}…{release.sha256.slice(-8)}</code>
        </p>
      ) : null}
    </div>
  );
}
