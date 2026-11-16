import { recordDownload } from "@/lib/data/releases";
import { errorResponse } from "@/lib/http";
import { normalizeSource } from "@/lib/validation";

export const dynamic = "force-dynamic";
const releaseIdPattern = /^[a-z0-9][a-z0-9.-]{7,79}$/i;

export async function GET(
  request: Request,
  context: { params: Promise<{ releaseId: string }> },
) {
  try {
    const { releaseId } = await context.params;
    if (!releaseIdPattern.test(releaseId)) {
      return Response.json(
        { error: "下载版本不存在" },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    const url = new URL(request.url);
    const source = normalizeSource(url.searchParams.get("source"));
    const release = await recordDownload(releaseId, source);
    if (!release) {
      return Response.json(
        { error: "当前没有可下载的安装包" },
        { status: 404, headers: { "Cache-Control": "no-store" } },
      );
    }

    const destination = new URL(release.fileUrl, request.url);
    return new Response(null, {
      status: 302,
      headers: {
        Location: destination.toString(),
        "Cache-Control": "no-store",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
