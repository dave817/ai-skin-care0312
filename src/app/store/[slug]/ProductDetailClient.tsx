"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Star,
  ChevronRight,
} from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { formatPrice, calcDiscount } from "@/lib/utils";
import ProductCard from "@/components/store/ProductCard";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [isWished, setIsWished] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [detailImageLanguage, setDetailImageLanguage] = useState<"zh" | "kr">(
    () =>
      product.descriptionImagesZh && product.descriptionImagesZh.length > 0
        ? "zh"
        : "kr",
  );

  const hasDiscount = product.priceSale !== null;
  const discount = hasDiscount
    ? calcDiscount(product.priceOriginal, product.priceSale!)
    : 0;
  const likesCount = product.reviewCount + Math.floor(product.rating * 10);

  const handleAddToCart = () => {
    addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <main className="min-h-screen bg-bg-primary pb-24">
      <div className="sticky top-0 z-30 bg-bg-primary/95 backdrop-blur-sm border-b border-border-light">
        <div className="container-main flex items-center justify-between h-12">
          <Link
            href="/store"
            className="flex items-center gap-1 text-text-primary hover:text-accent-blue transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsWished(!isWished)}
              className="p-1 transition-colors"
              aria-label="收藏"
            >
              <Heart
                className={`w-5 h-5 ${
                  isWished ? "fill-accent-red text-accent-red" : "text-text-secondary"
                }`}
              />
            </button>
            <Link href="/cart" className="p-1" aria-label="購物車">
              <ShoppingBag className="w-5 h-5 text-text-secondary" />
            </Link>
          </div>
        </div>
      </div>

      <div className="lg:container-main lg:grid lg:grid-cols-2 lg:gap-10 lg:pt-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative aspect-square bg-bg-secondary lg:rounded-2xl lg:overflow-hidden"
        >
          <Image
            src={product.imageUrl}
            alt={product.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {product.tags.includes("new") && (
              <span className="badge badge-new">新品</span>
            )}
            {product.tags.includes("bestseller") && (
              <span className="badge badge-bestseller">暢銷</span>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="px-4 pt-5 lg:px-0 lg:pt-0"
        >
          <div className="flex items-center gap-1.5 mb-3">
            <Heart className="w-3.5 h-3.5 fill-accent-red text-accent-red" />
            <span className="text-xs text-text-muted">
              {likesCount} 位用戶按讚
            </span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-muted tracking-wide uppercase font-sans">
              {product.brand}
            </span>
            <div className="flex items-center gap-1.5">
              <StarRating rating={product.rating} />
              <span className="text-xs text-text-muted">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          <h1 className="text-xl font-bold text-text-primary leading-tight mb-1">
            {product.nameZh}
          </h1>
          <p className="text-xs text-text-muted mb-4">{product.nameEn}</p>
          <p className="text-sm text-text-secondary mb-4">{product.volume}</p>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-bold text-text-primary font-mono">
              {formatPrice(product.priceSale ?? product.priceOriginal)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-sm text-text-muted line-through font-mono">
                  {formatPrice(product.priceOriginal)}
                </span>
                <span className="text-sm font-bold text-accent-red">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {product.skinConcerns.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.skinConcerns.map((concern) => (
                <span
                  key={concern}
                  className="px-3 py-1 bg-bg-secondary rounded-full text-xs text-text-secondary"
                >
                  {concern}
                </span>
              ))}
            </div>
          )}

          <div className="hidden lg:block mb-8">
            <button onClick={handleAddToCart} className="btn-add-cart">
              <ShoppingBag className="w-5 h-5" />
              {addedToCart ? "已加入購物車" : "加入購物車"}
            </button>
          </div>

          <div className="border-t border-border-light my-6" />

          <div className="mb-6">
            <h2 className="text-base font-bold text-text-primary mb-3">
              商品詳情
            </h2>
            <div
              className="text-sm text-text-secondary leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.descriptionZh }}
            />

            {/* Long detail images: Chinese by default, Korean originals still available */}
            {(() => {
              const zhImages = product.descriptionImagesZh ?? [];
              const krImages = product.descriptionImagesKr ?? [];
              const hasZh = zhImages.length > 0;
              const hasKr = krImages.length > 0;
              const canToggle = hasZh && hasKr;
              const images =
                detailImageLanguage === "zh" && hasZh ? zhImages : krImages;
              if (images.length === 0) return null;
              return (
                <div className="mt-6 space-y-2">
                  {canToggle ? (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-border-light bg-bg-secondary p-1">
                      {[
                        { value: "zh" as const, label: "繁體中文" },
                        { value: "kr" as const, label: "韓文原圖" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setDetailImageLanguage(option.value)}
                          className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                            detailImageLanguage === option.value
                              ? "bg-white text-text-primary shadow-sm"
                              : "text-text-muted hover:text-text-primary"
                          }`}
                          aria-pressed={detailImageLanguage === option.value}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    !hasZh &&
                    hasKr && (
                      <div className="text-[11px] text-text-muted bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-2">
                        原廠韓文詳情圖，繁體中文版本製作中。
                      </div>
                    )
                  )}
                  {images.map((src, i) => (
                    <Image
                      key={`${src}-${i}`}
                      src={src}
                      alt={`${product.nameZh} 詳細介紹 ${i + 1}`}
                      width={1000}
                      height={1500}
                      className="w-full h-auto rounded-lg bg-bg-secondary"
                      unoptimized
                    />
                  ))}
                </div>
              );
            })()}
          </div>

          <div className="space-y-0">
            {[
              { label: "成分資訊", content: "請參閱產品包裝上的成分列表。" },
              { label: "使用方法", content: "依照產品包裝上的說明使用。" },
              {
                label: "配送說明",
                content: "香港地區滿 HK$300 免費配送，一般 2-4 個工作天送達。",
              },
            ].map((section) => (
              <details key={section.label} className="group border-t border-border-light">
                <summary className="flex items-center justify-between py-4 cursor-pointer list-none">
                  <span className="text-sm font-medium text-text-primary">
                    {section.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-text-muted transition-transform group-open:rotate-90" />
                </summary>
                <p className="text-sm text-text-secondary pb-4 leading-relaxed">
                  {section.content}
                </p>
              </details>
            ))}
          </div>

          <div className="border-t border-border-light my-6" />

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-text-primary">顧客評價</h2>
              <span className="text-xs text-text-muted">
                {product.reviewCount} 則評價
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-text-primary font-mono">
                {product.rating.toFixed(1)}
              </span>
              <div>
                <StarRating rating={product.rating} />
                <p className="text-xs text-text-muted mt-0.5">
                  共 {product.reviewCount} 則評價
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-bg-secondary rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={5} />
                  <span className="text-xs text-text-muted">用戶</span>
                </div>
                <p className="text-sm text-text-secondary">
                  非常好用，質感很好，會回購！
                </p>
              </div>
              <div className="bg-bg-secondary rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={4} />
                  <span className="text-xs text-text-muted">用戶</span>
                </div>
                <p className="text-sm text-text-secondary">
                  性價比很高，用了一段時間效果不錯。
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="container-main mt-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-text-primary">推薦商品</h2>
            <Link
              href={`/store?category=${product.category}`}
              className="flex items-center gap-0.5 text-sm text-text-muted hover:text-accent-blue transition-colors"
            >
              查看更多
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <motion.div
              className="flex gap-3 w-max"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } },
              }}
            >
              {relatedProducts.map((rp, i) => (
                <div key={rp.id} className="w-[160px] md:w-[200px] flex-shrink-0">
                  <ProductCard product={rp} index={i} />
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-border-light px-4 py-3 safe-area-bottom">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-text-muted line-through font-mono">
              {hasDiscount ? formatPrice(product.priceOriginal) : ""}
            </p>
            <p className="text-lg font-bold text-text-primary font-mono">
              {formatPrice(product.priceSale ?? product.priceOriginal)}
            </p>
          </div>
          <button onClick={handleAddToCart} className="flex-1 btn-add-cart">
            <ShoppingBag className="w-5 h-5" />
            {addedToCart ? "已加入" : "加入購物車"}
          </button>
        </div>
      </div>
    </main>
  );
}
