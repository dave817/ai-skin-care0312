"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  ImagePlus,
  Upload,
  Loader2,
  Download,
  Copy,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from "lucide-react";

interface TranslateResult {
  url: string;
  mode: "blob" | "inline";
  width: number;
  height: number;
  blockCount: number;
}

export default function AdminTranslatePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<TranslateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;
    if (!selectedFile.type.startsWith("image/")) {
      setError("請上載圖片檔案");
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("圖片大小不可超過 10MB");
      return;
    }
    setError(null);
    setResult(null);
    setFile(selectedFile);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/translate-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || `翻譯失敗 (HTTP ${res.status})`);
      }
      setResult(data as TranslateResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "翻譯時發生錯誤");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard denied */
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = `translated-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-2">
          <ImagePlus className="w-5 h-5 text-accent-rose" />
          <h1 className="text-2xl font-bold text-text-primary">
            韓中圖片翻譯
          </h1>
        </div>
        <p className="text-text-muted text-sm">
          上載韓國產品描述圖片（如 OliveYoung 嘅長圖），AI 會 OCR 識別韓文並翻譯成繁體中文，
          再重新渲染成新圖片（防複製）。可直接嵌入產品詳情頁。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-white rounded-xl border border-border-light p-6">
          <h2 className="text-base font-bold text-text-primary mb-4">
            原始圖片
          </h2>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />

          {!previewUrl ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-[3/4] rounded-xl border-2 border-dashed border-border hover:border-accent-rose/50 hover:bg-accent-rose/5 transition-colors flex flex-col items-center justify-center gap-3 text-text-muted"
            >
              <Upload className="w-8 h-8" />
              <div className="text-center">
                <p className="text-sm font-medium">點擊上載韓國原文圖片</p>
                <p className="text-xs mt-1">支援 JPG / PNG / WebP，最大 10MB</p>
              </div>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-border bg-bg-secondary">
                <Image
                  src={previewUrl}
                  alt="原始圖片"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 text-xs px-3 py-2 rounded-lg border border-border hover:border-accent-rose text-text-secondary hover:text-accent-rose transition-colors"
                >
                  替換圖片
                </button>
                <button
                  onClick={handleReset}
                  className="text-xs px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {file && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-4 bg-accent-rose text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  翻譯中... (約 30 秒)
                </>
              ) : (
                <>
                  <ImagePlus className="w-4 h-4" />
                  開始 AI 翻譯
                </>
              )}
            </button>
          )}

          {error && (
            <div className="mt-3 flex items-start gap-2 bg-red-50 text-red-700 text-xs p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="bg-white rounded-xl border border-border-light p-6">
          <h2 className="text-base font-bold text-text-primary mb-4">
            翻譯結果
          </h2>

          {!result && !loading && (
            <div className="aspect-[3/4] rounded-xl border-2 border-dashed border-border flex items-center justify-center text-text-muted text-sm">
              翻譯結果會喺呢度顯示
            </div>
          )}

          {loading && (
            <div className="aspect-[3/4] rounded-xl border-2 border-dashed border-accent-rose/30 bg-accent-rose/5 flex flex-col items-center justify-center gap-3 text-accent-rose">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium">AI 正在識別文字並翻譯...</p>
            </div>
          )}

          {result && (
            <div className="space-y-3">
              <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-border bg-white">
                <Image
                  src={result.url}
                  alt="翻譯後圖片"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="text-xs text-text-muted bg-bg-secondary rounded-lg p-2.5">
                <span className="font-semibold">識別 {result.blockCount} 個文字區塊</span>
                {" · "}
                <span>{result.width} × {result.height}</span>
                {result.mode === "inline" && (
                  <span className="text-amber-600">
                    {" · 內聯模式（未設定 Vercel Blob）"}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-accent-blue text-white font-semibold text-sm py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  下載 PNG
                </button>
                {result.mode === "blob" && (
                  <button
                    onClick={handleCopy}
                    className="flex-1 border border-border text-text-primary font-semibold text-sm py-2.5 rounded-lg hover:border-accent-blue transition-colors flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        已複製
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        複製連結
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
