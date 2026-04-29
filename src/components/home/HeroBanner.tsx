"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * Single full-width brand hero banner.
 * Source asset: /public/images/hero/dear-glow-banner.png
 * To swap: replace the PNG file (keep same path) or edit the src below.
 */
export default function HeroBanner() {
  return (
    <section className="px-4 pb-4" aria-label="Dear Glow Beauty 主視覺橫額">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-[20px] overflow-hidden bg-white border border-border-light/40 shadow-[0_8px_32px_rgba(193,124,106,0.06)]"
        >
          {/* Banner image (1992 × 850 source — wide editorial hero) */}
          <Link
            href="/store"
            className="block group focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-rose focus-visible:outline-offset-2 rounded-[20px]"
            aria-label="Dear Glow Beauty — 立即購物"
          >
            <div className="relative w-full aspect-[1992/850]">
              <Image
                src="/images/hero/dear-glow-banner.png"
                alt="Dear Glow Beauty — 韓國美妝精選系列"
                fill
                priority
                fetchPriority="high"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />

              {/* Subtle floating CTA pill (bottom-center) */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden md:flex"
              >
                <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-text-primary font-medium text-sm px-5 py-2.5 rounded-full shadow-md group-hover:bg-white group-hover:shadow-lg transition-all">
                  <Sparkles className="w-4 h-4 text-accent-rose" aria-hidden="true" />
                  探索全部產品
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </motion.div>
            </div>
          </Link>

          {/* Mobile CTA — outside the image for touch comfort */}
          <div className="md:hidden bg-white border-t border-border-light/40 p-4">
            <Link
              href="/store"
              className="flex items-center justify-center gap-2 bg-accent-rose text-white font-semibold text-sm py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              探索全部產品
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
