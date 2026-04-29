"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/data/products";
import ImageUploader from "./ImageUploader";

interface ProductFormProps {
  initial?: Product;
  isEdit?: boolean;
}

const DEFAULT_PRODUCT: Product = {
  id: "",
  slug: "",
  brand: "",
  nameZh: "",
  nameEn: "",
  category: "skincare",
  subcategory: "",
  priceOriginal: 0,
  priceSale: null,
  currency: "HKD",
  descriptionZh: "",
  imageUrl: "",
  imageAlt: "",
  tags: [],
  skinConcerns: [],
  rating: 4.5,
  reviewCount: 0,
  volume: "",
  stock: 0,
  active: true,
};

export default function ProductForm({ initial, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [data, setData] = useState<Product>(initial ?? DEFAULT_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof Product>(key: K, value: Product[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = isEdit ? `/api/admin/products/${data.id}` : "/api/admin/products";
      const method = isEdit ? "PATCH" : "POST";
      const body = isEdit ? data : { ...data, id: data.id || `P${Date.now()}` };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || `儲存失敗 (HTTP ${res.status})`);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "儲存時發生錯誤");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    if (!confirm(`確定要刪除「${data.nameZh}」？此動作無法復原。`)) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${data.id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || `刪除失敗`);
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "刪除時發生錯誤");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          返回產品列表
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Image */}
      <ImageUploader
        label="產品圖片"
        value={data.imageUrl}
        onChange={(url) => {
          update("imageUrl", url);
          if (!data.imageAlt) update("imageAlt", data.nameZh || "產品圖片");
        }}
      />

      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="ID（不能修改）" required>
          <input
            type="text"
            value={data.id}
            onChange={(e) => update("id", e.target.value)}
            disabled={isEdit}
            placeholder="P001"
            className="form-input"
          />
        </Field>
        <Field label="Slug（連結）" required>
          <input
            type="text"
            value={data.slug}
            onChange={(e) => update("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            placeholder="brand-product-name"
            className="form-input"
          />
        </Field>
        <Field label="品牌" required>
          <input
            type="text"
            value={data.brand}
            onChange={(e) => update("brand", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="中文名稱" required>
          <input
            type="text"
            value={data.nameZh}
            onChange={(e) => update("nameZh", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="英文名稱">
          <input
            type="text"
            value={data.nameEn}
            onChange={(e) => update("nameEn", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="分類">
          <select
            value={data.category}
            onChange={(e) => update("category", e.target.value)}
            className="form-input"
          >
            <option value="skincare">護膚</option>
            <option value="makeup">彩妝</option>
            <option value="body-hair">身體 &amp; 頭髮</option>
            <option value="tools">美容工具</option>
            <option value="health">健康/纖體</option>
            <option value="food">食品</option>
            <option value="home">居家生活</option>
          </select>
        </Field>
        <Field label="子分類">
          <input
            type="text"
            value={data.subcategory}
            onChange={(e) => update("subcategory", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="容量">
          <input
            type="text"
            value={data.volume}
            onChange={(e) => update("volume", e.target.value)}
            placeholder="50ml"
            className="form-input"
          />
        </Field>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="原價 (HKD)" required>
          <input
            type="number"
            min="0"
            value={data.priceOriginal}
            onChange={(e) => update("priceOriginal", Number(e.target.value))}
            className="form-input"
          />
        </Field>
        <Field label="特價 (HKD，留空無特價)">
          <input
            type="number"
            min="0"
            value={data.priceSale ?? ""}
            onChange={(e) =>
              update("priceSale", e.target.value === "" ? null : Number(e.target.value))
            }
            className="form-input"
          />
        </Field>
        <Field label="庫存">
          <input
            type="number"
            min="0"
            value={data.stock}
            onChange={(e) => update("stock", Number(e.target.value))}
            className="form-input"
          />
        </Field>
      </div>

      <Field label="描述 (繁體中文)">
        <textarea
          value={data.descriptionZh}
          onChange={(e) => update("descriptionZh", e.target.value)}
          rows={5}
          className="form-input"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="標籤（逗號分隔）">
          <input
            type="text"
            value={data.tags.join(", ")}
            onChange={(e) => update("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
            placeholder="bestseller, new"
            className="form-input"
          />
        </Field>
        <Field label="適合膚質（逗號分隔）">
          <input
            type="text"
            value={data.skinConcerns.join(", ")}
            onChange={(e) =>
              update(
                "skinConcerns",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
            placeholder="oily, sensitive, dry"
            className="form-input"
          />
        </Field>
        <Field label="評分 (0-5)">
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={data.rating}
            onChange={(e) => update("rating", Number(e.target.value))}
            className="form-input"
          />
        </Field>
        <Field label="評論數">
          <input
            type="number"
            min="0"
            value={data.reviewCount}
            onChange={(e) => update("reviewCount", Number(e.target.value))}
            className="form-input"
          />
        </Field>
      </div>

      <label className="flex items-center gap-2.5 text-sm">
        <input
          type="checkbox"
          checked={data.active}
          onChange={(e) => update("active", e.target.checked)}
          className="w-4 h-4 accent-[var(--accent-rose,#C17C6A)]"
        />
        <span>產品啟用（在前台顯示）</span>
      </label>

      {/* Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-border-light">
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1.5 disabled:opacity-40"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            刪除產品
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="ml-auto bg-accent-rose text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              儲存中...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEdit ? "更新產品" : "新增產品"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      {children}
    </label>
  );
}
