import { Router, type IRouter } from "express";
import { db, historyTable, favoritesTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { getAllTools } from "../lib/prompt-engine/engine";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [historyCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(historyTable);

  const [favoritesCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(favoritesTable);

  // Find the most used tool slug
  const toolCounts = await db
    .select({
      toolSlug: historyTable.toolSlug,
      count: sql<number>`count(*)::int`,
    })
    .from(historyTable)
    .groupBy(historyTable.toolSlug)
    .orderBy(sql`count(*) desc`)
    .limit(1);

  const topToolSlug = toolCounts[0]?.toolSlug ?? null;

  res
    .set("Cache-Control", "public, max-age=60, stale-while-revalidate=30")
    .json({
      totalPromptsGenerated: historyCount?.count ?? 0,
      totalFavorites: favoritesCount?.count ?? 0,
      totalToolsAvailable: getAllTools().length,
      topToolSlug,
    });
});

export default router;
