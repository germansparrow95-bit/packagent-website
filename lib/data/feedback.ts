import "server-only";

import { desc, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "@/db/client";
import { feedback } from "@/db/schema";
import type { z } from "zod";
import { feedbackInputSchema, feedbackStatusSchema } from "@/lib/validation";

type FeedbackInput = z.infer<typeof feedbackInputSchema>;
type FeedbackStatus = z.infer<typeof feedbackStatusSchema>["status"];

export async function createFeedback(input: FeedbackInput) {
  const now = new Date().toISOString();
  const [row] = await db
    .insert(feedback)
    .values({
      id: randomUUID(),
      name: input.name,
      email: input.email,
      category: input.category,
      message: input.message,
      status: "new",
      createdAt: now,
      updatedAt: now,
    })
    .returning({ id: feedback.id, status: feedback.status });

  return row;
}

export async function listFeedback(limit = 100) {
  return db
    .select()
    .from(feedback)
    .orderBy(desc(feedback.createdAt))
    .limit(Math.min(Math.max(limit, 1), 200));
}

export async function updateFeedbackStatus(id: string, status: FeedbackStatus) {
  const [row] = await db
    .update(feedback)
    .set({ status, updatedAt: new Date().toISOString() })
    .where(eq(feedback.id, id))
    .returning();

  return row ?? null;
}

export async function deleteFeedback(id: string) {
  const [row] = await db
    .delete(feedback)
    .where(eq(feedback.id, id))
    .returning({ id: feedback.id });
  return row ?? null;
}
