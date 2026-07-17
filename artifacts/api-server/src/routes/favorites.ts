import { Router, type IRouter } from "express";
import { db, favoritesTable } from "@workspace/db";
import { eq, desc, or, and, isNull } from "drizzle-orm";
import {
  AddFavoriteBody,
  DeleteFavoriteParams,
  ListFavoritesQueryParams,
} from "@workspace/api-zod";
import { getOptionalUserId } from "../lib/auth";

const router: IRouter = Router();

router.get("/favorites", async (req, res): Promise<void> => {
  const query = ListFavoritesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const userId = getOptionalUserId(req);
  const sessionId = req.query.sessionId as string | undefined;

  const ownerFilter = userId
    ? eq(favoritesTable.userId, userId)
    : sessionId
      ? or(
          eq(favoritesTable.sessionId, sessionId),
          and(isNull(favoritesTable.userId), isNull(favoritesTable.sessionId)),
        )
      : isNull(favoritesTable.userId);

  const toolFilter = query.data.toolSlug
    ? eq(favoritesTable.toolSlug, query.data.toolSlug)
    : undefined;

  const where = toolFilter ? and(ownerFilter, toolFilter) : ownerFilter;

  const results = await db
    .select()
    .from(favoritesTable)
    .where(where)
    .orderBy(desc(favoritesTable.createdAt));

  res.json(
    results.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  );
});

router.post("/favorites", async (req, res): Promise<void> => {
  const parsed = AddFavoriteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userId = getOptionalUserId(req);

  const [entry] = await db
    .insert(favoritesTable)
    .values({ ...parsed.data, userId })
    .returning();

  res.status(201).json({
    ...entry,
    createdAt: entry.createdAt.toISOString(),
  });
});

router.delete("/favorites/:id", async (req, res): Promise<void> => {
  const params = DeleteFavoriteParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const userId = getOptionalUserId(req);
  const sessionId = req.query.sessionId as string | undefined;

  const ownerFilter = userId
    ? eq(favoritesTable.userId, userId)
    : sessionId
      ? eq(favoritesTable.sessionId, sessionId)
      : isNull(favoritesTable.sessionId);

  const [deleted] = await db
    .delete(favoritesTable)
    .where(and(eq(favoritesTable.id, params.data.id), ownerFilter))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Favorite not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
