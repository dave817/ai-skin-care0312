/**
 * SF Express HK Open Platform integration — Phase 2 stub.
 *
 * To activate:
 * 1. Register a merchant at https://open.sf-express.com (or https://sfit.sf-express.com for HK)
 * 2. Get SF_APP_KEY + SF_APP_SECRET + SF_MERCHANT_CODE
 * 3. Replace placeholder env vars in .env.local
 * 4. Implement the API calls below per SF API docs:
 *    https://qiao.sf-express.com/pages/openHomePage.html
 */

export function isSFConfigured(): boolean {
  const key = process.env.SF_APP_KEY;
  const secret = process.env.SF_APP_SECRET;
  return !!(
    key &&
    secret &&
    !key.includes("placeholder") &&
    !secret.includes("placeholder")
  );
}

export interface SFOrderInput {
  customerName: string;
  customerPhone: string;
  destinationType: "service-point" | "address";
  servicePointId?: string;
  destinationAddress?: string;
  weightKg: number;
  totalValueHkd: number;
  goodsDescription: string;
  externalOrderId: string;
}

export interface SFOrderResult {
  orderId: string;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  labelUrl?: string;
}

/**
 * Stub: creates a SF Express order.
 *
 * TODO when client provides credentials:
 * - POST to https://sfapi.sf-express.com/std/service?service=EXP_RECE_CREATE_ORDER
 * - Sign request with SF_APP_SECRET (MD5 of body+timestamp+secret)
 * - Parse response, store trackingNumber in our orders table
 */
export async function createSFOrder(_input: SFOrderInput): Promise<SFOrderResult> {
  if (!isSFConfigured()) {
    throw new Error(
      "SF Express 未設定 — 請聯絡客戶取得 SF_APP_KEY / SF_APP_SECRET，再喺 .env.local 設定。"
    );
  }

  /* TODO: real implementation
  const timestamp = Date.now().toString();
  const body = JSON.stringify({ ... });
  const signature = createHmac("md5", process.env.SF_APP_SECRET!).update(body + timestamp).digest("hex");
  const response = await fetch(`${process.env.SF_API_BASE}/std/service?service=EXP_RECE_CREATE_ORDER`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-sf-app-key": process.env.SF_APP_KEY!,
      "x-sf-timestamp": timestamp,
      "x-sf-signature": signature,
    },
    body,
  });
  ...
  */

  throw new Error("SF createOrder 未實作 — 等待客戶提供 API 文件 / credentials");
}

export async function querySFTracking(_trackingNumber: string): Promise<{ status: string; events: { time: string; description: string }[] }> {
  if (!isSFConfigured()) {
    throw new Error("SF Express 未設定");
  }
  throw new Error("SF query tracking 未實作");
}
