"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft, Trash2, Loader2 } from "lucide-react";
import type { BlogPost } from "@/data/blogs";
import ImageUploader from "./ImageUploader";
import TiptapEditor from "./TiptapEditor";

interface BlogFormProps {
  initial?: BlogPost;
  isEdit?: boolean;
}

const DEFAULT_BLOG: BlogPost = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  date: new Date().toISOString().slice(0, 10),
  author: "Dear Glow Beauty",
  tags: [],
  relatedProductIds: [],
};

export default function BlogForm({ initial, isEdit = false }: BlogFormProps) {
  const router = useRouter();
  const [data, setData] = useState<BlogPost>(initial ?? DEFAULT_BLOG);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof BlogPost>(key: K, value: BlogPost[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = isEdit ? `/api/admin/blogs/${data.id}` : "/api/admin/blogs";
      const method = isEdit ? "PATCH" : "POST";
      const body = isEdit
        ? data
        : { ...data, id: data.id || `blog-${Date.now()}` };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || `儲存失敗 (HTTP ${res.status})`);
      }
      router.push("/admin/blogs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "儲存時發生錯誤");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit) return;
    if (!confirm(`確定要刪除「${data.title}」？`)) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/blogs/${data.id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "刪除失敗");
      }
      router.push("/admin/blogs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "刪除時發生錯誤");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/blogs"
          className="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          返回網誌列表
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <ImageUploader
        label="封面圖片"
        value={data.coverImage}
        onChange={(url) => update("coverImage", url)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="ID（不能修改）" required>
          <input
            type="text"
            value={data.id}
            onChange={(e) => update("id", e.target.value)}
            disabled={isEdit}
            placeholder="blog-001"
            className="form-input"
          />
        </Field>
        <Field label="Slug（連結）" required>
          <input
            type="text"
            value={data.slug}
            onChange={(e) => update("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            placeholder="my-first-blog-post"
            className="form-input"
          />
        </Field>
      </div>

      <Field label="標題" required>
        <input
          type="text"
          value={data.title}
          onChange={(e) => update("title", e.target.value)}
          className="form-input"
        />
      </Field>

      <Field label="摘要">
        <textarea
          value={data.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          rows={3}
          placeholder="簡短描述（會喺網誌列表顯示）"
          className="form-input"
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="日期" required>
          <input
            type="date"
            value={data.date}
            onChange={(e) => update("date", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="作者">
          <input
            type="text"
            value={data.author}
            onChange={(e) => update("author", e.target.value)}
            className="form-input"
          />
        </Field>
        <Field label="標籤（逗號分隔）">
          <input
            type="text"
            value={data.tags.join(", ")}
            onChange={(e) =>
              update("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))
            }
            placeholder="護膚, 韓國美妝"
            className="form-input"
          />
        </Field>
      </div>

      <Field label="關聯產品 ID（逗號分隔，例如 P001, P002）">
        <input
          type="text"
          value={data.relatedProductIds.join(", ")}
          onChange={(e) =>
            update(
              "relatedProductIds",
              e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
            )
          }
          className="form-input"
        />
      </Field>

      <div>
        <span className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
          文章內容<span className="text-red-500 ml-0.5">*</span>
        </span>
        <TiptapEditor
          value={data.content}
          onChange={(html) => update("content", html)}
          placeholder="開始撰寫網誌內容...（支援標題、清單、引用、圖片、連結）"
        />
        <p className="text-[11px] text-text-muted mt-1.5">
          可以直接貼上「韓中圖片翻譯」工具產生嘅 PNG 連結（用工具列嘅圖片按鈕，或拖入圖片直接上載到 Vercel Blob）。
        </p>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-border-light">
        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1.5 disabled:opacity-40"
          >
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            刪除文章
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="ml-auto bg-accent-rose text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isEdit ? "更新文章" : "發佈文章"}
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
