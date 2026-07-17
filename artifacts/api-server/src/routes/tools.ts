import { Router, type IRouter } from "express";
import { getAllTools, getToolBySlug } from "../lib/prompt-engine/engine";
import { GetToolParams } from "@workspace/api-zod";

const router: IRouter = Router();

const TOOLS_CACHE = "public, max-age=300, stale-while-revalidate=60";

router.get("/tools", (_req, res): void => {
  const tools = getAllTools().map((tool) => ({
    slug: tool.slug,
    name: tool.name,
    description: tool.description,
    category: tool.category,
    icon: tool.icon,
    modifiers: tool.modifiers,
    modes: tool.modes,
    seoContent: tool.seoContent,
  }));
  res.set("Cache-Control", TOOLS_CACHE).json(tools);
});

router.get("/tools/:slug", (req, res): void => {
  const params = GetToolParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const tool = getToolBySlug(params.data.slug);
  if (!tool) {
    res.status(404).json({ error: "Tool not found" });
    return;
  }

  res.set("Cache-Control", TOOLS_CACHE).json({
    slug: tool.slug,
    name: tool.name,
    description: tool.description,
    category: tool.category,
    icon: tool.icon,
    modifiers: tool.modifiers,
    modes: tool.modes,
    seoContent: tool.seoContent,
  });
});

export default router;
