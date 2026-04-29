"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "登入失敗");
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "登入時發生錯誤");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-accent-rose/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-accent-rose" />
          </div>
          <h1 className="text-xl font-bold text-text-primary mb-1">後台登入</h1>
          <p className="text-text-muted text-sm">Dear Glow Beauty Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              管理員密碼
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-lg border border-border focus:outline-none focus:border-accent-rose text-sm"
              placeholder="請輸入密碼"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 text-red-700 text-xs p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-accent-rose text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {loading ? "登入中..." : "登入"}
          </button>
        </form>

        <p className="text-[11px] text-text-muted text-center mt-6">
          請聯絡網站管理員獲取後台密碼
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-text-muted">載入中...</div>}>
      <LoginForm />
    </Suspense>
  );
}
