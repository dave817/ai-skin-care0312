"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Loader2, Database, AlertCircle } from "lucide-react";
import type { ProductWithMeta } from "@/lib/db/products-repo";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      setProducts(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "讀取產品失敗");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMessage(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      setSeedMessage(
        `已匯入 ${data.inserted} 個產品（跳過 ${data.skipped} 個已存在）`
      );
      await load();
    } catch (err) {
      setSeedMessage(err instanceof Error ? err.message : "匯入失敗");
    } finally {
      setSeeding(false);
    }
  };

  const filtered = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.nameZh.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">產品管理</h1>
          <p className="text-text-muted text-sm mt-1">
            共 {products.length} 個產品
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="text-sm px-4 py-2 rounded-lg border border-border hover:border-accent-rose text-text-secondary hover:text-accent-rose transition-colors flex items-center gap-2 disabled:opacity-40"
            title="將現有 /src/data/products.ts 匯入 Upstash Redis"
          >
            {seeding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Database className="w-4 h-4" />
            )}
            匯入種子資料
          </button>
          <Link
            href="/admin/products/new"
            className="bg-accent-rose text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新增產品
          </Link>
        </div>
      </div>

      {seedMessage && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm px-4 py-2.5 rounded-lg mb-4">
          {seedMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{error}</p>
            <p className="text-xs mt-1">
              如未設定 Upstash Redis：請喺 .env.local 加 UPSTASH_REDIS_REST_URL 同 UPSTASH_REDIS_REST_TOKEN，
              然後重啟 dev server。
            </p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋產品名、品牌、ID..."
          className="form-input pl-9"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border-light overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-secondary text-text-secondary text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">產品</th>
                <th className="px-4 py-3 text-left font-semibold">分類</th>
                <th className="px-4 py-3 text-right font-semibold">價格</th>
                <th className="px-4 py-3 text-right font-semibold">庫存</th>
                <th className="px-4 py-3 text-center font-semibold">狀態</th>
                <th className="px-4 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-bg-secondary/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0">
                        {p.imageUrl && (
                          <Image
                            src={p.imageUrl}
                            alt={p.imageAlt}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-text-muted">{p.brand}</p>
                        <p className="font-medium text-text-primary line-clamp-1">
                          {p.nameZh}
                        </p>
                        <p className="text-[11px] text-text-muted font-mono">
                          {p.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {p.category} / {p.subcategory}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {formatPrice(p.priceSale ?? p.priceOriginal)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{p.stock}</td>
                  <td className="px-4 py-3 text-center">
                    {p.active ? (
                      <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 text-[10px] rounded-full font-semibold">
                        啟用
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full font-semibold">
                        停用
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-accent-rose hover:underline text-xs font-semibold"
                    >
                      編輯
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-text-muted text-sm">
                    {search ? `搵唔到「${search}」相關產品` : "未有產品"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
