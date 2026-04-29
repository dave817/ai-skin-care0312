import { ShoppingBag, CreditCard, Truck } from "lucide-react";

export default function AdminOrdersPage() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">訂單管理</h1>
        <p className="text-text-muted text-sm mt-1">
          訂單功能將喺整合 Stripe + SF Express 之後啟用
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border-light p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-bg-secondary flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-6 h-6 text-text-muted" />
        </div>
        <h2 className="text-base font-bold text-text-primary mb-2">
          訂單功能準備中
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-6">
          需要完成以下整合：
        </p>
        <ul className="text-left max-w-md mx-auto space-y-3 text-sm text-text-secondary">
          <li className="flex items-start gap-3">
            <CreditCard className="w-4 h-4 text-accent-blue mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-text-primary">Stripe Checkout</strong>
              <p className="text-xs mt-0.5">
                需要 Stripe 商戶帳戶 + STRIPE_SECRET_KEY 同 STRIPE_PUBLIC_KEY
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Truck className="w-4 h-4 text-accent-rose mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-text-primary">SF Express HK</strong>
              <p className="text-xs mt-0.5">
                Phase 1：使用統一運費 + 順豐站點靜態列表（已可運作，毋須額外 API）
                <br />
                Phase 2：完整 SF Open Platform API 整合（需要商戶申請）
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
