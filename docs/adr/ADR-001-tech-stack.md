# ADR-001: Technology Stack Selection

**Date**: 2026-07-17  
**Status**: Accepted

## Context

We needed to establish the core technology stack for AI Prompt Studio, a production-ready SaaS platform for AI prompt generation. The stack must support a rich, interactive UI, server-side data persistence, and a modular plugin architecture for prompt tools.

## Decision

We adapted the specified Next.js 15 stack to the Replit pnpm monorepo environment, using:

| Layer | Chosen | Reason |
|---|---|---|
| Frontend | React 19 + Vite | Replit monorepo standard; equivalent DX to Next.js App Router for SPA |
| Routing | Wouter | Lightweight, tree-shakeable; sufficient for client-side routing |
| Styling | TailwindCSS v4 + shadcn/ui | Zero-runtime CSS, full design-token system, accessible components |
| Animation | Framer Motion | Best-in-class React animation library |
| Data Fetching | TanStack React Query | Industry standard; pairs with Orval codegen |
| API Contract | OpenAPI 3.1 → Orval codegen | Single source of truth, generates typed hooks and Zod schemas |
| Backend | Express 5 + Node 24 | Replit monorepo standard API server |
| ORM | Drizzle ORM + PostgreSQL | Type-safe, migration-friendly, SQLite-compatible schema patterns |
| Validation | Zod v4 | Runtime type safety on both client and server |
| Forms | React Hook Form + Zod | Performant forms with schema validation |
| Theme | next-themes | Dark/light mode with no flash of unstyled content |

## Consequences

- Frontend and backend share a single TypeScript monorepo with strict project references
- OpenAPI spec is the authoritative contract; all types are derived, never hand-written
- Drizzle schema uses `text` columns for enum-like fields (SQLite + PostgreSQL compatible)
- Adding AI API support later requires only a new service layer in `src/lib/ai/` — no route changes needed
