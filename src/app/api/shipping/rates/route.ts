import { NextRequest, NextResponse } from "next/server";
import { listShippingMethods } from "@/lib/shipping";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const subtotal = Number(request.nextUrl.searchParams.get("subtotal") ?? 0);
  const rates = listShippingMethods(isFinite(subtotal) ? subtotal : 0);
  return NextResponse.json({ success: true, rates });
}
