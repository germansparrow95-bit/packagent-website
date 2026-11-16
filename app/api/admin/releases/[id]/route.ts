import { adminUnauthorized, isAdminRequest } from "@/lib/auth";
import { deleteDraftRelease, updateRelease } from "@/lib/data/releases";
import { errorResponse, HttpError, readJsonBody } from "@/lib/http";
import { releasePatchSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";
const releaseIdPattern = /^[a-z0-9][a-z0-9.-]{7,79}$/i;

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!isAdminRequest(request)) return adminUnauthorized();

  try {
    const { id } = await context.params;
    if (!releaseIdPattern.test(id)) {
      throw new HttpError(400, "版本 ID 无效");
    }

    const parsed = releasePatchSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      return Response.json(
        {
          error: "版本信息无效",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    const release = await updateRelease(id, parsed.data);
    if (!release) throw new HttpError(404, "版本不存在");

    return Response.json(
      { release },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "发布版本前必须填写安装地址") {
      return errorResponse(new HttpError(400, error.message));
    }
    if (error instanceof Error && error.message.includes("UNIQUE")) {
      return errorResponse(new HttpError(409, "版本信息与现有记录冲突"));
    }
    return errorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!isAdminRequest(request)) return adminUnauthorized();

  try {
    const { id } = await context.params;
    if (!releaseIdPattern.test(id)) {
      throw new HttpError(400, "版本 ID 无效");
    }

    const deleted = await deleteDraftRelease(id);
    if (!deleted) throw new HttpError(404, "版本不存在");

    return Response.json(
      { deleted: true, id: deleted.id },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "请先取消发布，再删除版本") {
      return errorResponse(new HttpError(409, error.message));
    }
    return errorResponse(error);
  }
}
