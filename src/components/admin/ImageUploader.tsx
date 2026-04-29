"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { Upload, Loader2, X, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label = "圖片",
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("請上載圖片檔案");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("圖片大小不可超過 10MB");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        contentType: file.type,
      });
      onChange(blob.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "上載失敗");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
        {label}
      </label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {value ? (
        <div className="relative w-full aspect-[3/4] max-w-[200px] rounded-xl overflow-hidden border border-border bg-bg-secondary group">
          <Image
            src={value}
            alt={label}
            fill
            className="object-cover"
            sizes="200px"
            unoptimized
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="absolute inset-x-2 bottom-2 bg-white/90 text-text-primary text-xs font-semibold py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {uploading ? "上載中..." : "替換"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full max-w-[200px] aspect-[3/4] rounded-xl border-2 border-dashed border-border hover:border-accent-rose/50 hover:bg-accent-rose/5 transition-colors flex flex-col items-center justify-center gap-2 text-text-muted"
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs">上載中...</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6" />
              <span className="text-xs">點擊上載</span>
              <span className="text-[10px]">JPG / PNG / WebP</span>
            </>
          )}
        </button>
      )}

      {/* Manual URL fallback */}
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="或直接貼上圖片連結"
        className="w-full mt-2 max-w-[400px] text-xs px-3 py-2 rounded-lg border border-border focus:outline-none focus:border-accent-rose"
      />

      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-xs text-red-700">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}
    </div>
  );
}
