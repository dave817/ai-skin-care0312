import { Resend } from "resend";
import { formatPrice } from "@/lib/utils";
import { escapeHtml } from "@/lib/sanitize";

let cachedClient: Resend | null = null;

export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY 未設定");
  }
  if (cachedClient) return cachedClient;
  cachedClient = new Resend(process.env.RESEND_API_KEY);
  return cachedClient;
}

function fromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
}

export interface OrderEmailItem {
  brand: string;
  nameZh: string;
  quantity: number;
  unitPriceHkd: number;
  imageUrl: string;
}

export interface OrderEmailInput {
  to: string;
  customerName: string;
  orderId: string;
  items: OrderEmailItem[];
  subtotalHkd: number;
  shippingFeeHkd: number;
  shippingLabel: string;
  servicePointName?: string;
  deliveryAddress?: string;
  trackingNumber?: string;
  totalHkd: number;
}

function safeImageUrl(url: string): string {
  /* Only allow http(s) URLs in email images to prevent javascript: or data: injection */
  if (/^https?:\/\//i.test(url)) return escapeHtml(url);
  return "";
}

function renderItemsTable(items: OrderEmailItem[]): string {
  return items
    .map((i) => {
      const safeBrand = escapeHtml(i.brand);
      const safeName = escapeHtml(i.nameZh);
      const safeImg = safeImageUrl(i.imageUrl);
      return `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eee;display:flex;align-items:center;gap:12px;">
            ${safeImg ? `<img src="${safeImg}" alt="${safeName}" width="56" height="56" style="border-radius:8px;background:#f5f5f5;object-fit:cover;" />` : ""}
            <div>
              <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:1px;">${safeBrand}</div>
              <div style="font-size:14px;color:#1a1a1a;font-weight:500;">${safeName}</div>
              <div style="font-size:12px;color:#666;">× ${i.quantity}</div>
            </div>
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right;font-family:monospace;font-weight:600;font-size:14px;">
            ${formatPrice(i.unitPriceHkd * i.quantity)}
          </td>
        </tr>`;
    })
    .join("");
}

export async function sendOrderConfirmation(input: OrderEmailInput): Promise<void> {
  const resend = getResend();
  const html = `
<!doctype html>
<html lang="zh-Hant">
  <body style="margin:0;padding:0;background:#f7f7f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans TC',sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:white;padding:32px 24px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="font-family:Georgia,'Noto Serif TC',serif;color:#1a1a1a;font-size:24px;margin:0;">Dear Glow Beauty</h1>
        <p style="color:#999;font-size:12px;margin:4px 0 0;letter-spacing:2px;">日韓化妝品護膚品專門店</p>
      </div>

      <div style="background:#FDF6F1;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
        <div style="font-size:14px;color:#C17C6A;font-weight:600;margin-bottom:8px;">✓ 訂單確認</div>
        <h2 style="font-size:18px;color:#1a1a1a;margin:0 0 4px 0;">多謝您嘅訂單，${escapeHtml(input.customerName)}</h2>
        <p style="font-size:13px;color:#666;margin:0;font-family:monospace;">訂單編號：${escapeHtml(input.orderId)}</p>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tbody>
          ${renderItemsTable(input.items)}
        </tbody>
      </table>

      <div style="background:#fafafa;border-radius:12px;padding:16px;margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;font-size:13px;color:#555;margin-bottom:6px;">
          <span>小計</span>
          <span style="font-family:monospace;">${formatPrice(input.subtotalHkd)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:13px;color:#555;margin-bottom:6px;">
          <span>運費 · ${input.shippingLabel}</span>
          <span style="font-family:monospace;">${input.shippingFeeHkd === 0 ? "免費" : formatPrice(input.shippingFeeHkd)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:bold;color:#1a1a1a;padding-top:8px;border-top:1px solid #eee;">
          <span>總計</span>
          <span style="font-family:monospace;">${formatPrice(input.totalHkd)}</span>
        </div>
      </div>

      <div style="background:#E3F0FA;border-radius:12px;padding:16px;margin-bottom:24px;font-size:13px;color:#1a1a1a;">
        <p style="margin:0 0 8px 0;font-weight:600;">📦 送貨資料</p>
        <p style="margin:0 0 4px 0;color:#555;">${escapeHtml(input.shippingLabel)}</p>
        ${input.servicePointName ? `<p style="margin:0 0 4px 0;color:#555;">取貨點：${escapeHtml(input.servicePointName)}</p>` : ""}
        ${input.deliveryAddress ? `<p style="margin:0 0 4px 0;color:#555;">地址：${escapeHtml(input.deliveryAddress)}</p>` : ""}
        ${input.trackingNumber ? `<p style="margin:0 0 4px 0;color:#555;font-family:monospace;">SF 追蹤號：${escapeHtml(input.trackingNumber)}</p>` : '<p style="margin:0;color:#888;font-style:italic;">追蹤號將喺出貨後另行通知</p>'}
      </div>

      <div style="text-align:center;padding:16px 0;border-top:1px solid #eee;">
        <p style="font-size:12px;color:#999;margin:0 0 8px 0;">如有任何問題，請電郵 support@dearglowbeauty.com</p>
        <p style="font-size:11px;color:#bbb;margin:0;">© Dear Glow Beauty · 香港</p>
      </div>
    </div>
  </body>
</html>`;

  await resend.emails.send({
    from: `Dear Glow Beauty <${fromEmail()}>`,
    to: input.to,
    subject: `訂單確認 #${input.orderId} · 多謝您嘅訂單`,
    html,
  });
}

export async function sendAdminNotification(orderId: string, customerName: string, totalHkd: number): Promise<void> {
  const adminEmail = process.env.RESEND_ADMIN_EMAIL;
  if (!adminEmail) return;
  const resend = getResend();
  await resend.emails.send({
    from: `Dear Glow Beauty Admin <${fromEmail()}>`,
    to: adminEmail,
    subject: `新訂單 #${orderId}`,
    html: `<p>新訂單嚟自 ${escapeHtml(customerName)}</p><p>訂單編號：<code>${escapeHtml(orderId)}</code></p><p>總金額：${formatPrice(totalHkd)}</p><p>請登入 admin 後台查看詳情。</p>`,
  });
}
