import { Router, type IRouter } from "express";
import { db, historyTable } from "@workspace/db";
import { eq, desc, or, and, isNull } from "drizzle-orm";
import {
  SaveHistoryBody,
  DeleteHistoryParams,
  ListHistoryQueryParams,
} from "@workspace/api-zod";
import { getOptionalUserId } from "../lib/auth";

const router: IRouter = Router();

router.get("/history", async (req, res): Promise<void> => {
  const query = ListHistoryQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const limit = query.data.limit ?? 50;
  const userId = getOptionalUserId(req);
  const sessionId = req.query.sessionId as string | undefined;

  // Ownership filter: rows matching userId OR (no userId + matching sessionId)
  const ownerFilter = userId
    ? eq(historyTable.userId, userId)
    : sessionId
      ? or(
          eq(historyTable.sessionId, sessionId),
          and(isNull(historyTable.userId), isNull(historyTable.sessionId)),
        )
      : isNull(historyTable.userId);

  const toolFilter = query.data.toolSlug
    ? eq(historyTable.toolSlug, query.data.toolSlug)
    : undefined;

  const where = toolFilter ? and(ownerFilter, toolFilter) : ownerFilter;

  const results = await db
    .select()
    .from(historyTable)
    .where(where)
    .orderBy(desc(historyTable.createdAt))
    .limit(limit);

  res.json(
    results.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  );
});

router.post("/history", async (req, res): Promise<void> => {
  const parsed = SaveHistoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userId = getOptionalUserId(req);

  const [entry] = await db
    .insert(historyTable)
    .values({ ...parsed.data, userId })
    .returning();

  res.status(201).json({
    ...entry,
    createdAt: entry.createdAt.toISOString(),
  });
});

router.delete("/history/:id", async (req, res): Promise<void> => {
  const params = DeleteHistoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const userId = getOptionalUserId(req);
  const sessionId = req.query.sessionId as string | undefined;

  // Only delete rows the caller owns
  const ownerFilter = userId
    ? eq(historyTable.userId, userId)
    : sessionId
      ? eq(historyTable.sessionId, sessionId)
      : isNull(historyTable.sessionId);

  const [deleted] = await db
    .delete(historyTable)
    .where(and(eq(historyTable.id, params.data.id), ownerFilter))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "History entry not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
