"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  X,
  ScanFace,
  ArrowLeft,
  ShoppingBag,
  Sun,
  Moon,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Info,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { allProducts, Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { formatPrice, calcDiscount } from "@/lib/utils";
import { getOrCreateDeviceId } from "@/lib/device-id";

/* ─── Image compression (keeps upload under Vercel 4.5MB limit) ── */

function compressImage(file: File, maxDim = 1200, quality = 0.75): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Compression failed"));
          resolve(new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" }));
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

/* ─── Types ─────────────────────────────────────────────────── */

type AnalysisState = "upload" | "analyzing" | "results";

interface SkinConcern {
  name: string;
  score: number;
  level: string;
  description: string;
  detailedExplanation?: string;
  recommendedProductIds?: string[];
}

interface RoutineStep {
  step: string;
  productIds: string[];
}

interface QuotaInfo {
  remaining: number;
  limit: number;
  resetAt: string;
  bypassed?: boolean;
}

interface AnalysisResult {
  overallScore: number;
  skinType: string;
  concerns: SkinConcern[];
  summary: string;
  morningRoutine: RoutineStep[];
  nightRoutine: RoutineStep[];
  warnings: string[];
  quota?: QuotaInfo;
}

function findProduct(id: string): Product | null {
  const p = allProducts.find((p) => p.id === id);
  return p && p.active ? p : null;
}

function resolveProducts(ids: string[] | undefined): Product[] {
  if (!ids?.length) return [];
  return ids.map(findProduct).filter((p): p is Product => p !== null);
}

type FaceKey = "front" | "left" | "right";

const faceLabels: Record<FaceKey, { label: string; desc: string }> = {
  left: { label: "左側", desc: "請向右轉頭" },
  front: { label: "正面", desc: "請正面面對鏡頭" },
  right: { label: "右側", desc: "請向左轉頭" },
};

const faceOrder: FaceKey[] = ["left", "front", "right"];

/* ─── Helper: score colour ──────────────────────────────────── */

function scoreColor(score: number): string {
  if (score >= 70) return "var(--accent-green)";
  if (score >= 50) return "#E9A23B";
  return "var(--accent-red)";
}

function levelBadgeStyle(level: string) {
  switch (level) {
    case "良好":
      return "bg-[rgba(76,175,80,0.12)] text-[#2E7D32]";
    case "輕度":
      return "bg-[rgba(76,175,80,0.12)] text-[#2E7D32]";
    case "中度":
      return "bg-[rgba(233,162,59,0.12)] text-[#B8860B]";
    case "偏低":
      return "bg-[rgba(233,162,59,0.12)] text-[#B8860B]";
    case "偏高":
      return "bg-[rgba(229,57,53,0.12)] text-[#C62828]";
    case "嚴重":
      return "bg-[rgba(229,57,53,0.12)] text-[#C62828]";
    default:
      return "bg-bg-secondary text-text-secondary";
  }
}

/* ─── Score Circle Component ────────────────────────────────── */

function ScoreCircle({
  score,
  animate,
}: {
  score: number;
  animate: boolean;
}) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div className="relative w-[200px] h-[200px] mx-auto">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full -rotate-90"
      >
        {/* Background track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="10"
        />
        {/* Score arc */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={
            animate
              ? { strokeDashoffset: offset }
              : { strokeDashoffset: circumference }
          }
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      {/* Score text in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-bold font-mono"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={
            animate
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.5 }
          }
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {score}
        </motion.span>
        <motion.span
          className="text-text-muted text-sm mt-1"
          initial={{ opacity: 0 }}
          animate={animate ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.2 }}
        >
          / 100
        </motion.span>
      </div>
    </div>
  );
}

/* ─── Concern Bar Component ─────────────────────────────────── */

function ConcernBar({
  concern,
  index,
}: {
  concern: SkinConcern;
  index: number;
}) {
  const color = scoreColor(concern.score);

  return (
    <motion.div
      className="rounded-xl border border-border p-5"
      style={{ backgroundColor: "var(--bg-primary)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 * index + 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-text-primary">
          {concern.name}
        </h4>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${levelBadgeStyle(
            concern.level
          )}`}
        >
          {concern.level}
        </span>
      </div>

      {/* Score bar */}
      <div className="relative w-full h-2 rounded-full bg-bg-secondary mb-3 overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${concern.score}%` }}
          transition={{
            duration: 1,
            ease: "easeOut",
            delay: 0.15 * index + 0.7,
          }}
        />
      </div>

      {/* Score label */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-mono font-bold"
          style={{ color }}
        >
          {concern.score}/100
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-text-secondary leading-relaxed">
        {concern.description}
      </p>
    </motion.div>
  );
}

/* ─── Concern Detail Section (with explanation + product recs) ─ */

function ConcernDetail({
  concern,
  index,
}: {
  concern: SkinConcern;
  index: number;
}) {
  const products = resolveProducts(concern.recommendedProductIds);
  const color = scoreColor(concern.score);
  const hasExtras =
    (concern.detailedExplanation && concern.detailedExplanation.length > 0) ||
    products.length > 0;
  if (!hasExtras) return null;

  return (
    <motion.div
      className="rounded-2xl border border-border bg-bg-primary overflow-hidden mb-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index + 0.4 }}
    >
      {/* Header strip */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <span
          className="font-mono text-xs font-bold px-2 py-1 rounded"
          style={{ backgroundColor: `${color}1a`, color }}
        >
          {concern.score}
        </span>
        <h3 className="text-base font-semibold text-text-primary">
          {concern.name}
        </h3>
        <span
          className={`ml-auto text-[11px] font-semibold px-2.5 py-1 rounded-full ${levelBadgeStyle(
            concern.level
          )}`}
        >
          {concern.level}
        </span>
      </div>

      {/* Explanation */}
      {concern.detailedExplanation && (
        <div className="px-5 pt-4 pb-2">
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
            {concern.detailedExplanation}
          </p>
        </div>
      )}

      {/* Recommended products */}
      {products.length > 0 && (
        <div className="px-5 pb-5 pt-3">
          <p className="text-xs font-semibold text-text-muted tracking-wider uppercase mb-3">
            針對「{concern.name}」嘅推薦
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {products.map((product, i) => (
              <RecommendedProductCard
                key={product.id}
                product={product}
                index={i}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Routine Step with Products ───────────────────────────── */

function RoutineStepRow({
  step,
  index,
  accent,
}: {
  step: RoutineStep;
  index: number;
  accent: { bg: string; fg: string };
}) {
  const products = resolveProducts(step.productIds);

  return (
    <motion.li
      className="flex flex-col gap-2.5"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + index * 0.06 }}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center mt-0.5"
          style={{ backgroundColor: accent.bg, color: accent.fg }}
        >
          {index + 1}
        </span>
        <span className="text-sm text-text-primary leading-relaxed font-medium">
          {step.step}
        </span>
      </div>
      {products.length > 0 && (
        <div className="ml-9 flex flex-wrap gap-2">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/store/${p.slug}`}
              className="inline-flex items-center gap-2 bg-white border border-border rounded-full pl-1 pr-3 py-1 hover:border-accent-blue transition-colors group"
            >
              <span className="relative w-7 h-7 rounded-full overflow-hidden bg-bg-secondary flex-shrink-0">
                <Image
                  src={p.imageUrl}
                  alt={p.imageAlt}
                  fill
                  className="object-cover"
                  sizes="28px"
                />
              </span>
              <span className="text-[11px] font-medium text-text-secondary group-hover:text-accent-blue line-clamp-1 max-w-[140px]">
                {p.brand}・{p.nameZh}
              </span>
            </Link>
          ))}
        </div>
      )}
    </motion.li>
  );
}

/* ─── Recommended Product Card ──────────────────────────────── */

function RecommendedProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const hasDiscount = product.priceSale !== null;
  const discount = hasDiscount
    ? calcDiscount(product.priceOriginal, product.priceSale!)
    : 0;

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      className="rounded-xl border border-border overflow-hidden bg-bg-primary"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.1 + 0.3 }}
    >
      {/* Image */}
      <Link href={`/store/${product.slug}`}>
        <div className="relative aspect-square bg-bg-secondary">
          <Image
            src={product.imageUrl}
            alt={product.imageAlt}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {hasDiscount && (
            <span className="absolute top-2.5 left-2.5 badge badge-sale text-[10px]">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-text-muted text-[11px] tracking-[0.08em] uppercase mb-1 font-sans">
          {product.brand}
        </p>
        <Link href={`/store/${product.slug}`}>
          <h4 className="text-text-primary text-sm font-medium leading-snug line-clamp-2 mb-2 min-h-[2.6em] hover:text-accent-blue transition-colors">
            {product.nameZh}
          </h4>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-mono text-[0.95rem] font-bold text-text-primary">
            {formatPrice(product.priceSale ?? product.priceOriginal)}
          </span>
          {hasDiscount && (
            <span className="font-mono text-xs text-text-muted line-through">
              {formatPrice(product.priceOriginal)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={added}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
            added
              ? "bg-accent-green text-white"
              : "bg-accent-blue text-white hover:bg-accent-blue-dark"
          }`}
        >
          {added ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              已加入
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              加入購物車
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Analyzing Dots ────────────────────────────────────────── */

function AnalyzingDots() {
  return (
    <span className="inline-flex gap-1 ml-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block w-1.5 h-1.5 rounded-full bg-accent-blue"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

/* ─── Main Page Component ───────────────────────────────────── */

export default function AnalyzePage() {
  const [state, setState] = useState<AnalysisState>("upload");
  const [photos, setPhotos] = useState<Record<FaceKey, File | null>>({
    front: null,
    left: null,
    right: null,
  });
  const [previews, setPreviews] = useState<Record<FaceKey, string | null>>({
    front: null,
    left: null,
    right: null,
  });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRefs: Record<FaceKey, React.RefObject<HTMLInputElement | null>> = {
    front: useRef<HTMLInputElement>(null),
    left: useRef<HTMLInputElement>(null),
    right: useRef<HTMLInputElement>(null),
  };

  /* File handling */
  const handleFileSelect = useCallback(
    async (key: FaceKey, file: File | null) => {
      if (!file) return;

      // Validate it's an image
      if (!file.type.startsWith("image/")) {
        setError("請上傳圖片檔案");
        return;
      }

      // Validate size (max 20MB raw — will be compressed)
      if (file.size > 20 * 1024 * 1024) {
        setError("圖片大小不可超過 20MB");
        return;
      }

      setError(null);

      // Compress to keep under Vercel 4.5MB body limit
      let compressed: File;
      try {
        compressed = await compressImage(file, 1200, 0.75);
      } catch {
        compressed = file; // fallback to original if compression fails
      }

      setPhotos((prev) => ({ ...prev, [key]: compressed }));

      // Create preview URL
      const url = URL.createObjectURL(compressed);
      setPreviews((prev) => {
        // Revoke previous URL to prevent memory leaks
        if (prev[key]) URL.revokeObjectURL(prev[key]!);
        return { ...prev, [key]: url };
      });
    },
    []
  );

  const handleRemovePhoto = useCallback((key: FaceKey) => {
    setPhotos((prev) => ({ ...prev, [key]: null }));
    setPreviews((prev) => {
      if (prev[key]) URL.revokeObjectURL(prev[key]!);
      return { ...prev, [key]: null };
    });
    // Reset file input
    if (fileInputRefs[key].current) {
      fileInputRefs[key].current!.value = "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = useCallback(
    (key: FaceKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      handleFileSelect(key, file);
    },
    [handleFileSelect]
  );

  const handleZoneClick = useCallback(
    (key: FaceKey) => () => {
      fileInputRefs[key].current?.click();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  /* Drag & Drop */
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
    []
  );

  const handleDrop = useCallback(
    (key: FaceKey) => (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0] ?? null;
      handleFileSelect(key, file);
    },
    [handleFileSelect]
  );

  /* Submit for analysis */
  const canSubmit = photos.front !== null;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setError(null);
    setState("analyzing");

    try {
      const formData = new FormData();
      formData.append("deviceId", getOrCreateDeviceId());

      for (const key of faceOrder) {
        if (photos[key]) {
          formData.append(key, photos[key]!);
        }
      }

      const res = await fetch("/api/analyze-skin", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (res.status === 429 && data?.quota?.resetAt) {
          const resetDate = new Date(data.quota.resetAt);
          throw new Error(
            data.error ||
              `今日分析次數已用完（${resetDate.toLocaleString("zh-HK")} 後重置）`
          );
        }
        throw new Error(
          data?.error || `分析失敗 (HTTP ${res.status})，請重試`
        );
      }

      // Validate required fields
      if (
        typeof data?.overallScore !== "number" ||
        !data?.skinType ||
        !Array.isArray(data?.concerns)
      ) {
        throw new Error("AI 分析結果格式不正確，請重試");
      }

      setResult(data as AnalysisResult);
      setState("results");
    } catch (err: unknown) {
      console.error("Analysis error:", err);
      const message =
        err instanceof Error ? err.message : "分析過程中發生未知錯誤";
      setError(message);
      setState("upload");
    }
  };

  /* Reset */
  const handleReset = useCallback(() => {
    setState("upload");
    setResult(null);
    setError(null);
    // Don't clear photos so user can re-analyze easily
  }, []);

  const handleFullReset = useCallback(() => {
    setState("upload");
    setResult(null);
    setError(null);

    // Revoke all preview URLs
    for (const key of faceOrder) {
      if (previews[key]) URL.revokeObjectURL(previews[key]!);
    }

    setPhotos({ front: null, left: null, right: null });
    setPreviews({ front: null, left: null, right: null });

    // Reset file inputs
    for (const key of faceOrder) {
      if (fileInputRefs[key].current) {
        fileInputRefs[key].current!.value = "";
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previews]);

  /* Aggregate all recommended products from concerns + routines (deduped) */
  const allRecommendedProducts: Product[] = result
    ? (() => {
        const seen = new Set<string>();
        const out: Product[] = [];
        const collect = (ids: string[] | undefined) => {
          if (!ids) return;
          for (const id of ids) {
            if (seen.has(id)) continue;
            seen.add(id);
            const p = findProduct(id);
            if (p) out.push(p);
          }
        };
        result.concerns.forEach((c) => collect(c.recommendedProductIds));
        result.morningRoutine.forEach((s) => collect(s.productIds));
        result.nightRoutine.forEach((s) => collect(s.productIds));
        return out;
      })()
    : [];

  /* Cleanup preview URLs on unmount */
  useEffect(() => {
    return () => {
      for (const key of faceOrder) {
        if (previews[key]) URL.revokeObjectURL(previews[key]!);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      <AnimatePresence mode="wait">
        {/* ──────────────────────── UPLOAD STATE ──────────────────────── */}
        {state === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="container-main section-spacing"
          >
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 bg-accent-blue/10 text-accent-blue px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                  <Sparkles className="w-4 h-4" />
                  AI 驅動分析
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  AI 智能膚質分析
                </h1>
                <p className="text-text-secondary text-base md:text-lg leading-relaxed">
                  上傳三張面部照片，AI 即時為你分析膚質狀況，
                  <br className="hidden md:block" />
                  並推薦最適合你的護膚產品
                </p>
              </motion.div>
            </div>

            {/* Upload Zones */}
            <div className="max-w-4xl mx-auto mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                {faceOrder.map((key, i) => {
                  const info = faceLabels[key];
                  const hasPhoto = previews[key] !== null;
                  const isFront = key === "front";

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.45, delay: i * 0.12 }}
                    >
                      <div className="text-center mb-2">
                        <span className="text-sm font-semibold text-text-primary">
                          {info.label}
                        </span>
                        {isFront && (
                          <span className="ml-1.5 text-[11px] text-accent-red font-medium">
                            *必須
                          </span>
                        )}
                      </div>

                      {/* Hidden file input — no capture attr so mobile shows both camera + library */}
                      <input
                        ref={fileInputRefs[key]}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleInputChange(key)}
                      />

                      {/* Upload zone */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={!hasPhoto ? handleZoneClick(key) : undefined}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop(key)}
                        onKeyDown={(e) => {
                          if (
                            !hasPhoto &&
                            (e.key === "Enter" || e.key === " ")
                          ) {
                            handleZoneClick(key)();
                          }
                        }}
                        className={`relative aspect-[3/4] rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
                          hasPhoto
                            ? "border-accent-blue bg-bg-secondary"
                            : "border-border hover:border-accent-blue/50 hover:bg-bg-secondary/50 cursor-pointer"
                        }`}
                        aria-label={`上傳${info.label}照片`}
                      >
                        {hasPhoto ? (
                          /* Preview */
                          <>
                            <Image
                              src={previews[key]!}
                              alt={`${info.label}照片`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            {/* Remove button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePhoto(key);
                              }}
                              className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
                              aria-label="移除照片"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            {/* Replace overlay */}
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                handleZoneClick(key)();
                              }}
                              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 flex items-end justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <span className="text-white text-xs font-medium flex items-center gap-1">
                                <Camera className="w-3.5 h-3.5" />
                                重新拍攝
                              </span>
                            </div>
                            {/* Check mark */}
                            <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-accent-green flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          </>
                        ) : (
                          /* Empty state */
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                            {/* Face silhouette placeholder */}
                            <div className="w-16 h-16 rounded-full border-2 border-border-light flex items-center justify-center mb-3">
                              <Camera className="w-7 h-7 text-text-muted" />
                            </div>
                            <p className="text-text-muted text-xs mb-1.5">
                              {info.desc}
                            </p>
                            <p className="text-text-muted/60 text-[11px]">
                              點擊上傳或拖放圖片
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Instructions */}
            <motion.div
              className="max-w-xl mx-auto mb-8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="bg-bg-secondary rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-accent-blue" />
                  <span className="text-sm font-semibold text-text-primary">
                    拍攝建議
                  </span>
                </div>
                <ul className="space-y-2">
                  {[
                    "請在光線充足的環境下拍攝",
                    "避免使用濾鏡或美顏效果",
                    "建議素顏或淡妝拍攝",
                  ].map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-accent-blue flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-xl mx-auto mb-6"
                >
                  <div className="flex items-center gap-3 bg-[rgba(229,57,53,0.08)] border border-accent-red/20 rounded-xl px-5 py-3.5">
                    <AlertTriangle className="w-5 h-5 text-accent-red flex-shrink-0" />
                    <p className="text-sm text-accent-red">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`inline-flex items-center gap-2.5 px-10 py-3.5 rounded-full text-base font-semibold transition-all duration-200 ${
                  canSubmit
                    ? "bg-accent-blue text-white hover:bg-accent-blue-dark hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    : "bg-bg-secondary text-text-muted cursor-not-allowed"
                }`}
              >
                <ScanFace className="w-5 h-5" />
                開始分析
              </button>
              {!canSubmit && (
                <p className="text-text-muted text-xs mt-3">
                  請至少上傳正面照片以開始分析
                </p>
              )}
            </motion.div>

            {/* Disclaimers */}
            <div className="text-center space-y-1.5 max-w-lg mx-auto">
              <p className="text-[11px] text-text-muted flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-3 h-3" />
                AI 分析僅供參考，不構成醫療建議
              </p>
              <p className="text-[11px] text-text-muted">
                照片不會被儲存，分析後即時刪除
              </p>
            </div>
          </motion.div>
        )}

        {/* ──────────────────────── ANALYZING STATE ──────────────────────── */}
        {state === "analyzing" && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="min-h-[80vh] flex items-center justify-center"
          >
            <div className="text-center px-6">
              {/* Pulsing icon */}
              <motion.div
                className="w-24 h-24 rounded-full bg-accent-blue/10 flex items-center justify-center mx-auto mb-8"
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(74,159,229,0.2)",
                    "0 0 0 20px rgba(74,159,229,0)",
                    "0 0 0 0 rgba(74,159,229,0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <ScanFace className="w-12 h-12 text-accent-blue" />
                </motion.div>
              </motion.div>

              <h2 className="text-xl font-bold text-text-primary mb-3">
                AI 正在分析您的膚質
                <AnalyzingDots />
              </h2>

              <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">
                正在對您的面部照片進行深度分析，<br />
                這通常需要 5 至 10 秒
              </p>

              {/* Progress bar */}
              <div className="w-64 h-1.5 bg-bg-secondary rounded-full mx-auto overflow-hidden">
                <motion.div
                  className="h-full bg-accent-blue rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 8,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Cancel hint */}
              <p className="text-[11px] text-text-muted mt-8">
                分析過程中請勿關閉頁面
              </p>
            </div>
          </motion.div>
        )}

        {/* ──────────────────────── RESULTS STATE ──────────────────────── */}
        {state === "results" && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="container-main section-spacing"
          >
            {/* Top actions */}
            <div className="flex items-center justify-between mb-10">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-blue transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                返回上傳
              </button>
              <button
                onClick={handleFullReset}
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-blue transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                重新分析
              </button>
            </div>

            {/* Report Header */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                膚質分析報告
              </h1>
              <p className="text-text-muted text-sm">
                以下是根據您的面部照片生成的 AI 分析結果
              </p>
              {result.quota && !result.quota.bypassed && (
                <div className="mt-4 inline-flex items-center gap-2 bg-bg-secondary text-text-secondary px-3 py-1.5 rounded-full text-xs font-medium">
                  <Info className="w-3.5 h-3.5" />
                  今日剩餘 {result.quota.remaining}/{result.quota.limit} 次分析
                </div>
              )}
            </motion.div>

            {/* Score & Skin Type */}
            <motion.div
              className="max-w-md mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="bg-bg-secondary rounded-2xl p-8 text-center">
                <p className="text-sm text-text-muted mb-4 font-medium">
                  整體膚質評分
                </p>
                <ScoreCircle score={result.overallScore} animate={true} />
                <motion.div
                  className="mt-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  <span className="inline-flex items-center gap-1.5 bg-accent-blue/10 text-accent-blue px-4 py-1.5 rounded-full text-sm font-semibold">
                    {result.skinType}
                  </span>
                </motion.div>
              </div>
            </motion.div>

            {/* Summary */}
            <motion.div
              className="max-w-2xl mx-auto mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-bg-primary border border-border rounded-xl p-6">
                <h3 className="text-base font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-blue" />
                  分析摘要
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {result.summary}
                </p>
              </div>
            </motion.div>

            {/* Concerns Grid (compact metrics) */}
            <div className="max-w-4xl mx-auto mb-12">
              <motion.h2
                className="text-lg md:text-xl font-bold text-text-primary mb-6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                膚質指標
              </motion.h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.concerns.map((concern, i) => (
                  <ConcernBar key={concern.name} concern={concern} index={i} />
                ))}
              </div>
            </div>

            {/* Per-Concern Detailed Analysis + Product Recommendations */}
            {result.concerns.some(
              (c) =>
                (c.detailedExplanation && c.detailedExplanation.length > 0) ||
                (c.recommendedProductIds && c.recommendedProductIds.length > 0)
            ) && (
              <div className="max-w-4xl mx-auto mb-16">
                <motion.div
                  className="flex items-center gap-2.5 mb-6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <Sparkles className="w-5 h-5 text-accent-blue" />
                  <h2 className="text-lg md:text-xl font-bold text-text-primary">
                    深入分析及對症推薦
                  </h2>
                </motion.div>
                <div>
                  {result.concerns.map((concern, i) => (
                    <ConcernDetail
                      key={`detail-${concern.name}`}
                      concern={concern}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Skincare Routines */}
            <div className="max-w-4xl mx-auto mb-16">
              <motion.h2
                className="text-lg md:text-xl font-bold text-text-primary mb-6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                護膚建議
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Morning Routine */}
                <motion.div
                  className="bg-bg-secondary rounded-xl p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-9 h-9 rounded-full bg-[#FFF3E0] flex items-center justify-center">
                      <Sun className="w-5 h-5 text-[#F57C00]" />
                    </div>
                    <h3 className="text-base font-semibold text-text-primary">
                      早晨護膚程序
                    </h3>
                  </div>
                  <ol className="space-y-4">
                    {result.morningRoutine.map((step, i) => (
                      <RoutineStepRow
                        key={`morning-${i}`}
                        step={step}
                        index={i}
                        accent={{ bg: "#FFF3E0", fg: "#F57C00" }}
                      />
                    ))}
                  </ol>
                </motion.div>

                {/* Night Routine */}
                <motion.div
                  className="bg-bg-secondary rounded-xl p-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-9 h-9 rounded-full bg-[#E8EAF6] flex items-center justify-center">
                      <Moon className="w-5 h-5 text-[#5C6BC0]" />
                    </div>
                    <h3 className="text-base font-semibold text-text-primary">
                      晚間護膚程序
                    </h3>
                  </div>
                  <ol className="space-y-4">
                    {result.nightRoutine.map((step, i) => (
                      <RoutineStepRow
                        key={`night-${i}`}
                        step={step}
                        index={i}
                        accent={{ bg: "#E8EAF6", fg: "#5C6BC0" }}
                      />
                    ))}
                  </ol>
                </motion.div>
              </div>
            </div>

            {/* All Recommended Products (deduped from concerns + routines) */}
            {allRecommendedProducts.length > 0 && (
              <div className="max-w-5xl mx-auto mb-16">
                <motion.div
                  className="flex items-center justify-between mb-6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <h2 className="text-lg md:text-xl font-bold text-text-primary">
                    全部推薦商品
                  </h2>
                  <Link
                    href="/store"
                    className="text-sm text-accent-blue hover:text-accent-blue-dark flex items-center gap-1 transition-colors"
                  >
                    瀏覽全部商品
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {allRecommendedProducts.map((product, i) => (
                    <RecommendedProductCard
                      key={product.id}
                      product={product}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Warnings / Disclaimer */}
            <motion.div
              className="max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="bg-[rgba(233,162,59,0.06)] border border-[rgba(233,162,59,0.2)] rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#E9A23B] flex-shrink-0 mt-0.5" />
                  <div className="space-y-1.5">
                    {result.warnings && result.warnings.length > 0 ? (
                      result.warnings.map((w, i) => (
                        <p
                          key={i}
                          className="text-sm text-text-secondary leading-relaxed"
                        >
                          {w}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm text-text-secondary leading-relaxed">
                        AI 分析僅供參考，不構成醫療建議。如有嚴重皮膚問題，請諮詢專業皮膚科醫生。
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleFullReset}
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  重新分析
                </button>
                <Link
                  href="/store"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  瀏覽更多產品
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
