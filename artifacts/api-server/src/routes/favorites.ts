import { Router, type IRouter } from "express";
import { db, favoritesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  AddFavoriteBody,
  DeleteFavoriteParams,
  ListFavoritesQueryParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/favorites", async (req, res): Promise<void> => {
  const query = ListFavoritesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let rows = db
    .select()
    .from(favoritesTable)
    .orderBy(desc(favoritesTable.createdAt));

  if (query.data.toolSlug) {
    rows = db
      .select()
      .from(favoritesTable)
      .where(eq(favoritesTable.toolSlug, query.data.toolSlug))
      .orderBy(desc(favoritesTable.createdAt));
  }

  const results = await rows;
  res.json(
    results.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    }))
  );
});

router.post("/favorites", async (req, res): Promise<void> => {
  const parsed = AddFavoriteBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [entry] = await db
    .insert(favoritesTable)
    .values(parsed.data)
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

  const [deleted] = await db
    .delete(favoritesTable)
    .where(eq(favoritesTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Favorite not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
