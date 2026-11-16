import "server-only";

export async function readJsonBody(request: Request, maxBytes = 20_000) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    throw new HttpError(415, "Content-Type 必须为 application/json");
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > maxBytes) {
    throw new HttpError(413, "请求内容过大");
  }

  const text = await request.text();
  if (Buffer.byteLength(text, "utf8") > maxBytes) {
    throw new HttpError(413, "请求内容过大");
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new HttpError(400, "JSON 格式无效");
  }
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof HttpError) {
    return Response.json(
      { error: error.message },
      { status: error.status, headers: { "Cache-Control": "no-store" } },
    );
  }

  console.error(error);
  return Response.json(
    { error: "服务暂时不可用，请稍后再试" },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
