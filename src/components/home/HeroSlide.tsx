"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";
import type { HeroSlide as HeroSlideData } from "@/data/hero-slides";

interface HeroSlideProps {
  slide: HeroSlideData;
}

export default function HeroSlide({ slide }: HeroSlideProps) {
  return (
    <div className="relative w-full overflow-hidden bg-white rounded-[20px] border border-border-light/40">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[420px] md:min-h-[480px]">
        {/* Left: model image with sticker */}
        <div className="relative bg-bg-secondary">
          <Image
            src={slide.modelImage}
            alt={slide.modelImageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />

          {slide.badge && (
            <div className="absolute top-4 left-4 bg-black/85 text-white text-xs md:text-sm font-medium px-3 py-1.5 rounded-md">
              {slide.badge}
            </div>
          )}

          {slide.modelStickerCopy && (
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded text-white font-semibold text-sm md:text-base whitespace-nowrap shadow-lg"
              style={{ backgroundColor: `${slide.accentColor}cc` }}
            >
              {slide.modelStickerCopy}
            </div>
          )}
        </div>

        {/* Right: brand showcase */}
        <div className="relative bg-gradient-to-br from-white to-bg-secondary/60 p-6 md:p-8 flex flex-col justify-between">
          {/* Brand logo */}
          <div>
            <div
              className="font-bold text-2xl md:text-3xl tracking-tight mb-3"
              style={{ color: slide.accentColor }}
            >
              {slide.brandLogoText ?? slide.brandName}
            </div>
            <h2 className="font-serif text-text-primary text-2xl md:text-4xl font-bold leading-tight mb-2">
              {slide.headline}
            </h2>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed">
              {slide.subhead}
            </p>
          </div>

          {/* Comparison images (if present) */}
          {slide.comparisonImages && slide.comparisonImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 my-4">
              {slide.comparisonImages.map((cmp, i) => (
                <div key={i} className="relative aspect-[3/4] rounded-lg overflow-hidden bg-bg-secondary">
                  <Image
                    src={cmp.src}
                    alt={cmp.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 16vw"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black/55 text-white text-[10px] md:text-xs px-2 py-1 text-center font-semibold">
                    {cmp.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Gift overlay */}
          {slide.giftImage && slide.giftCopy && (
            <div className="flex items-center gap-3 bg-white border border-border-light/60 rounded-xl p-3 my-2 shadow-sm">
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0">
                <Image
                  src={slide.giftImage}
                  alt={slide.giftCopy}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <Gift className="w-3.5 h-3.5 text-accent-rose" />
                  <span className="text-[10px] md:text-xs font-bold text-accent-rose uppercase tracking-wider">
                    Gift
                  </span>
                </div>
                <p className="text-text-primary text-sm font-semibold leading-tight">
                  {slide.giftCopy}
                </p>
              </div>
            </div>
          )}

          {/* CTA */}
          <Link
            href={slide.ctaLink}
            className="inline-flex items-center justify-center gap-2 text-white font-semibold text-sm md:text-base px-6 py-3 rounded-full transition-opacity hover:opacity-90 self-start"
            style={{ backgroundColor: slide.accentColor }}
          >
            {slide.ctaText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
