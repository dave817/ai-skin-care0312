import Stripe from "stripe";

let cached: Stripe | null = null;

export function isStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  return !!(key && !key.includes("placeholder"));
}

export function getStripe(): Stripe {
  if (!isStripeConfigured()) {
    throw new Error(
      "Stripe 未設定 — STRIPE_SECRET_KEY 仲係 placeholder。請喺 .env.local 加入真實 Stripe key。"
    );
  }
  if (cached) return cached;
  cached = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
  });
  return cached;
}

export interface CartLineInput {
  productId: string;
  productNameZh: string;
  brand: string;
  imageUrl: string;
  unitPriceHkd: number;
  quantity: number;
}

export interface CreateSessionInput {
  lines: CartLineInput[];
  shippingFeeHkd: number;
  shippingLabel: string;
  customerEmail: string;
  metadata: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
}

export async function createCheckoutSession(input: CreateSessionInput): Promise<{ sessionId: string; url: string }> {
  const stripe = getStripe();
  const currency = (process.env.STRIPE_CURRENCY ?? "hkd").toLowerCase();

  const lineItems = input.lines.map((line) => ({
    price_data: {
      currency,
      product_data: {
        name: `${line.brand} · ${line.productNameZh}`,
        images: line.imageUrl ? [line.imageUrl] : undefined,
        metadata: { productId: line.productId },
      },
      unit_amount: Math.round(line.unitPriceHkd * 100),
    },
    quantity: line.quantity,
  }));

  if (input.shippingFeeHkd > 0) {
    lineItems.push({
      price_data: {
        currency,
        product_data: {
          name: `運費 — ${input.shippingLabel}`,
          images: undefined,
          metadata: { productId: "shipping" },
        },
        unit_amount: Math.round(input.shippingFeeHkd * 100),
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    customer_email: input.customerEmail,
    metadata: input.metadata,
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    locale: "zh-HK",
  });

  return { sessionId: session.id, url: session.url ?? input.cancelUrl };
}
