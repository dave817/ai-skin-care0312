import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getProduct, upsertProduct, deleteProduct } from "@/lib/db/products-repo";
import { productSchema } from "@/lib/validations/product";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/admin-auth";
import { verifyOrigin } from "@/lib/csrf";
import { sanitizeProductDescription } from "@/lib/sanitize";
import { invalidateCatalogCache } from "@/lib/ai/product-catalog-prompt";

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

function revalidateAfterChange(slug: string) {
  revalidatePath("/");
  revalidatePath("/store");
  revalidatePath(`/store/${slug}`);
  revalidateTag("products");
  invalidateCatalogCache();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAuth(request);
  if (denied) return denied;
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, data: product });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAuth(request);
  if (denied) return denied;
  const { id } = await params;
  try {
    const existing = await getProduct(id);
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const body = await request.json();
    const merged = { ...existing, ...body, id };
    const parsed = productSchema.safeParse(merged);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "輸入資料不正確", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const sanitized = {
      ...parsed.data,
      descriptionZh: sanitizeProductDescription(parsed.data.descriptionZh),
    };
    const saved = await upsertProduct(sanitized);
    revalidateAfterChange(saved.slug);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAuth(request);
  if (denied) return denied;
  const { id } = await params;
  try {
    const existing = await getProduct(id);
    await deleteProduct(id);
    if (existing) revalidateAfterChange(existing.slug);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
