"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  X,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ScanFace,
  Shield,
  Truck,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HeroShader from "@/components/shaders/HeroShader";
import FadeIn from "@/components/motion/FadeIn";
import ProductCard from "@/components/store/ProductCard";
import MarqueeBanner from "@/components/ui/MarqueeBanner";
import HeroBanner from "@/components/home/HeroBanner";
import type { Product } from "@/data/products";
import type { BlogPost } from "@/data/blogs";

const categories = [
  { id: "skincare", label: "護膚", emoji: "🧴" },
  { id: "body-hair", label: "身體&頭髮", emoji: "💆" },
  { id: "makeup", label: "彩妝", emoji: "💄" },
  { id: "tools", label: "美容工具", emoji: "🪥" },
  { id: "food", label: "食品", emoji: "🍵" },
  { id: "home", label: "居家生活", emoji: "🏠" },
  { id: "health", label: "健康", emoji: "💊" },
  { id: "all", label: "全部", emoji: "🛍️" },
];

interface HomeClientProps {
  topProducts: Product[];
  newProducts: Product[];
  latestBlogs: BlogPost[];
}

export default function HomeClient({
  topProducts,
  newProducts,
  latestBlogs,
}: HomeClientProps) {
  const [showPromo, setShowPromo] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <section className="pt-6 pb-4 px-4 md:pt-8 md:pb-5">
        <div className="container-main max-w-2xl mx-auto">
          <FadeIn delay={0.1} direction="none">
            <form
              action="/store"
              className="relative"
              onSubmit={(e) => {
                if (!searchQuery.trim()) e.preventDefault();
              }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted/60 pointer-events-none" />
              <input
                type="text"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="請輸入您的搜索關鍵詞。"
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-[#F5F0EB] border border-border-light/60 text-text-primary text-[15px] placeholder:text-text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent-rose/30 focus:border-accent-rose/40 transition-all duration-300"
              />
            </form>
          </FadeIn>
        </div>
      </section>

      <AnimatePresence>
        {showPromo && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4"
          >
            <div className="container-main">
              <div className="relative rounded-2xl bg-[#E3F0FA] px-6 py-5 md:px-10 md:py-6 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden">
                <div className="absolute top-2 left-4 w-2 h-2 rounded-full bg-blue-300/40" />
                <div className="absolute bottom-3 right-16 w-3 h-3 rounded-full bg-blue-200/50" />
                <div className="text-center md:text-left">
                  <p className="text-[#2A6CB6] font-semibold text-lg md:text-xl font-serif">
                    領取優惠券！
                  </p>
                  <p className="text-[#4A8FD4] text-sm mt-1">
                    領取3-10%歡迎折扣券
                  </p>
                </div>
                <Link
                  href="/store"
                  className="inline-flex items-center gap-2 bg-[#2A6CB6] hover:bg-[#1F5A9E] text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors duration-300 whitespace-nowrap"
                >
                  領取全部並立即購物
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setShowPromo(false)}
                  className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full hover:bg-blue-200/50 transition-colors"
                  aria-label="關閉優惠橫幅"
                >
                  <X className="w-4 h-4 text-[#2A6CB6]" />
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <HeroBanner />

      <section className="py-6 md:py-8 px-4">
        <div className="container-main max-w-xl mx-auto">
          <FadeIn delay={0.15}>
            <div className="grid grid-cols-4 gap-x-4 gap-y-5 md:gap-x-8 md:gap-y-6">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={cat.id === "all" ? "/store" : `/store?category=${cat.id}`}
                  className="flex flex-col items-center gap-2 group"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#F5F0EB] border border-border-light/60 flex items-center justify-center text-2xl md:text-3xl group-hover:border-accent-rose/40 group-hover:bg-accent-rose/5 transition-all duration-300 group-hover:shadow-[0_4px_16px_rgba(193,124,106,0.1)]"
                  >
                    {cat.emoji}
                  </motion.div>
                  <span className="text-text-primary text-xs md:text-sm text-center leading-tight group-hover:text-accent-rose transition-colors duration-300">
                    {cat.label}
                  </span>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <div className="container-main">
        <div className="border-t border-border-light/40" />
      </div>

      {topProducts.length > 0 && (
        <section className="py-10 md:py-14 px-4">
          <div className="container-main">
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <FadeIn>
                <h2 className="font-serif text-text-primary text-xl md:text-2xl">
                  人氣熱賣
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <Link
                  href="/store"
                  className="flex items-center gap-1 text-sm text-text-muted hover:text-accent-rose transition-colors duration-300 group"
                >
                  查看全部
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </FadeIn>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {topProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 py-6 md:py-10">
        <div className="container-main">
          <FadeIn>
            <div className="relative rounded-[20px] overflow-hidden min-h-[200px] md:min-h-[240px]">
              <div className="absolute inset-0">
                <HeroShader />
              </div>
              <div
                className="absolute inset-0 z-[1]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(245,240,235,0.75) 0%, rgba(245,240,235,0.45) 50%, rgba(245,240,235,0.6) 100%)",
                }}
              />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-10 md:px-12 md:py-12">
                <div className="flex items-center gap-5 md:gap-6">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-accent-rose/10 flex items-center justify-center flex-shrink-0">
                    <ScanFace className="w-7 h-7 md:w-8 md:h-8 text-accent-rose" />
                  </div>
                  <div>
                    <h3 className="font-serif text-text-primary text-xl md:text-2xl mb-1.5">
                      AI 智能膚質分析
                    </h3>
                    <p className="text-text-secondary text-sm md:text-[15px] leading-relaxed">
                      上傳照片，即刻獲得專業膚質分析報告
                    </p>
                  </div>
                </div>
                <Link
                  href="/analyze"
                  className="inline-flex items-center gap-2.5 bg-accent-rose hover:bg-accent-rose/90 text-white font-medium text-sm md:text-base px-7 py-3 md:px-8 md:py-3.5 rounded-full transition-colors duration-300 whitespace-nowrap shadow-lg shadow-accent-rose/20"
                >
                  <Sparkles className="w-4 h-4" />
                  免費開始分析
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {newProducts.length > 0 && (
        <section className="py-10 md:py-14 px-4">
          <div className="container-main">
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <FadeIn>
                <h2 className="font-serif text-text-primary text-xl md:text-2xl">
                  新品上架
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <Link
                  href="/store"
                  className="flex items-center gap-1 text-sm text-text-muted hover:text-accent-rose transition-colors duration-300 group"
                >
                  查看全部
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </FadeIn>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {newProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="container-main">
        <div className="border-t border-border-light/40" />
      </div>

      {latestBlogs.length > 0 && (
        <section className="py-10 md:py-14 px-4">
          <div className="container-main">
            <div className="flex items-center justify-between mb-8 md:mb-10">
              <FadeIn>
                <h2 className="font-serif text-text-primary text-xl md:text-2xl">
                  美妝網誌
                </h2>
              </FadeIn>
              <FadeIn delay={0.1}>
                <Link
                  href="/blog"
                  className="flex items-center gap-1 text-sm text-text-muted hover:text-accent-rose transition-colors duration-300 group"
                >
                  查看更多
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </FadeIn>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
              {latestBlogs.map((blog, i) => (
                <FadeIn key={blog.id} delay={i * 0.1}>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="group block rounded-[16px] overflow-hidden bg-white border border-border-light/60 hover:border-accent-rose/20 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(193,124,106,0.08)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-bg-secondary">
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-4 md:p-5">
                      <h4 className="text-text-primary text-sm md:text-[15px] font-medium leading-snug line-clamp-2 mb-3 group-hover:text-accent-rose transition-colors duration-300 min-h-[2.6em]">
                        {blog.title}
                      </h4>
                      <p className="text-text-muted text-xs">{blog.date}</p>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      <MarqueeBanner
        items={[
          "COSRX",
          "Dear, Klairs",
          "Beauty of Joseon",
          "LANEIGE",
          "Isntree",
          "SKIN1004",
          "Illiyoon",
          "Anua",
          "Torriden",
          "mixsoon",
          "Round Lab",
          "Innisfree",
        ]}
        className="py-5 text-text-muted/30 text-[13px] tracking-[0.3em] uppercase font-sans border-y border-border-light/30"
        separator="·"
        speed={40}
      />

      <section className="py-8 md:py-10 px-4 bg-[#F5F0EB]">
        <div className="container-main">
          <FadeIn>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:gap-x-10 text-text-primary text-sm md:text-[15px]">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent-green" />
                正貨保證
              </span>
              <span className="text-border-light">·</span>
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-accent-green" />
                全港免運
              </span>
              <span className="text-border-light">·</span>
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-accent-green" />
                順豐速遞
              </span>
              <span className="text-border-light">·</span>
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-accent-green" />
                安全付款
              </span>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
