import { Router, type IRouter } from "express";
import { getAllTools } from "../lib/prompt-engine/engine";

const router: IRouter = Router();

router.get("/sitemap.xml", (_req, res): void => {
  const baseUrl = process.env.REPLIT_DEV_DOMAIN
    ? `https://${process.env.REPLIT_DEV_DOMAIN}`
    : "https://ai-prompt-studio.repl.co";

  const tools = getAllTools();
  const now = new Date().toISOString().split("T")[0];

  const staticPages = [
    { url: "/", priority: "1.0", changefreq: "weekly" },
    { url: "/history", priority: "0.4", changefreq: "never" },
    { url: "/favorites", priority: "0.4", changefreq: "never" },
  ];

  const toolPages = tools.map((tool) => ({
    url: `/tools/${tool.slug}`,
    priority: "0.9",
    changefreq: "monthly",
  }));

  const allPages = [...staticPages, ...toolPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  res.set("Content-Type", "application/xml");
  res.send(xml);
});

export default router;
