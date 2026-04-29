/**
 * Edge-runtime-compatible admin auth using Web Crypto API.
 * Signs a short JWT-like token with HMAC-SHA256.
 */

const COOKIE_NAME = "dgb-admin-auth";
const AUTH_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

interface TokenPayload {
  exp: number;
}

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "AUTH_SECRET is required in production. Run: openssl rand -base64 32 → set in env."
      );
    }
    return "dev-only-fallback-not-for-prod-32-chars-min";
  }
  if (secret.length < 16) {
    throw new Error("AUTH_SECRET must be at least 16 characters.");
  }
  return secret;
}

function toBase64Url(input: ArrayBuffer | string): string {
  const buf =
    typeof input === "string"
      ? new TextEncoder().encode(input).buffer
      : input;
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(input: string): Uint8Array {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const bin = atob(padded + padding);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(payload: TokenPayload): Promise<string> {
  const data = toBase64Url(JSON.stringify(payload));
  const key = await getKey();
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  return `${data}.${toBase64Url(sig)}`;
}

async function verify(token: string): Promise<TokenPayload | null> {
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;
    const key = await getKey();
    const sigBytes = fromBase64Url(sig);
    const sigBuffer = new ArrayBuffer(sigBytes.byteLength);
    new Uint8Array(sigBuffer).set(sigBytes);
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBuffer,
      new TextEncoder().encode(data)
    );
    if (!ok) return null;
    const json = new TextDecoder().decode(fromBase64Url(data));
    const payload = JSON.parse(json);
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createAuthToken(): Promise<string> {
  return sign({ exp: Date.now() + AUTH_LIFETIME_MS });
}

export async function verifyAuthToken(
  token: string | null | undefined
): Promise<boolean> {
  if (!token) return false;
  const payload = await verify(token);
  return payload !== null;
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
export const AUTH_COOKIE_MAX_AGE = Math.floor(AUTH_LIFETIME_MS / 1000);
