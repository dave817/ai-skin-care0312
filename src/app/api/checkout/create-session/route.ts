import { NextRequest, NextResponse } from "next/server";
import {
  createCheckoutSession,
  isStripeConfigured,
  type CartLineInput,
} from "@/lib/stripe";

export const runtime = "nodejs";

interface RequestBody {
  lines: CartLineInput[];
  shippingFeeHkd: number;
  shippingLabel: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  shippingMethod: string;
  servicePointId?: string;
  servicePointName?: string;
  deliveryAddress?: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured()) {
      return NextResponse.json(
        {
          error:
            "Stripe 未設定。客戶提供 STRIPE_SECRET_KEY 之後即可啟用付款。",
          configured: false,
        },
        { status: 503 }
      );
    }

    const body = (await request.json()) as RequestBody;

    if (!body.lines?.length || !body.customerEmail || !body.customerName) {
      return NextResponse.json({ error: "缺少必要訂單資料" }, { status: 400 });
    }

    const origin =
      request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";
    const orderId = `DGB-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    const session = await createCheckoutSession({
      lines: body.lines,
      shippingFeeHkd: body.shippingFeeHkd,
      shippingLabel: body.shippingLabel,
      customerEmail: body.customerEmail,
      successUrl: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancelUrl: `${origin}/cart`,
      metadata: {
        orderId,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        shippingMethod: body.shippingMethod,
        servicePointId: body.servicePointId ?? "",
        servicePointName: body.servicePointName ?? "",
        deliveryAddress: body.deliveryAddress ?? "",
      },
    });

    return NextResponse.json({
      success: true,
      sessionId: session.sessionId,
      url: session.url,
      orderId,
    });
  } catch (error: unknown) {
    console.error("Stripe create-session error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
