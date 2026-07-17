import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const analyticsEventsTable = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(), // "page_view" | "tool_generation" | "favorite_saved"
  toolSlug: text("tool_slug"),
  mode: text("mode"),
  sessionId: text("session_id"),
  userId: text("user_id"),
  referrer: text("referrer"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type AnalyticsEvent = typeof analyticsEventsTable.$inferSelect;
