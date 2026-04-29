import { NextRequest, NextResponse } from "next/server";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { sendOrderConfirmation, sendAdminNotification, isResendConfigured } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || secret.includes("placeholder")) {
    return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET not set" }, { status: 500 });
  }

  const sig = request.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const body = await request.text();
  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown";
    return NextResponse.json({ error: `Webhook signature failed: ${msg}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const meta = session.metadata ?? {};
    const orderId = meta.orderId ?? "unknown";
    const customerName = meta.customerName ?? "顧客";
    const customerEmail = session.customer_email ?? session.customer_details?.email ?? "";
    const totalHkd = (session.amount_total ?? 0) / 100;

    /* Retrieve session with line_items expanded so we can render them in email */
    const items: { brand: string; nameZh: string; quantity: number; unitPriceHkd: number; imageUrl: string }[] = [];
    let shippingFeeHkd = 0;
    try {
      const expanded = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items.data.price.product"],
      });
      const lineItems = expanded.line_items?.data ?? [];
      for (const li of lineItems) {
        const product = li.price?.product;
        if (typeof product === "object" && product && "name" in product) {
          const name = product.name ?? "";
          const isShipping = name.startsWith("運費");
          const unitAmount = (li.price?.unit_amount ?? 0) / 100;
          if (isShipping) {
            shippingFeeHkd += unitAmount * (li.quantity ?? 1);
            continue;
          }
          /* Product name format: "Brand · NameZh" */
          const sep = " · ";
          const sepIdx = name.indexOf(sep);
          const brand = sepIdx > 0 ? name.slice(0, sepIdx) : "";
          const nameZh = sepIdx > 0 ? name.slice(sepIdx + sep.length) : name;
          items.push({
            brand,
            nameZh,
            quantity: li.quantity ?? 1,
            unitPriceHkd: unitAmount,
            imageUrl: ("images" in product && product.images?.[0]) || "",
          });
        }
      }
    } catch (e) {
      console.error("Failed to retrieve session line items:", e);
    }

    const subtotalHkd = items.reduce((sum, i) => sum + i.unitPriceHkd * i.quantity, 0);

    /* TODO: persist order to DB here when orders table is wired */
    /* TODO: trigger SF Express createOrder here when SF credentials are set */

    if (customerEmail && isResendConfigured()) {
      try {
        await sendOrderConfirmation({
          to: customerEmail,
          customerName,
          orderId,
          items,
          subtotalHkd,
          shippingFeeHkd,
          shippingLabel: meta.shippingMethod ?? "順豐速遞",
          servicePointName: meta.servicePointName,
          deliveryAddress: meta.deliveryAddress,
          totalHkd,
        });
        await sendAdminNotification(orderId, customerName, totalHkd);
      } catch (e) {
        console.error("Email send failed:", e);
      }
    }
  }

  return NextResponse.json({ received: true });
}
