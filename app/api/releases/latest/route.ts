import { getLatestPublicRelease } from "@/lib/data/releases";
import { errorResponse } from "@/lib/http";
import { platformPattern } from "@/lib/platforms";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const platform = url.searchParams.get("platform") || "win-x64";
    const channel = url.searchParams.get("channel") || "stable";

    if (!platformPattern.test(platform) || !["stable", "beta"].includes(channel)) {
      return Response.json(
        { error: "平台或发布通道无效" },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const release = await getLatestPublicRelease(platform, channel);
    return Response.json(
      { release },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
