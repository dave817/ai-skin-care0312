"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/data/products";
import { formatPrice, calcDiscount } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const hasDiscount = product.priceSale !== null;
  const discount = hasDiscount
    ? calcDiscount(product.priceOriginal, product.priceSale!)
    : 0;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 25 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            delay: index * 0.08,
            ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
          },
        },
      }}
    >
      <Link
        href={`/store/${product.slug}`}
        className="group block"
      >
        <div className="relative rounded-[18px] overflow-hidden bg-bg-tertiary border border-border-light/60 hover:border-accent-rose/20 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(193,124,106,0.08)]">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden bg-bg-secondary">
            <Image
              src={product.imageUrl}
              alt={product.imageAlt}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.tags.includes("new") && (
                <span className="badge badge-new text-[10px]">新品</span>
              )}
              {product.tags.includes("bestseller") && (
                <span className="badge badge-bestseller text-[10px]">暢銷</span>
              )}
              {hasDiscount && (
                <span className="badge badge-sale text-[10px]">-{discount}%</span>
              )}
            </div>

            {/* Quick add button — appears on hover */}
            <div className="absolute bottom-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // TODO: Add to cart
                }}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-accent-rose hover:text-white transition-colors duration-200"
                aria-label="加入購物車"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4 md:p-5">
            <p className="text-text-muted text-[11px] tracking-[0.12em] uppercase mb-1.5 font-sans">
              {product.brand}
            </p>
            <h4 className="text-text-primary text-[0.85rem] font-medium mb-3 leading-snug line-clamp-2 min-h-[2.5em] group-hover:text-accent-rose transition-colors duration-300">
              {product.nameZh}
            </h4>
            <div className="flex items-baseline gap-2.5">
              <span className="font-mono text-[0.9rem] font-semibold text-accent-rose">
                {formatPrice(product.priceSale ?? product.priceOriginal)}
              </span>
              {hasDiscount && (
                <span className="font-mono text-xs text-text-muted line-through">
                  {formatPrice(product.priceOriginal)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
