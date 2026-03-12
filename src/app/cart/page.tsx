"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { allProducts } from "@/data/products";
import ProductCard from "@/components/store/ProductCard";
import { formatPrice } from "@/lib/utils";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

const FREE_SHIPPING_THRESHOLD = 160;

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  const shippingFee = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 30;
  const orderTotal = totalPrice + shippingFee;
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - totalPrice;

  // Recommended products (pick bestsellers not already in cart)
  const cartProductIds = new Set(items.map((item) => item.product.id));
  const recommended = allProducts
    .filter(
      (p) => p.active && p.tags.includes("bestseller") && !cartProductIds.has(p.id)
    )
    .slice(0, 8);

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container-main py-10 md:py-14">
          {/* Title */}
          <h1 className="text-[1.8rem] md:text-[2.2rem] font-bold text-text-primary mb-10">
            購物車
          </h1>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16 md:py-24">
            <div className="w-20 h-20 rounded-full bg-bg-secondary flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-text-muted" />
            </div>
            <p className="text-text-secondary text-lg mb-6">
              您的購物車是空的！
            </p>
            <Link href="/store" className="btn-primary">
              <ArrowLeft className="w-4 h-4" />
              返回購物
            </Link>
          </div>

          {/* Recommended Products */}
          {recommended.length > 0 && (
            <section className="mt-8 md:mt-14">
              <h2 className="text-[1.2rem] md:text-[1.4rem] font-bold text-text-primary mb-6">
                推薦商品
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {recommended.map((product, i) => (
                  <div
                    key={product.id}
                    className="flex-shrink-0 w-[180px] md:w-[220px]"
                  >
                    <ProductCard product={product} index={i} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container-main py-10 md:py-14">
        {/* Title */}
        <h1 className="text-[1.8rem] md:text-[2.2rem] font-bold text-text-primary mb-8 md:mb-10">
          購物車
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="flex-1">
            {/* Free shipping progress */}
            {amountToFreeShipping > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-bg-secondary">
                <p className="text-text-secondary text-[0.85rem]">
                  再消費{" "}
                  <span className="font-semibold text-accent-blue">
                    {formatPrice(amountToFreeShipping)}
                  </span>{" "}
                  即可享免運費
                </p>
                <div className="mt-2 h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent-blue transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (totalPrice / FREE_SHIPPING_THRESHOLD) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Item List */}
            <div className="divide-y divide-border-light">
              {items.map((item) => {
                const price =
                  item.product.priceSale ?? item.product.priceOriginal;
                const hasDiscount = item.product.priceSale !== null;

                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 py-5 first:pt-0"
                  >
                    {/* Product Image */}
                    <Link
                      href={`/store/${item.product.slug}`}
                      className="relative w-[90px] h-[90px] md:w-[110px] md:h-[110px] rounded-xl overflow-hidden bg-bg-secondary flex-shrink-0"
                    >
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.imageAlt}
                        fill
                        className="object-cover"
                        sizes="110px"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-text-muted text-[11px] tracking-wider uppercase mb-0.5">
                        {item.product.brand}
                      </p>
                      <Link
                        href={`/store/${item.product.slug}`}
                        className="text-text-primary text-[0.9rem] font-medium leading-snug line-clamp-2 hover:text-accent-blue transition-colors"
                      >
                        {item.product.nameZh}
                      </Link>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="font-mono text-[0.9rem] font-semibold text-text-primary">
                          {formatPrice(price)}
                        </span>
                        {hasDiscount && (
                          <span className="font-mono text-[0.75rem] text-text-muted line-through">
                            {formatPrice(item.product.priceOriginal)}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-bg-secondary transition-colors"
                            aria-label="減少數量"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 h-8 flex items-center justify-center text-[0.85rem] font-medium text-text-primary border-x border-border">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center text-text-secondary hover:bg-bg-secondary transition-colors"
                            aria-label="增加數量"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-2 rounded-lg text-text-muted hover:text-accent-red hover:bg-red-50 transition-colors"
                          aria-label="移除商品"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-[360px] flex-shrink-0">
            <div className="sticky top-[100px] bg-bg-secondary rounded-2xl p-6 md:p-7">
              <h3 className="text-[1.1rem] font-bold text-text-primary mb-5">
                訂單摘要
              </h3>

              <div className="space-y-3 text-[0.9rem]">
                <div className="flex justify-between">
                  <span className="text-text-secondary">小計</span>
                  <span className="font-medium text-text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">運費</span>
                  <span className="font-medium text-text-primary">
                    {shippingFee === 0 ? (
                      <span className="text-accent-green">免運費</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <p className="text-text-muted text-[0.75rem]">
                  滿HK$160免運費
                </p>
              </div>

              <div className="border-t border-border mt-5 pt-5">
                <div className="flex justify-between text-[1rem]">
                  <span className="font-semibold text-text-primary">合計</span>
                  <span className="font-bold text-text-primary">
                    {formatPrice(orderTotal)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-primary w-full text-center mt-6"
              >
                前往結帳
              </Link>

              <Link
                href="/store"
                className="flex items-center justify-center gap-1.5 mt-3 text-text-secondary text-[0.85rem] hover:text-accent-blue transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                繼續購物
              </Link>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        {recommended.length > 0 && (
          <section className="mt-14 md:mt-20">
            <h2 className="text-[1.2rem] md:text-[1.4rem] font-bold text-text-primary mb-6">
              推薦商品
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
              {recommended.map((product, i) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[180px] md:w-[220px]"
                >
                  <ProductCard product={product} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
