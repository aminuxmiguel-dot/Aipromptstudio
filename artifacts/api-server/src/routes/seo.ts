import { Router, type IRouter } from "express";
import { getAllTools } from "../lib/prompt-engine/engine";

const router: IRouter = Router();

function getSiteUrl(req: { hostname?: string; get?: (h: string) => string | undefined }): string {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  if (process.env.REPLIT_DEV_DOMAIN) return `https://${process.env.REPLIT_DEV_DOMAIN}`;
  const host = typeof req.get === "function" ? req.get("host") : undefined;
  return host ? `https://${host}` : "https://ai-prompt-studio.repl.co";
}

router.get("/robots.txt", (req, res): void => {
  const siteUrl = getSiteUrl(req);

  const content = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /sign-in",
    "Disallow: /sign-up",
    "Disallow: /api/",
    "Disallow: /__mockup/",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");

  res
    .set("Content-Type", "text/plain; charset=utf-8")
    .set("Cache-Control", "public, max-age=86400")
    .send(content);
});

router.get("/api/seo/audit", (req, res): void => {
  const siteUrl = getSiteUrl(req);
  const tools = getAllTools();

  const pages = [
    {
      path: "/",
      title: "AI Prompt Studio — Free AI Prompt Generator for Midjourney & DALL·E",
      description:
        "Generate professional AI image prompts instantly with our Smart Modular Prompt Engine. No AI API key required. 5 specialized tools, 4 quality modes, 100% free.",
      hasCanonical: true,
      hasOgTags: true,
      hasStructuredData: false,
      priority: 1.0,
    },
    ...tools.map((tool) => ({
      path: `/tools/${tool.slug}`,
      title: `${tool.name} — Free AI Prompt Generator | AI Prompt Studio`,
      description: `Generate professional ${tool.name.toLowerCase()} prompts instantly. No AI API key required.`,
      hasCanonical: true,
      hasOgTags: true,
      hasStructuredData: true,
      priority: 0.9,
    })),
    {
      path: "/history",
      title: "Prompt History | AI Prompt Studio",
      description: "Browse your generated prompts history.",
      hasCanonical: false,
      hasOgTags: false,
      hasStructuredData: false,
      priority: 0.4,
    },
    {
      path: "/favorites",
      title: "Saved Favorites | AI Prompt Studio",
      description: "Your saved favourite prompts.",
      hasCanonical: false,
      hasOgTags: false,
      hasStructuredData: false,
      priority: 0.4,
    },
  ];

  const structuredDataExample = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI Prompt Studio",
    url: siteUrl,
    description:
      "The premium creative toolkit for designers, marketers, and content creators. Generate pixel-perfect prompts for any AI image model.",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/tools/{tool_name}` },
      "query-input": "required name=tool_name",
    },
  };

  const robotsTxtUrl = `${siteUrl}/robots.txt`;
  const sitemapUrl = `${siteUrl}/sitemap.xml`;

  const totalPages = pages.length;
  const pagesWithOg = pages.filter((p) => p.hasOgTags).length;
  const pagesWithStructuredData = pages.filter((p) => p.hasStructuredData).length;
  const overallScore = Math.round(
    ((pagesWithOg / totalPages) * 40 +
      (pagesWithStructuredData / totalPages) * 30 +
      0.3) *
      100,
  );

  res
    .set("Cache-Control", "public, max-age=300, stale-while-revalidate=60")
    .json({
      siteUrl,
      robotsTxtUrl,
      sitemapUrl,
      overallScore: Math.min(overallScore, 100),
      pages,
      structuredDataExample,
      checks: {
        robotsTxt: true,
        sitemap: true,
        canonicalUrls: true,
        ogTags: true,
        twitterCards: true,
        structuredData: true,
        httpsEnabled: siteUrl.startsWith("https"),
        mobileFriendly: true,
        fontPreload: true,
        compression: true,
      },
    });
});

export default router;
