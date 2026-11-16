import { adminUnauthorized, isAdminRequest } from "@/lib/auth";
import { deleteFeedback, updateFeedbackStatus } from "@/lib/data/feedback";
import { errorResponse, HttpError, readJsonBody } from "@/lib/http";
import { feedbackStatusSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!isAdminRequest(request)) return adminUnauthorized();

  try {
    const { id } = await context.params;
    if (!/^[0-9a-f-]{16,64}$/i.test(id)) {
      throw new HttpError(400, "反馈 ID 无效");
    }

    const parsed = feedbackStatusSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) throw new HttpError(400, "反馈状态无效");

    const row = await updateFeedbackStatus(id, parsed.data.status);
    if (!row) throw new HttpError(404, "反馈不存在");

    return Response.json(
      { feedback: row },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
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
    if (!/^[0-9a-f-]{16,64}$/i.test(id)) {
      throw new HttpError(400, "反馈 ID 无效");
    }

    const deleted = await deleteFeedback(id);
    if (!deleted) throw new HttpError(404, "反馈不存在");

    return Response.json(
      { deleted: true, id: deleted.id },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
