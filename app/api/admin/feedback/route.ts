import { adminUnauthorized, isAdminRequest } from "@/lib/auth";
import { listFeedback } from "@/lib/data/feedback";
import { errorResponse } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return adminUnauthorized();

  try {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit") || 100);
    return Response.json(
      { feedback: await listFeedback(Number.isFinite(limit) ? limit : 100) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
