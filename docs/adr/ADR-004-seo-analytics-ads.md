# ADR-004: SEO Center, Analytics, and Ads Center (Phase 5)

## Status
Accepted

## Context
Phase 5 introduces three major platform concerns that are decoupled from the core prompt-generation product:

1. **SEO Center** — The platform relies on organic search for user acquisition. We need structured data, a sitemap, robots.txt, canonical URLs, and enhanced Open Graph / Twitter Card meta tags beyond what Phase 1 provided.
2. **Analytics** — We need first-party insight into platform usage (page views, tool popularity, generation trends) without sending data to a third-party service by default.
3. **Ads Center** — Monetisation via display advertising (Google AdSense) requires isolated, non-blocking ad slot components that degrade gracefully when no publisher ID is configured.
4. **Performance** — Core Web Vitals (CLS, LCP, FID/INP) must be measured and tracked. API responses benefit from HTTP response compression (gzip/deflate). Static and quasi-static API routes should carry `Cache-Control` headers.

## Decisions

### SEO
- `robots.txt` is served by the API server at root (`GET /robots.txt`), keeping the single-origin architecture intact and ensuring the file is always generated from live environment state (e.g. canonical domain from `REPLIT_DEV_DOMAIN`).
- Sitemap already existed; this phase extends it to use `SITE_URL` env var with a graceful fallback.
- `useSEO` hook is extended with `ogImage` and `ogUrl` support; JSON-LD structured data is emitted per-page.
- A **SEO Center page** (`/seo`) is added as a read-only audit dashboard — it shows the live robots.txt, sitemap link, structured data examples, and a meta-tag checklist.

### Analytics
- The existing `/api/analytics/summary` and `/api/stats` server endpoints (Phase 4) are surfaced in a new **Analytics Dashboard page** (`/analytics`).
- Charts use Recharts (already a workspace dependency) — no new charting library is introduced.
- A `useWebVitals` hook collects CLS, LCP, FCP, TTFB, and INP via the browser `PerformanceObserver` API and forwards them to `/api/analytics/track` so they appear in the existing events table.
- The Analytics page is public (no auth required) to allow transparent platform health visibility.

### Ads Center
- An `AdSlot` component wraps the Google AdSense `<ins>` element and lazy-loads the AdSense script.
- The publisher ID is read from `VITE_ADSENSE_PUBLISHER_ID` env var. When absent, the component renders a styled placeholder (development) or nothing (production).
- Ad slots are placed non-intrusively: one leaderboard below the hero on the homepage, one rectangle in the ToolPage sidebar (below the form).
- The `AdSlot` component is fully isolated in `components/ads/` so it can be removed or swapped without touching layout components.

### Performance
- `compression` middleware (gzip) is added to the Express server, reducing API response size by 60–80 % for JSON payloads.
- `Cache-Control: public, max-age=300, stale-while-revalidate=60` is added to `/api/stats` and `/api/tools` responses (quasi-static data).
- Resource hints (`<link rel="preconnect">`, `<link rel="dns-prefetch">`) are added to `index.html` for Google Fonts and the API origin.
- The Outfit font (already imported via CSS) is added as a `<link rel="preload">` for the most common weight (400+600).

## Consequences
- No breaking changes to existing API contracts.
- AdSense requires an active publisher account; without one, no ads appear and the site still functions fully.
- Web vitals data enriches the analytics table with performance event rows (eventType = `web_vital`).
- The `/seo` and `/analytics` pages are publicly accessible, which is intentional — they display aggregate platform data only, never user-specific data.
