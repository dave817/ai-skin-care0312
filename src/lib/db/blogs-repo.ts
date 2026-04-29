import { getRedis } from "./redis";
import { blogPosts as seedBlogs, type BlogPost } from "@/data/blogs";

const BLOG_KEY_PREFIX = "dgb:blog:";
const BLOG_INDEX_KEY = "dgb:blogs:index";

export interface BlogWithMeta extends BlogPost {
  createdAt: number;
  updatedAt: number;
}

function withMeta(b: BlogPost, now: number = Date.now()): BlogWithMeta {
  return { ...b, createdAt: now, updatedAt: now };
}

function keyOf(id: string): string {
  return `${BLOG_KEY_PREFIX}${id}`;
}

export async function listBlogs(): Promise<BlogWithMeta[]> {
  const redis = getRedis();
  if (!redis) {
    return seedBlogs.map((b) => withMeta(b, 0));
  }
  const ids = await redis.smembers<string[]>(BLOG_INDEX_KEY);
  if (!ids || ids.length === 0) {
    return seedBlogs.map((b) => withMeta(b, 0));
  }
  const pipe = redis.pipeline();
  for (const id of ids) pipe.get(keyOf(id));
  const rows = await pipe.exec<(BlogWithMeta | null)[]>();
  const valid = rows.filter((r): r is BlogWithMeta => r !== null);
  return valid.sort((a, b) => (b.date > a.date ? 1 : -1));
}

export async function getBlog(id: string): Promise<BlogWithMeta | null> {
  const redis = getRedis();
  if (!redis) {
    const found = seedBlogs.find((b) => b.id === id);
    return found ? withMeta(found, 0) : null;
  }
  const blog = await redis.get<BlogWithMeta>(keyOf(id));
  if (blog) return blog;
  const seed = seedBlogs.find((b) => b.id === id);
  return seed ? withMeta(seed, 0) : null;
}

export async function getBlogBySlug(slug: string): Promise<BlogWithMeta | null> {
  const all = await listBlogs();
  return all.find((b) => b.slug === slug) ?? null;
}

export async function upsertBlog(blog: BlogPost): Promise<BlogWithMeta> {
  const redis = getRedis();
  if (!redis) throw new Error("Upstash Redis 未設定");
  const existing = await redis.get<BlogWithMeta>(keyOf(blog.id));
  const now = Date.now();
  const saved: BlogWithMeta = {
    ...blog,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  const pipe = redis.pipeline();
  pipe.set(keyOf(blog.id), saved);
  pipe.sadd(BLOG_INDEX_KEY, blog.id);
  await pipe.exec();
  return saved;
}

export async function deleteBlog(id: string): Promise<void> {
  const redis = getRedis();
  if (!redis) throw new Error("Upstash Redis 未設定");
  const pipe = redis.pipeline();
  pipe.del(keyOf(id));
  pipe.srem(BLOG_INDEX_KEY, id);
  await pipe.exec();
}

export async function seedBlogsToRedis(): Promise<{ inserted: number; skipped: number }> {
  const redis = getRedis();
  if (!redis) throw new Error("Upstash Redis 未設定");
  const existing = await redis.smembers<string[]>(BLOG_INDEX_KEY);
  const existingSet = new Set(existing ?? []);
  let inserted = 0;
  let skipped = 0;
  const pipe = redis.pipeline();
  const now = Date.now();
  for (const b of seedBlogs) {
    if (existingSet.has(b.id)) {
      skipped++;
      continue;
    }
    pipe.set(keyOf(b.id), { ...b, createdAt: now, updatedAt: now });
    pipe.sadd(BLOG_INDEX_KEY, b.id);
    inserted++;
  }
  if (inserted > 0) await pipe.exec();
  return { inserted, skipped };
}
