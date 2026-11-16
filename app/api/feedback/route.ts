import { createFeedback } from "@/lib/data/feedback";
import { errorResponse, HttpError, readJsonBody } from "@/lib/http";
import { consumeRateLimit, requestFingerprint } from "@/lib/rate-limit";
import { feedbackInputSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const rate = consumeRateLimit(requestFingerprint(request));
    if (rate.limited) {
      throw new HttpError(429, "提交过于频繁，请稍后再试");
    }

    const parsed = feedbackInputSchema.safeParse(await readJsonBody(request));
    if (!parsed.success) {
      return Response.json(
        {
          error: "请检查填写内容",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    // A filled honeypot is treated as a successful no-op to discourage bots.
    if (parsed.data.website) {
      return Response.json(
        { accepted: true },
        { status: 202, headers: { "Cache-Control": "no-store" } },
      );
    }

    const row = await createFeedback(parsed.data);
    return Response.json(
      { accepted: true, id: row.id },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
