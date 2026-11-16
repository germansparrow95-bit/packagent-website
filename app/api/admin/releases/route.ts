import { adminUnauthorized, isAdminRequest } from "@/lib/auth";
import { createRelease, listReleases } from "@/lib/data/releases";
import { errorResponse, HttpError, readJsonBody } from "@/lib/http";
import { releaseInputSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return adminUnauthorized();

  try {
    return Response.json(
      { releases: await listReleases() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return adminUnauthorized();

  try {
    const parsed = releaseInputSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      return Response.json(
        {
          error: "版本信息无效",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const release = await createRelease(parsed.data);
    return Response.json(
      { release },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE")) {
      throw new HttpError(409, "该版本、平台和通道已经存在");
    }
    return errorResponse(error);
  }
}
