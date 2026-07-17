/**
 * Vercel Serverless Function — Express API adapter
 *
 * Vercel invokes this handler for every /api/* request.
 * Do NOT call app.listen() here — Vercel handles the HTTP lifecycle.
 *
 * Required Vercel environment variables (set in Vercel dashboard):
 *   DATABASE_URL          — PostgreSQL connection string
 *   CLERK_SECRET_KEY      — Clerk backend secret (auth, optional)
 *   CLERK_PUBLISHABLE_KEY — Clerk frontend key (optional)
 *   SESSION_SECRET        — Express session secret
 */
import app from "../artifacts/api-server/src/app";

export default app;
