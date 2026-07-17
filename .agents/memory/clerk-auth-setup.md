---
name: Clerk Auth Setup
description: Clerk is provisioned (Replit-managed) for AI Prompt Studio. Key decisions and gotchas for this project.
---

# Clerk Auth — AI Prompt Studio

## Status
Replit-managed Clerk, provisioned 2026-07-17. Secrets auto-set: CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY, VITE_CLERK_PUBLISHABLE_KEY.

## Key decisions
- `publishableKeyFromHost` imported from `@clerk/react/internal` (NOT `@clerk/shared`)
- `proxyUrl={clerkProxyUrl}` is unconditional — never gate on NODE_ENV
- Routes are exactly `path="/sign-in/*?"` and `path="/sign-up/*?"` — no variations
- `tailwindcss({ optimize: false })` in vite.config.ts required for prod build correctness with @clerk/themes
- `@layer theme, base, clerk, components, utilities;` must come BEFORE `@import 'tailwindcss'` in index.css
- Never use `<UserButton />` — custom avatar/signout built in Header.tsx

**Why:** Replit-managed Clerk has a proxy setup that differs from standard Clerk. Failing to follow the exact wiring causes 404s on OAuth callbacks and broken prod builds.

## DB auth columns
- `userId text` added to `prompt_history` and `prompt_favorites` tables (nullable for guests)
- Ownership filtering: authenticated users filter by userId; guests filter by sessionId
- Migration path: on login, data stays; server associates future writes with userId

## Files changed
- `artifacts/api-server/src/app.ts` — Clerk middleware added (before body parsers)
- `artifacts/api-server/src/middlewares/clerkProxyMiddleware.ts` — copied from template
- `artifacts/api-server/src/lib/auth.ts` — getOptionalUserId, requireAuth helpers
- `artifacts/api-server/src/routes/history.ts` — userId-aware ownership filtering
- `artifacts/api-server/src/routes/favorites.ts` — userId-aware ownership filtering
- `artifacts/ai-prompt-studio/src/App.tsx` — ClerkProvider wired
- `artifacts/ai-prompt-studio/src/components/layout/Header.tsx` — auth-aware header
- `artifacts/ai-prompt-studio/public/logo.svg` — branded SVG for Clerk sign-in page
