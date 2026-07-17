# AI Prompt Studio

A production-ready SaaS platform for generating professional AI image prompts without needing any AI API. Uses a Smart Modular Prompt Templating Engine with 5 specialized tools and a local Quality Score system.

## Run & Operate

- `pnpm --filter @workspace/ai-prompt-studio run dev` — run the frontend (auto-assigned port)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080 internally, /api prefix)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (pre-provisioned by Replit)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite, Wouter, TailwindCSS v4, shadcn/ui, Framer Motion, next-themes
- API: Express 5, OpenAPI 3.1 → Orval codegen (React Query hooks + Zod schemas)
- DB: PostgreSQL + Drizzle ORM (no native PG ENUMs — text columns for all enums)
- Validation: Zod v4, drizzle-zod
- Build: esbuild (CJS bundle for API server)

## Where things live

- `lib/api-spec/openapi.yaml` — Single source of truth for all API contracts
- `lib/api-client-react/src/generated/` — Generated React Query hooks (never hand-edit)
- `lib/api-zod/src/generated/` — Generated Zod schemas for server validation (never hand-edit)
- `lib/db/src/schema/` — Drizzle table definitions (one file per table)
- `artifacts/api-server/src/lib/prompt-engine/` — The modular prompt templating engine
- `artifacts/api-server/src/lib/prompt-engine/tools/` — One file per tool plugin
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/ai-prompt-studio/src/` — React frontend
- `docs/adr/` — Architecture Decision Records

## Architecture decisions

See `docs/adr/` for full ADRs. Key decisions:
- **Prompt Engine**: Fragment-based template assembly (intro, style, composition, lighting, boosters) — no AI API needed; AI API can be added as a service layer without rewriting tools
- **Plugin System**: New tools = new file in `tools/` + one line in `engine.ts` registry; zero other changes
- **Data Strategy**: All history/favorites stored server-side with optional `sessionId` for guest users; Phase 4 auth just adds `userId` column and one-query migration
- **No native PG ENUMs**: All enum-like fields use `text` columns for SQLite + PostgreSQL compatibility
- **OpenAPI-first**: Spec gates codegen → hooks. Never write types by hand.

## Product

5 specialized AI prompt generator tools:
1. **Logo Prompt Generator** — Branding/logo concepts with style modifiers
2. **Product Photo Prompt Generator** — E-commerce and editorial photography
3. **AI Portrait Prompt Generator** — Character and portrait imagery
4. **YouTube Thumbnail Prompt Generator** — CTR-optimized thumbnail concepts
5. **Packaging Design Prompt Generator** — Brand packaging concepts

Each tool supports 4 prompt modes (Minimal / Premium / Creative / Luxury) and multiple style modifiers. Every generated prompt gets a Quality Score (0-100) with strengths, weaknesses, suggestions, and commercial readiness rating.

## Build Phases

- **Phase 1** ✅ Core architecture, homepage, sticky header, mega footer, full landing page, all API routes, DB schema
- **Phase 2** — Prompt Engine UI: first tool (Logo) fully interactive with generation UI, LocalStorage
- **Phase 3** — Remaining 4 tool plugins with full generation UIs
- **Phase 4** — Authentication (Clerk/Google), DB sync for authenticated users
- **Phase 5** ✅ SEO center, analytics, ads integration, performance optimization
- **Phase 6** — Admin dashboard, production deployment

## User preferences

- Admin credentials: username `admin`, password `111111` (for Phase 6 admin dashboard)
- Files must stay under 400 lines each — refactor before adding more
- No TODO placeholders — if a feature can't be completed, explain why
- No native PostgreSQL ENUMs — use text columns with string mappings

## Phase 5 additions

- `GET /robots.txt` — served at root by API server (`artifacts/api-server/src/routes/seo.ts`)
- `GET /api/seo/audit` — live SEO audit JSON (`artifacts/api-server/src/routes/seo.ts`)
- `/analytics` — platform usage dashboard (recharts, fetches `/api/stats` + `/api/analytics/summary`)
- `/seo` — SEO Center dashboard (fetches `/api/seo/audit`)
- `components/ads/AdSlot.tsx` — Google AdSense slot (needs `VITE_ADSENSE_PUBLISHER_ID` env var to go live; shows placeholder in dev when absent)
- `hooks/useWebVitals.ts` — CLS, LCP, FCP, TTFB, INP tracked via PerformanceObserver, forwarded to `/api/analytics/track` as `web_vital` events
- `hooks/useSEO.ts` — extended with `ogImage`, `ogUrl`, `structuredData` (JSON-LD)
- HTTP gzip compression via `compression` middleware on Express
- Cache-Control headers: tools (5 min), stats (1 min), analytics summary (2 min)
- `VITE_ADSENSE_PUBLISHER_ID` — optional env var for Google AdSense publisher ID

## Gotchas

- After every change to `lib/api-spec/openapi.yaml`, run codegen before using new types
- Body schema names in OpenAPI must NOT match `<OperationIdPascal>Body` — use entity-shaped names to avoid TS2308 collision
- DB schema changes: run `pnpm --filter @workspace/db run push` (dev), production is handled by Replit publish flow
- Prompt engine tools use `generateFragments()` — fragments are assembled by the engine, not the tool
- `options` field in DB is JSON-serialized as `text` for SQLite/PG compatibility
