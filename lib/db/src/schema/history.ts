import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const historyTable = pgTable("prompt_history", {
  id: serial("id").primaryKey(),
  toolSlug: text("tool_slug").notNull(),
  mode: text("mode").notNull(),
  prompt: text("prompt").notNull(),
  negativePrompt: text("negative_prompt"),
  qualityScore: integer("quality_score"),
  options: text("options"), // JSON-serialized
  sessionId: text("session_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertHistorySchema = createInsertSchema(historyTable).omit({
  id: true,
  createdAt: true,
});

export type InsertHistory = z.infer<typeof insertHistorySchema>;
export type History = typeof historyTable.$inferSelect;
