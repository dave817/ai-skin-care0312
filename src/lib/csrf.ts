import { NextRequest } from "next/server";

/**
 * Verifies that the request Origin header matches the configured site URL.
 * Returns true if the origin is allowed, false otherwise.
 *
 * Apply on all state-changing API routes (POST, PATCH, DELETE) for admin endpoints.
 */
export function verifyOrigin(request: NextRequest): boolean {
  if (request.method === "GET" || request.method === "HEAD") return true;

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  /* Allowed origins: NEXT_PUBLIC_SITE_URL + AUTH_URL + Vercel preview domain detection */
  const allowed = new Set<string>();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) allowed.add(new URL(siteUrl).origin);

  const authUrl = process.env.AUTH_URL;
  if (authUrl) allowed.add(new URL(authUrl).origin);

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) allowed.add(`https://${vercelUrl}`);

  /* In dev, allow localhost on any port */
  if (process.env.NODE_ENV !== "production") {
    if (origin?.startsWith("http://localhost:") || origin?.startsWith("http://127.0.0.1:")) {
      return true;
    }
    if (!origin && !referer) return true;
  }

  if (origin && allowed.has(origin)) return true;

  if (referer) {
    try {
      const refOrigin = new URL(referer).origin;
      if (allowed.has(refOrigin)) return true;
    } catch {
      /* invalid URL */
    }
  }

  return false;
}
