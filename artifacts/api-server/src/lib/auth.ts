import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";

/**
 * Extracts the Clerk userId from the request if present.
 * Does NOT block unauthenticated requests — use requireAuth for that.
 */
export function getOptionalUserId(req: Request): string | null {
  try {
    const auth = getAuth(req);
    return auth?.userId ?? null;
  } catch {
    return null;
  }
}

/**
 * Middleware that requires a valid Clerk session.
 * Returns 401 if the user is not authenticated.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const userId = getOptionalUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  // Attach to request for downstream handlers
  (req as any).userId = userId;
  next();
}
