"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "首頁" },
  { href: "/analyze", label: "AI 膚質分析", highlight: true },
  { href: "/store", label: "所有產品" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-text-primary text-bg-primary text-center py-2.5 px-4 text-[12.5px] tracking-wide font-sans relative z-50">
        <span className="opacity-80">全新上線</span>
        <span className="mx-1.5 text-accent-gold">·</span>
        <span className="font-medium">新客戶首單享 9折</span>
        <span className="mx-1.5 text-accent-gold">·</span>
        <span className="opacity-80">滿 HK$300 免運費</span>
      </div>

      {/* Main Navbar */}
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-500",
          scrolled
            ? "bg-bg-primary/85 backdrop-blur-2xl shadow-[0_1px_0_var(--border-light)]"
            : "bg-bg-primary/40 backdrop-blur-sm"
        )}
      >
        <nav className="container-main flex items-center justify-between h-[68px] md:h-[76px]">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-2.5 group relative z-50">
            <span className="font-serif text-[1.6rem] md:text-[1.8rem] tracking-wide text-text-primary group-hover:text-accent-rose transition-colors duration-400">
              璞肌
            </span>
            <span className="text-[10px] text-text-muted tracking-[0.18em] uppercase font-sans font-medium opacity-60">
              Pure Skin
            </span>
          </Link>

          {/* Desktop Nav — centered */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-5 py-2 text-[0.85rem] tracking-wide transition-all duration-300 rounded-lg group",
                  link.highlight
                    ? "text-accent-rose font-medium"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {link.highlight && (
                  <Sparkles className="inline-block w-3.5 h-3.5 mr-1.5 -mt-0.5 opacity-70" />
                )}
                {link.label}
                {/* Hover underline */}
                <span
                  className={cn(
                    "absolute bottom-0.5 left-5 right-5 h-[1.5px] rounded-full transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100",
                    link.highlight ? "bg-accent-rose/40" : "bg-text-muted/30"
                  )}
                />
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 relative z-50">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl hover:bg-bg-secondary/60 transition-all duration-300 group"
              aria-label="購物車"
            >
              <ShoppingBag className="w-[19px] h-[19px] text-text-secondary group-hover:text-text-primary transition-colors" />
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-bg-secondary/60 transition-colors"
              aria-label="選單"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-text-secondary" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-bg-primary/95 backdrop-blur-2xl md:hidden"
          >
            <nav className="container-main pt-32 pb-12">
              <div className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block px-2 py-4 text-[1.5rem] font-serif tracking-wide border-b border-border-light/40 transition-colors",
                        link.highlight
                          ? "text-accent-rose"
                          : "text-text-primary hover:text-accent-rose"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12"
              >
                <Link
                  href="/analyze"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full text-center"
                >
                  <Sparkles className="w-4 h-4" />
                  開始 AI 膚質分析
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
