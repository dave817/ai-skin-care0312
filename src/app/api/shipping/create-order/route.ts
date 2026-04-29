import { NextRequest, NextResponse } from "next/server";
import { createSFOrder, isSFConfigured } from "@/lib/sf-express";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    if (!isSFConfigured()) {
      return NextResponse.json(
        {
          error:
            "SF Express 未設定。需要客戶提供 SF_APP_KEY / SF_APP_SECRET / SF_MERCHANT_CODE。",
          configured: false,
        },
        { status: 503 }
      );
    }
    const body = await request.json();
    const result = await createSFOrder(body);
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
