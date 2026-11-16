import "server-only";

import { timingSafeEqual } from "node:crypto";

export function isAdminRequest(request: Request) {
  const expected = process.env.ADMIN_TOKEN;
  const authorization = request.headers.get("authorization");
  if (!expected || expected.length < 16 || !authorization?.startsWith("Bearer ")) {
    return false;
  }

  const received = Buffer.from(authorization.slice(7), "utf8");
  const wanted = Buffer.from(expected, "utf8");
  return received.length === wanted.length && timingSafeEqual(received, wanted);
}

export function adminUnauthorized() {
  return Response.json(
    { error: "Unauthorized" },
    {
      status: 401,
      headers: { "WWW-Authenticate": "Bearer", "Cache-Control": "no-store" },
    },
  );
}
