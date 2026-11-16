const baseUrl = process.env.SITE_TEST_URL || "http://localhost:3000";
const adminToken = process.env.ADMIN_TOKEN;

if (!adminToken) {
  throw new Error("ADMIN_TOKEN is required for the API smoke test");
}

const errors = [];
let releaseId = null;
let feedbackId = null;

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();
  return { response, body };
}

function expect(condition, message) {
  if (!condition) errors.push(message);
}

try {
  const health = await request("/api/health");
  expect(health.response.status === 200, "health endpoint did not return 200");
  expect(health.body.database === "connected", "database is not connected");

  const unauthorized = await request("/api/admin/releases");
  expect(unauthorized.response.status === 401, "admin endpoint accepted an anonymous request");

  const feedbackCreated = await request("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "API smoke test",
      email: "",
      category: "other",
      message: "This automated feedback entry will be removed after the test.",
      website: "",
    }),
  });
  expect(feedbackCreated.response.status === 201, "feedback creation failed");
  feedbackId = feedbackCreated.body.id || null;

  const feedbackList = await request("/api/admin/feedback?limit=10", {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  expect(feedbackList.response.status === 200, "admin feedback list failed");
  expect(
    Array.isArray(feedbackList.body.feedback) &&
      feedbackList.body.feedback.some((entry) => entry.id === feedbackId),
    "created feedback was not persisted",
  );

  const version = `0.0.${Math.floor(Date.now() / 1000) % 1000}-smoke`;
  const releaseCreated = await request("/api/admin/releases", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version,
      channel: "beta",
      platform: "smoke-x64",
      fileName: "PackAgent-Smoke.exe",
      fileUrl: "https://example.com/PackAgent-Smoke.exe",
      fileSize: 1024,
      sha256: "a".repeat(64),
      releaseNotes: "API smoke test release",
      isPublished: true,
    }),
  });
  expect(releaseCreated.response.status === 201, "release creation failed");
  releaseId = releaseCreated.body.release?.id || null;

  const latest = await request("/api/releases/latest?platform=smoke-x64&channel=beta");
  expect(latest.response.status === 200, "public latest release lookup failed");
  expect(latest.body.release?.id === releaseId, "latest release was not found");

  const download = await fetch(`${baseUrl}/api/download/${releaseId}?source=smoke`, {
    redirect: "manual",
  });
  expect(download.status === 302, "download endpoint did not redirect");

  const releases = await request("/api/admin/releases", {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const storedRelease = releases.body.releases?.find((entry) => entry.id === releaseId);
  expect(storedRelease?.downloadCount === 1, "download count was not incremented");
} finally {
  if (feedbackId) {
    await request(`/api/admin/feedback/${feedbackId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  }

  if (releaseId) {
    await request(`/api/admin/releases/${releaseId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isPublished: false }),
    });
    await request(`/api/admin/releases/${releaseId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("API smoke test passed.");
}
