import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { listBlogs, upsertBlog, seedBlogsToRedis } from "@/lib/db/blogs-repo";
import { blogSchema } from "@/lib/validations/blog";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/admin-auth";
import { verifyOrigin } from "@/lib/csrf";
import { sanitizeBlogContent } from "@/lib/sanitize";

export const runtime = "nodejs";

async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!(await verifyAuthToken(token))) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }
  if (!verifyOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin (CSRF check)" }, { status: 403 });
  }
  return null;
}

function revalidateBlogs() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidateTag("blogs");
}

export async function GET(request: NextRequest) {
  const denied = await requireAuth(request);
  if (denied) return denied;
  try {
    const blogs = await listBlogs();
    return NextResponse.json({ success: true, data: blogs });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireAuth(request);
  if (denied) return denied;
  try {
    const body = await request.json();
    if (body?.action === "seed") {
      const result = await seedBlogsToRedis();
      revalidateBlogs();
      return NextResponse.json({ success: true, ...result });
    }
    const parsed = blogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "輸入資料不正確", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const sanitized = {
      ...parsed.data,
      content: sanitizeBlogContent(parsed.data.content),
    };
    const saved = await upsertBlog(sanitized);
    revalidateBlogs();
    return NextResponse.json({ success: true, data: saved });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
