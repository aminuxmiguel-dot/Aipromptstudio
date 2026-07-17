import { Router, type IRouter } from "express";
import { db, analyticsEventsTable, historyTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { getOptionalUserId } from "../lib/auth";

const router: IRouter = Router();

const VALID_EVENT_TYPES = [
  "page_view",
  "tool_generation",
  "favorite_saved",
  "web_vital",
] as const;

router.post("/analytics/track", async (req, res): Promise<void> => {
  const { eventType, toolSlug, mode, sessionId, referrer } = req.body ?? {};

  if (!eventType || !VALID_EVENT_TYPES.includes(eventType)) {
    res.status(400).json({ error: "Invalid eventType" });
    return;
  }

  const userId = getOptionalUserId(req);

  await db.insert(analyticsEventsTable).values({
    eventType,
    toolSlug: toolSlug ?? null,
    mode: mode ?? null,
    sessionId: sessionId ?? null,
    userId,
    referrer: referrer ?? null,
  });

  res.sendStatus(204);
});

router.get("/analytics/summary", async (_req, res): Promise<void> => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [pageViews] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(analyticsEventsTable)
    .where(sql`event_type = 'page_view' AND created_at >= ${thirtyDaysAgo.toISOString()}`);

  const [generations] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(analyticsEventsTable)
    .where(sql`event_type = 'tool_generation' AND created_at >= ${thirtyDaysAgo.toISOString()}`);

  const topTools = await db
    .select({
      toolSlug: historyTable.toolSlug,
      count: sql<number>`count(*)::int`,
    })
    .from(historyTable)
    .groupBy(historyTable.toolSlug)
    .orderBy(sql`count(*) desc`)
    .limit(5);

  const trend = await db
    .select({
      date: sql<string>`date_trunc('day', created_at)::date::text`,
      count: sql<number>`count(*)::int`,
    })
    .from(analyticsEventsTable)
    .where(sql`event_type = 'tool_generation' AND created_at >= ${sevenDaysAgo.toISOString()}`)
    .groupBy(sql`date_trunc('day', created_at)`)
    .orderBy(sql`date_trunc('day', created_at)`);

  res
    .set("Cache-Control", "public, max-age=120, stale-while-revalidate=60")
    .json({
      pageViews30d: pageViews?.count ?? 0,
      generations30d: generations?.count ?? 0,
      topTools,
      dailyTrend: trend,
    });
});

export default router;
