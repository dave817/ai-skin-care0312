"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Truck,
  Package,
  Box,
  Check,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import {
  listShippingMethods,
  type ShippingMethod,
  SF_SERVICE_POINTS,
  FREE_SHIPPING_THRESHOLD,
} from "@/lib/shipping";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("sf-station");
  const [servicePointId, setServicePointId] = useState<string>("");
  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const rates = useMemo(() => listShippingMethods(totalPrice), [totalPrice]);
  const selectedRate = rates.find((r) => r.method === shippingMethod);
  const shippingFee = selectedRate?.fee ?? 0;
  const grandTotal = totalPrice + shippingFee;
  const freeShipDelta = FREE_SHIPPING_THRESHOLD - totalPrice;

  const needsServicePoint = shippingMethod !== "home-delivery";

  const canSubmit =
    items.length > 0 &&
    contact.name.trim().length > 0 &&
    /^[+\d\s-]{8,}$/.test(contact.phone) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) &&
    (needsServicePoint
      ? servicePointId.length > 0
      : contact.address.trim().length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);

    const servicePoint = SF_SERVICE_POINTS.find((p) => p.id === servicePointId);

    /* Try Stripe first; fall back to simulated confirmation if not configured */
    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: items.map((it) => ({
            productId: it.product.id,
            productNameZh: it.product.nameZh,
            brand: it.product.brand,
            imageUrl: it.product.imageUrl,
            unitPriceHkd: it.product.priceSale ?? it.product.priceOriginal,
            quantity: it.quantity,
          })),
          shippingFeeHkd: shippingFee,
          shippingLabel: selectedRate?.label ?? "順豐速遞",
          customerEmail: contact.email,
          customerName: contact.name,
          customerPhone: contact.phone,
          shippingMethod,
          servicePointId: servicePointId || undefined,
          servicePointName: servicePoint?.name,
          deliveryAddress: contact.address || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.url) {
        /* Stripe ready: redirect to checkout */
        window.location.href = data.url;
        return;
      }

      /* Stripe not configured (503) → simulated confirmation */
      if (res.status === 503 && data?.configured === false) {
        await new Promise((r) => setTimeout(r, 600));
        setOrderConfirmed(true);
        clearCart();
        return;
      }

      throw new Error(data?.error || `付款啟動失敗 (HTTP ${res.status})`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "結帳時發生錯誤，請重試");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="container-main py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-700" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            訂單已收到
          </h1>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            我哋已收到您嘅訂單，會盡快處理。
            <br />
            付款連結 / 訂單編號將以電郵發送至 {contact.email}
          </p>
          <p className="text-xs text-text-muted bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            ⚠️ 注意：本網站尚未接駁 Stripe 收款。Phase 1 純粹示範訂單流程，未實際扣款。
          </p>
          <Link
            href="/store"
            className="inline-block bg-accent-rose text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            繼續購物
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-main py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-xl font-bold text-text-primary mb-2">
            購物車係空嘅
          </h1>
          <Link
            href="/store"
            className="inline-block mt-4 text-accent-blue hover:underline text-sm font-semibold"
          >
            前往商店
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main py-8 md:py-12">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        返回
      </button>

      <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-8">
        結帳
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Contact */}
          <section className="bg-white rounded-xl border border-border-light p-6">
            <h2 className="text-base font-bold text-text-primary mb-4">
              聯絡資料
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="姓名" required>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  className="form-input"
                  required
                />
              </Field>
              <Field label="電話" required>
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  placeholder="9123 4567"
                  className="form-input"
                  required
                />
              </Field>
              <Field label="電郵" required className="md:col-span-2">
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  className="form-input"
                  required
                />
              </Field>
            </div>
          </section>

          {/* Shipping method */}
          <section className="bg-white rounded-xl border border-border-light p-6">
            <h2 className="text-base font-bold text-text-primary mb-4">
              送貨方式
            </h2>
            <div className="space-y-2">
              {rates.map((rate) => {
                const Icon =
                  rate.method === "home-delivery"
                    ? Truck
                    : rate.method === "sf-locker"
                    ? Box
                    : Package;
                const selected = shippingMethod === rate.method;
                return (
                  <label
                    key={rate.method}
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-colors ${
                      selected
                        ? "border-accent-rose bg-accent-rose/5"
                        : "border-border hover:border-accent-rose/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={rate.method}
                      checked={selected}
                      onChange={() => setShippingMethod(rate.method)}
                      className="mt-1 accent-[var(--accent-rose,#C17C6A)]"
                    />
                    <Icon className="w-5 h-5 text-accent-rose flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-text-primary">
                          {rate.label}
                        </span>
                        <span className="text-sm font-mono font-bold">
                          {rate.fee === 0 ? (
                            <span className="text-green-700">免費</span>
                          ) : (
                            formatPrice(rate.fee)
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted mt-0.5">
                        {rate.description}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            {freeShipDelta > 0 && (
              <p className="text-xs text-text-muted mt-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-2.5">
                💡 再買 {formatPrice(freeShipDelta)} 即享免運費！
              </p>
            )}
          </section>

          {/* Service point or address */}
          <section className="bg-white rounded-xl border border-border-light p-6">
            <h2 className="text-base font-bold text-text-primary mb-4">
              {needsServicePoint ? "選擇取貨點" : "送貨地址"}
            </h2>

            {needsServicePoint ? (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {SF_SERVICE_POINTS.filter(
                  (p) =>
                    (shippingMethod === "sf-locker" && p.type === "locker") ||
                    (shippingMethod === "sf-station" && p.type === "station")
                ).map((point) => {
                  const selected = servicePointId === point.id;
                  return (
                    <label
                      key={point.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selected
                          ? "border-accent-rose bg-accent-rose/5"
                          : "border-border-light hover:border-accent-rose/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="servicePoint"
                        value={point.id}
                        checked={selected}
                        onChange={() => setServicePointId(point.id)}
                        className="mt-1 accent-[var(--accent-rose,#C17C6A)]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-text-primary">
                            {point.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-bg-secondary text-text-secondary">
                            {point.district}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">
                          {point.address}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            ) : (
              <Field label="地址" required>
                <textarea
                  value={contact.address}
                  onChange={(e) => setContact({ ...contact, address: e.target.value })}
                  rows={3}
                  placeholder="香港九龍尖沙咀彌敦道 1 號 X 樓 X 室"
                  className="form-input"
                  required
                />
              </Field>
            )}
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-border-light p-6 sticky top-6">
            <h2 className="text-base font-bold text-text-primary mb-4">
              訂單摘要
            </h2>

            <div className="space-y-3 mb-4 max-h-[280px] overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.imageAlt}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-muted">{item.product.brand}</p>
                    <p className="text-sm text-text-primary line-clamp-1">
                      {item.product.nameZh}
                    </p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-text-muted">
                        × {item.quantity}
                      </span>
                      <span className="font-mono text-xs font-bold">
                        {formatPrice(
                          (item.product.priceSale ?? item.product.priceOriginal) *
                            item.quantity
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm border-t border-border-light pt-4">
              <div className="flex justify-between">
                <span className="text-text-secondary">小計</span>
                <span className="font-mono">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">運費</span>
                <span className="font-mono">
                  {shippingFee === 0 ? (
                    <span className="text-green-700">免費</span>
                  ) : (
                    formatPrice(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-border-light">
                <span>總計</span>
                <span className="font-mono">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="w-full mt-6 bg-accent-blue text-white font-semibold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              {submitting ? "處理中..." : "確認訂單"}
            </button>

            <div className="mt-4 flex items-start gap-2 text-[11px] text-text-muted bg-amber-50 border border-amber-200 rounded-lg p-2.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
              <span>
                Phase 1 訂單示範：未接駁 Stripe，僅模擬訂單流程。實際付款需另行整合。
              </span>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}
