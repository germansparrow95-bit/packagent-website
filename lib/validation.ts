import { z } from "zod";

const versionPattern = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const platformPattern = /^[a-z0-9][a-z0-9-]{1,31}$/;
const sha256Pattern = /^[a-f0-9]{64}$/i;
const sourcePattern = /^[a-z0-9_-]{1,64}$/i;

function isSafeFileUrl(value: string) {
  if (value.startsWith("/downloads/")) {
    return !value.includes("..") && !value.includes("\\");
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export const releaseInputSchema = z.object({
  version: z.string().trim().max(40).regex(versionPattern, "版本号格式无效"),
  channel: z.enum(["stable", "beta"]).default("stable"),
  platform: z
    .string()
    .trim()
    .toLowerCase()
    .regex(platformPattern, "平台标识格式无效")
    .default("win-x64"),
  fileName: z
    .string()
    .trim()
    .min(5)
    .max(160)
    .regex(/^[^/\\]+\.(exe|msi|zip)$/i, "安装文件名无效"),
  fileUrl: z
    .string()
    .trim()
    .max(2000)
    .refine((value) => value === "" || isSafeFileUrl(value), "安装地址无效")
    .optional()
    .default(""),
  fileSize: z.number().int().positive().max(2_147_483_647).nullable().optional(),
  sha256: z
    .string()
    .trim()
    .refine((value) => value === "" || sha256Pattern.test(value), "SHA256 格式无效")
    .optional()
    .default(""),
  releaseNotes: z.string().trim().max(10_000).optional().default(""),
  isPublished: z.boolean().default(false),
});

export const releasePatchSchema = releaseInputSchema.partial();

export const feedbackInputSchema = z.object({
  name: z.string().trim().max(60).optional().default(""),
  email: z
    .string()
    .trim()
    .max(254)
    .refine(
      (value) => value === "" || z.email().safeParse(value).success,
      "邮箱格式无效",
    )
    .optional()
    .default(""),
  category: z
    .enum(["bug", "suggestion", "question", "other"])
    .optional()
    .default("other"),
  message: z.string().trim().min(5, "请至少填写 5 个字符").max(2000),
  website: z.string().max(0).optional().default(""),
});

export const feedbackStatusSchema = z.object({
  status: z.enum(["new", "reviewing", "resolved", "archived"]),
});

export function normalizeReleaseUrl(value?: string) {
  return value ? value : null;
}

export function normalizeSource(value: string | null) {
  return value && sourcePattern.test(value) ? value : "website";
}
