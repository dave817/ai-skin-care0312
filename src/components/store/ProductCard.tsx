"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/data/products";
import { formatPrice, calcDiscount } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);
  const hasDiscount = product.priceSale !== null;
  const discount = hasDiscount
    ? calcDiscount(product.priceOriginal, product.priceSale!)
    : 0;

  // Render star rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(product.rating);
    const hasHalf = product.rating - fullStars >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            className="w-3 h-3 fill-[#FFB800] text-[#FFB800]"
          />
        );
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <Star
            key={i}
            className="w-3 h-3 fill-[#FFB800]/50 text-[#FFB800]"
          />
        );
      } else {
        stars.push(
          <Star key={i} className="w-3 h-3 fill-transparent text-[#E0E0E0]" />
        );
      }
    }
    return stars;
  };

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
      <Link href={`/store/${product.slug}`} className="group block">
        {/* Image Container */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-bg-secondary mb-3">
          <Image
            src={product.imageUrl}
            alt={product.imageAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            {product.tags.includes("new") && (
              <span className="badge badge-new text-[10px]">新品</span>
            )}
            {product.tags.includes("bestseller") && (
              <span className="badge badge-bestseller text-[10px]">暢銷</span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setWishlisted(!wishlisted);
            }}
            className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            aria-label="加入願望清單"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                wishlisted
                  ? "fill-accent-red text-accent-red"
                  : "fill-transparent text-text-muted"
              }`}
            />
          </button>
        </div>

        {/* Product Info */}
        <div>
          {/* Brand */}
          <p className="text-text-muted text-[11px] tracking-[0.1em] uppercase mb-1 font-sans">
            {product.brand}
          </p>

          {/* Product Name */}
          <h4 className="text-text-primary text-[0.85rem] font-medium leading-snug line-clamp-2 mb-2 min-h-[2.4em] group-hover:text-accent-blue transition-colors duration-300">
            {product.nameZh}
          </h4>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-1.5">
            {hasDiscount && (
              <span className="font-mono text-xs text-text-muted line-through">
                {formatPrice(product.priceOriginal)}
              </span>
            )}
            {hasDiscount && (
              <span className="text-accent-red text-[0.8rem] font-bold">
                -{discount}%
              </span>
            )}
          </div>
          <div className="mb-2">
            <span className="font-mono text-[0.95rem] font-bold text-text-primary">
              {formatPrice(product.priceSale ?? product.priceOriginal)}
            </span>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">{renderStars()}</div>
            <span className="text-text-muted text-[11px]">
              ({product.reviewCount})
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
