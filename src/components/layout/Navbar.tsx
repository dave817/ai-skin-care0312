"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

const navLinks = [
  { href: "/", label: "首頁" },
  { href: "/store", label: "所有產品" },
  { href: "/store?view=categories", label: "分類" },
  { href: "/analyze", label: "AI膚質分析", highlight: true },
  { href: "/blog", label: "網誌" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Focus search input when search opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-text-primary text-white text-center py-2 px-4 text-[12px] tracking-wide font-sans relative z-50 select-none">
        <span className="opacity-80">全新上線</span>
        <span className="mx-2 text-accent-gold">·</span>
        <span className="font-medium">新客戶首單享9折</span>
        <span className="mx-2 text-accent-gold">·</span>
        <span className="opacity-80">滿HK$160免運費</span>
      </div>

      {/* Main Navbar */}
      <header
        className={cn(
          "sticky top-0 z-40 transition-all duration-500 border-b",
          scrolled
            ? "bg-white/90 backdrop-blur-2xl border-border shadow-sm"
            : "bg-white border-border-light"
        )}
      >
        <nav className="container-main flex items-center justify-between h-[60px] md:h-[68px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-baseline gap-2 group relative z-50 shrink-0"
          >
            <span className="font-serif text-[1.5rem] md:text-[1.7rem] tracking-wide text-text-primary group-hover:text-accent-rose transition-colors duration-300">
              Dear Glow Beauty
            </span>
            <span className="hidden sm:inline text-[10px] text-text-muted tracking-[0.15em] font-sans font-medium opacity-50">
              日韓化妝品護膚品專門店
            </span>
          </Link>

          {/* Desktop Nav — centered */}
          <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-[0.85rem] tracking-wide transition-all duration-300 rounded-lg group whitespace-nowrap",
                  link.highlight
                    ? "text-accent-rose font-medium"
                    : "text-text-secondary hover:text-text-primary"
                )}
              >
                {link.highlight && (
                  <Sparkles className="inline-block w-3.5 h-3.5 mr-1 -mt-0.5 opacity-70" />
                )}
                {link.label}
                {/* Hover underline */}
                <span
                  className={cn(
                    "absolute bottom-0 left-4 right-4 h-[1.5px] rounded-full transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100",
                    link.highlight ? "bg-accent-rose/40" : "bg-text-muted/30"
                  )}
                />
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-1 relative z-50">
            {/* Search toggle */}
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (searchOpen) setSearchQuery("");
              }}
              className="p-2.5 rounded-xl hover:bg-bg-secondary/60 transition-all duration-300 group"
              aria-label="搜尋"
            >
              {searchOpen ? (
                <X className="w-[18px] h-[18px] text-text-primary" />
              ) : (
                <Search className="w-[18px] h-[18px] text-text-secondary group-hover:text-text-primary transition-colors" />
              )}
            </button>

            {/* User icon — desktop only */}
            <Link
              href="#"
              className="hidden md:flex p-2.5 rounded-xl hover:bg-bg-secondary/60 transition-all duration-300 group"
              aria-label="帳戶"
            >
              <User className="w-[18px] h-[18px] text-text-secondary group-hover:text-text-primary transition-colors" />
            </Link>

            {/* Wishlist icon — desktop only */}
            <Link
              href="#"
              className="hidden md:flex p-2.5 rounded-xl hover:bg-bg-secondary/60 transition-all duration-300 group"
              aria-label="願望清單"
            >
              <Heart className="w-[18px] h-[18px] text-text-secondary group-hover:text-text-primary transition-colors" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl hover:bg-bg-secondary/60 transition-all duration-300 group"
              aria-label="購物車"
            >
              <ShoppingBag className="w-[18px] h-[18px] text-text-secondary group-hover:text-text-primary transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-accent-red text-white text-[10px] font-bold rounded-full px-1 leading-none">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl hover:bg-bg-secondary/60 transition-colors"
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

        {/* Expandable Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-t border-border-light"
            >
              <div className="container-main py-3">
                <div className="relative max-w-2xl mx-auto">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜尋產品、品牌、成分..."
                    className="search-bar w-full pl-11 pr-4"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        setSearchOpen(false);
                        // Navigate to search results — can be wired up later
                        window.location.href = `/store?q=${encodeURIComponent(searchQuery.trim())}`;
                      }
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-white/98 backdrop-blur-2xl lg:hidden"
          >
            <nav className="container-main pt-28 pb-12 h-full overflow-y-auto">
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.35 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-2 py-4 text-[1.3rem] font-sans font-medium tracking-wide border-b border-border-light transition-colors",
                        link.highlight
                          ? "text-accent-rose"
                          : "text-text-primary hover:text-accent-rose"
                      )}
                    >
                      {link.highlight && (
                        <Sparkles className="w-4 h-4 opacity-70" />
                      )}
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile menu extra links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 flex flex-col gap-3"
              >
                <Link
                  href="#"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-2 py-3 text-text-secondary text-[0.95rem]"
                >
                  <User className="w-4.5 h-4.5" />
                  我的帳戶
                </Link>
                <Link
                  href="#"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-2 py-3 text-text-secondary text-[0.95rem]"
                >
                  <Heart className="w-4.5 h-4.5" />
                  願望清單
                </Link>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-10"
              >
                <Link
                  href="/analyze"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full text-center"
                >
                  <Sparkles className="w-4 h-4" />
                  開始AI膚質分析
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
