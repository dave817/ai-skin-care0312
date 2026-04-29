"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";
import type { BlogPost } from "@/data/blogs";
import { useCart } from "@/lib/cart-context";
import { formatPrice, calcDiscount } from "@/lib/utils";

interface BlogDetailClientProps {
  blog: BlogPost;
  relatedProducts: Product[];
}

export default function BlogDetailClient({ blog, relatedProducts }: BlogDetailClientProps) {
  const { addItem } = useCart();

  return (
    <div className="bg-white min-h-screen">
      <div className="container-main py-6 md:py-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-accent-blue text-[0.9rem] transition-colors mb-6 md:mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          返回網誌
        </Link>

        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-bg-secondary mb-6 md:mb-8">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 900px"
            priority
          />
        </div>

        <article className="max-w-3xl mx-auto">
          <h1 className="text-[1.5rem] md:text-[2rem] font-bold text-text-primary leading-snug mb-4">
            {blog.title}
          </h1>

          <div className="flex items-center gap-3 mb-8 md:mb-10">
            <span className="text-text-muted text-[0.85rem]">{blog.date}</span>
            <span className="text-text-muted text-[0.85rem]">·</span>
            <span className="text-text-secondary text-[0.85rem] font-medium">
              {blog.author}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-[0.75rem] font-medium rounded-full bg-bg-secondary text-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {relatedProducts.length > 0 && (
          <section className="mt-14 md:mt-20">
            <h2 className="text-[1.3rem] md:text-[1.5rem] font-bold text-text-primary mb-6 md:mb-8">
              推薦商品
            </h2>

            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {relatedProducts.map((product) => {
                const hasDiscount = product.priceSale !== null;
                const discount = hasDiscount
                  ? calcDiscount(product.priceOriginal, product.priceSale!)
                  : 0;

                return (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-[180px] md:w-[200px]"
                  >
                    <Link href={`/store/${product.slug}`} className="block group">
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-bg-secondary mb-3">
                        <Image
                          src={product.imageUrl}
                          alt={product.imageAlt}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="200px"
                        />
                        {hasDiscount && (
                          <span className="absolute top-2 left-2 badge badge-sale text-[10px]">
                            -{discount}%
                          </span>
                        )}
                      </div>

                      <p className="text-text-muted text-[11px] tracking-wider uppercase mb-1">
                        {product.brand}
                      </p>
                      <h4 className="text-text-primary text-[0.8rem] font-medium leading-snug line-clamp-2 mb-2 min-h-[2.4em] group-hover:text-accent-blue transition-colors">
                        {product.nameZh}
                      </h4>

                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="font-mono text-[0.85rem] font-semibold text-text-primary">
                          {formatPrice(product.priceSale ?? product.priceOriginal)}
                        </span>
                        {hasDiscount && (
                          <span className="font-mono text-[0.7rem] text-text-muted line-through">
                            {formatPrice(product.priceOriginal)}
                          </span>
                        )}
                      </div>
                    </Link>

                    <button
                      onClick={() => addItem(product)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-accent-blue text-white text-[0.8rem] font-semibold rounded-lg hover:bg-accent-blue-dark transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      加入購物車
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
