import { NextRequest, NextResponse } from "next/server";
import { SF_SERVICE_POINTS } from "@/lib/shipping";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const district = request.nextUrl.searchParams.get("district");
  const type = request.nextUrl.searchParams.get("type");
  const points = SF_SERVICE_POINTS.filter((p) => {
    if (district && !p.district.includes(district)) return false;
    if (type && p.type !== type) return false;
    return true;
  });
  return NextResponse.json({ success: true, points });
}
