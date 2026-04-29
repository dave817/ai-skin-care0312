"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Loader2, Database, AlertCircle } from "lucide-react";
import type { BlogWithMeta } from "@/lib/db/blogs-repo";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      setBlogs(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "讀取網誌失敗");
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
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed");
      setSeedMessage(`已匯入 ${data.inserted} 篇文章（跳過 ${data.skipped} 篇已存在）`);
      await load();
    } catch (err) {
      setSeedMessage(err instanceof Error ? err.message : "匯入失敗");
    } finally {
      setSeeding(false);
    }
  };

  const filtered = blogs.filter((b) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q) ||
      b.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">網誌管理</h1>
          <p className="text-text-muted text-sm mt-1">共 {blogs.length} 篇文章</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="text-sm px-4 py-2 rounded-lg border border-border hover:border-accent-rose text-text-secondary hover:text-accent-rose transition-colors flex items-center gap-2 disabled:opacity-40"
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            匯入種子文章
          </button>
          <Link
            href="/admin/blogs/new"
            className="bg-accent-rose text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新增文章
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
          <span>{error}</span>
        </div>
      )}

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋標題、slug、標籤..."
          className="form-input pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-text-muted" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((b) => (
            <Link
              key={b.id}
              href={`/admin/blogs/${b.id}/edit`}
              className="group bg-white rounded-xl border border-border-light hover:border-accent-rose/40 transition-colors overflow-hidden flex"
            >
              <div className="relative w-32 h-32 bg-bg-secondary flex-shrink-0">
                {b.coverImage && (
                  <Image
                    src={b.coverImage}
                    alt={b.title}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                )}
              </div>
              <div className="flex-1 p-4 min-w-0">
                <p className="text-[11px] text-text-muted">{b.date} · {b.author}</p>
                <h3 className="text-sm font-bold text-text-primary line-clamp-2 mt-1 group-hover:text-accent-rose transition-colors">
                  {b.title}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-2 mt-1">
                  {b.excerpt}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {b.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-bg-secondary text-text-secondary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-text-muted text-sm">
              {search ? `搵唔到「${search}」相關文章` : "未有文章"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
