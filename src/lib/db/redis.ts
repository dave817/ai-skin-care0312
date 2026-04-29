import { Redis } from "@upstash/redis";

let cachedRedis: Redis | null = null;

/**
 * Trim env vars defensively. Vercel's env var UI sometimes inserts
 * line-wrapping whitespace into long tokens, which makes Upstash reject
 * them as invalid HTTP header values.
 */
function cleanEnv(name: string): string | undefined {
  const v = process.env[name];
  if (!v) return undefined;
  const cleaned = v.replace(/\s+/g, "");
  return cleaned.length > 0 ? cleaned : undefined;
}

export function getRedis(): Redis | null {
  if (cachedRedis) return cachedRedis;
  const url = cleanEnv("UPSTASH_REDIS_REST_URL");
  const token = cleanEnv("UPSTASH_REDIS_REST_TOKEN");
  if (!url || !token) return null;
  try {
    cachedRedis = new Redis({ url, token });
    return cachedRedis;
  } catch (err) {
    console.warn("[Redis] init failed, falling back to seed data:", err);
    return null;
  }
}

export function isRedisConfigured(): boolean {
  return !!(cleanEnv("UPSTASH_REDIS_REST_URL") && cleanEnv("UPSTASH_REDIS_REST_TOKEN"));
}
