import { getRedis } from "./redis";
import { allProducts as seedProducts, type Product } from "@/data/products";

const PRODUCT_KEY_PREFIX = "dgb:product:";
const PRODUCT_INDEX_KEY = "dgb:products:index";

export interface ProductWithMeta extends Product {
  createdAt: number;
  updatedAt: number;
}

function withMeta(p: Product, now: number = Date.now()): ProductWithMeta {
  return { ...p, createdAt: now, updatedAt: now };
}

function keyOf(id: string): string {
  return `${PRODUCT_KEY_PREFIX}${id}`;
}

function seedFallback(): ProductWithMeta[] {
  return seedProducts.map((p) => withMeta(p, 0));
}

export async function listProducts(): Promise<ProductWithMeta[]> {
  const redis = getRedis();
  if (!redis) return seedFallback();
  try {
    const ids = await redis.smembers<string[]>(PRODUCT_INDEX_KEY);
    if (!ids || ids.length === 0) return seedFallback();
    const pipe = redis.pipeline();
    for (const id of ids) pipe.get(keyOf(id));
    const rows = await pipe.exec<(ProductWithMeta | null)[]>();
    return rows.filter((r): r is ProductWithMeta => r !== null);
  } catch (err) {
    console.warn("[products-repo] Redis read failed, using seed:", err);
    return seedFallback();
  }
}

export async function getProduct(id: string): Promise<ProductWithMeta | null> {
  const redis = getRedis();
  const seedHit = () => {
    const seed = seedProducts.find((p) => p.id === id);
    return seed ? withMeta(seed, 0) : null;
  };
  if (!redis) return seedHit();
  try {
    const product = await redis.get<ProductWithMeta>(keyOf(id));
    if (product) return product;
    return seedHit();
  } catch (err) {
    console.warn("[products-repo] Redis get failed, using seed:", err);
    return seedHit();
  }
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithMeta | null> {
  const all = await listProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function upsertProduct(
  product: Product
): Promise<ProductWithMeta> {
  const redis = getRedis();
  if (!redis) {
    throw new Error(
      "Upstash Redis 未設定 — 請喺 .env.local 加 UPSTASH_REDIS_REST_URL 同 UPSTASH_REDIS_REST_TOKEN"
    );
  }
  const existing = await redis.get<ProductWithMeta>(keyOf(product.id));
  const now = Date.now();
  const saved: ProductWithMeta = {
    ...product,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  const pipe = redis.pipeline();
  pipe.set(keyOf(product.id), saved);
  pipe.sadd(PRODUCT_INDEX_KEY, product.id);
  await pipe.exec();
  return saved;
}

export async function deleteProduct(id: string): Promise<void> {
  const redis = getRedis();
  if (!redis) {
    throw new Error("Upstash Redis 未設定");
  }
  const pipe = redis.pipeline();
  pipe.del(keyOf(id));
  pipe.srem(PRODUCT_INDEX_KEY, id);
  await pipe.exec();
}

/**
 * One-time seed: copy /src/data/products.ts into Redis.
 * Call from a setup endpoint / admin button.
 */
export async function seedProductsToRedis(): Promise<{ inserted: number; skipped: number }> {
  const redis = getRedis();
  if (!redis) throw new Error("Upstash Redis 未設定");
  const existing = await redis.smembers<string[]>(PRODUCT_INDEX_KEY);
  const existingSet = new Set(existing ?? []);
  let inserted = 0;
  let skipped = 0;
  const pipe = redis.pipeline();
  const now = Date.now();
  for (const p of seedProducts) {
    if (existingSet.has(p.id)) {
      skipped++;
      continue;
    }
    pipe.set(keyOf(p.id), { ...p, createdAt: now, updatedAt: now });
    pipe.sadd(PRODUCT_INDEX_KEY, p.id);
    inserted++;
  }
  if (inserted > 0) await pipe.exec();
  return { inserted, skipped };
}
