# ADR-003: Data Management Strategy (Guest + Auth Sync)

**Date**: 2026-07-17  
**Status**: Accepted (Phase 1 implementation; Phase 4 adds auth)

## Context

The platform requires prompt history and favorites persistence. Users should be able to use the platform without signing up (guest mode), with the option to sync data to a permanent account later.

## Decision

### Phase 1-3: Server-Persisted Guest Sessions

All history and favorites are stored server-side in PostgreSQL from day one, keyed by an optional `sessionId`. The frontend generates a UUID `sessionId` and stores it in `localStorage`. All API calls include this ID.

This approach:
- Works without authentication
- Eliminates LocalStorage size limits for history
- Makes Phase 4 auth sync trivial (just update `userId` on existing rows)
- Enables cross-device access when users share their session link

### Database Schema

```
prompt_history: id, tool_slug, mode, prompt, negative_prompt, quality_score, options (JSON), session_id, created_at
prompt_favorites: id, tool_slug, mode, prompt, negative_prompt, label, quality_score, session_id, created_at
```

All enum-like fields (`tool_slug`, `mode`) use `text` columns — no PostgreSQL-native ENUMs — ensuring SQLite compatibility for local development.

### Phase 4: Authentication Layer

When Clerk/Google auth is added:
1. Add `user_id` column to both tables (nullable for guests)
2. On login, prompt user to claim their session data: `UPDATE ... SET user_id = $userId WHERE session_id = $sessionId`
3. All queries filter by `user_id` when authenticated, `session_id` when guest

This is a non-breaking migration — no data loss, no rewrite.

## Consequences

- Guest users get persistent history across browser sessions via sessionId
- No localStorage quota concerns
- Phase 4 auth migration is a single-query operation per user
- `options` field is JSON-serialized as `text` for SQLite/PG compatibility
