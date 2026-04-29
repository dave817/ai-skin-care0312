import Link from "next/link";
import { Check, Mail, Package } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ session_id?: string; order_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderId = params.order_id ?? "—";

  return (
    <main className="container-main py-16">
      <div className="max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-700" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          訂單付款成功
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed mb-8">
          多謝您嘅訂單！我哋已收到您嘅付款，
          <br />
          會盡快安排出貨。
        </p>

        <div className="bg-bg-secondary rounded-xl p-5 mb-6 text-left space-y-3">
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-accent-rose" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                訂單確認電郵已寄出
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                請查看您嘅電郵收件箱
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 text-accent-blue" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                順豐運送追蹤號
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                出貨後將以電郵通知
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-text-muted bg-bg-secondary rounded-lg p-3 mb-6 font-mono">
          訂單編號：{orderId}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/store"
            className="inline-block bg-accent-rose text-white font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            繼續購物
          </Link>
        </div>
      </div>
    </main>
  );
}
