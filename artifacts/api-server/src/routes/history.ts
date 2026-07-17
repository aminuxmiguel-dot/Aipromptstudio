import { Router, type IRouter } from "express";
import { db, historyTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  SaveHistoryBody,
  DeleteHistoryParams,
  ListHistoryQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/history", async (req, res): Promise<void> => {
  const query = ListHistoryQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const limit = query.data.limit ?? 50;

  let rows = db
    .select()
    .from(historyTable)
    .orderBy(desc(historyTable.createdAt))
    .limit(limit);

  if (query.data.toolSlug) {
    rows = db
      .select()
      .from(historyTable)
      .where(eq(historyTable.toolSlug, query.data.toolSlug))
      .orderBy(desc(historyTable.createdAt))
      .limit(limit);
  }

  const results = await rows;
  res.json(
    results.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }))
  );
});

router.post("/history", async (req, res): Promise<void> => {
  const parsed = SaveHistoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [entry] = await db.insert(historyTable).values(parsed.data).returning();
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

  const [deleted] = await db
    .delete(historyTable)
    .where(eq(historyTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "History entry not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
