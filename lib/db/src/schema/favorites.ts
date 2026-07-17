import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const favoritesTable = pgTable("prompt_favorites", {
  id: serial("id").primaryKey(),
  toolSlug: text("tool_slug").notNull(),
  mode: text("mode").notNull(),
  prompt: text("prompt").notNull(),
  negativePrompt: text("negative_prompt"),
  label: text("label"),
  qualityScore: integer("quality_score"),
  sessionId: text("session_id"),
  userId: text("user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFavoriteSchema = createInsertSchema(favoritesTable).omit({
  id: true,
  createdAt: true,
});

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favoritesTable.$inferSelect;
