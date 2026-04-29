import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const SKIN_ANALYSIS_DAILY_QUOTA = 5;

/* Generic rate limiters for protecting other public endpoints */
let chatLimiter: Ratelimit | null = null;
let translateLimiter: Ratelimit | null = null;
let loginLimiter: Ratelimit | null = null;

function makeLimiter(
  prefix: string,
  count: number,
  window: "10 s" | "1 m" | "15 m" | "1 h"
): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(count, window),
    analytics: true,
    prefix,
  });
}

function getChatLimiter(): Ratelimit | null {
  if (!chatLimiter) chatLimiter = makeLimiter("dgb:chat", 30, "1 m");
  return chatLimiter;
}

function getTranslateLimiter(): Ratelimit | null {
  if (!translateLimiter) translateLimiter = makeLimiter("dgb:translate", 10, "1 h");
  return translateLimiter;
}

function getLoginLimiter(): Ratelimit | null {
  if (!loginLimiter) loginLimiter = makeLimiter("dgb:login", 5, "15 m");
  return loginLimiter;
}

export async function checkChatLimit(
  ip: string
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const rl = getChatLimiter();
  if (!rl) return { success: true, remaining: 30, reset: Date.now() + 60_000 };
  const result = await rl.limit(ip);
  return { success: result.success, remaining: result.remaining, reset: result.reset };
}

export async function checkTranslateLimit(
  ip: string
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const rl = getTranslateLimiter();
  if (!rl) return { success: true, remaining: 10, reset: Date.now() + 3600_000 };
  const result = await rl.limit(ip);
  return { success: result.success, remaining: result.remaining, reset: result.reset };
}

export async function checkLoginLimit(
  ip: string
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const rl = getLoginLimiter();
  if (!rl) return { success: true, remaining: 5, reset: Date.now() + 900_000 };
  const result = await rl.limit(ip);
  return { success: result.success, remaining: result.remaining, reset: result.reset };
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
  bypassed?: boolean;
}

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const redis = new Redis({ url, token });
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(SKIN_ANALYSIS_DAILY_QUOTA, "1 d"),
    analytics: true,
    prefix: "dgb:skin",
  });
  return ratelimit;
}

function safeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function checkSkinAnalysisLimit(
  deviceId: string,
  ip: string,
  bypassToken?: string | null
): Promise<RateLimitResult> {
  const expectedBypass = process.env.ADMIN_BYPASS_TOKEN;
  if (
    bypassToken &&
    bypassToken.length > 0 &&
    expectedBypass &&
    expectedBypass.length >= 16 &&
    safeStringEqual(bypassToken, expectedBypass)
  ) {
    return {
      success: true,
      remaining: SKIN_ANALYSIS_DAILY_QUOTA,
      reset: Date.now() + 86_400_000,
      limit: SKIN_ANALYSIS_DAILY_QUOTA,
      bypassed: true,
    };
  }

  const rl = getRatelimit();
  if (!rl) {
    return {
      success: true,
      remaining: SKIN_ANALYSIS_DAILY_QUOTA,
      reset: Date.now() + 86_400_000,
      limit: SKIN_ANALYSIS_DAILY_QUOTA,
    };
  }

  const safeDeviceId = (deviceId ?? "anon").slice(0, 64).replace(/[^a-zA-Z0-9-]/g, "");
  const key = `${safeDeviceId}:${ip}`;

  const { success, remaining, reset, limit } = await rl.limit(key);
  return { success, remaining, reset, limit };
}

export const SKIN_QUOTA = SKIN_ANALYSIS_DAILY_QUOTA;
