"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { mainCategories } from "@/data/products";

export default function CategoriesPage() {
  const [activeCategory, setActiveCategory] = useState(mainCategories[0]?.id || "");

  const currentCategory = mainCategories.find((c) => c.id === activeCategory);

  return (
    <main className="min-h-screen bg-bg-primary pb-20">
      {/* Header */}
      <div className="container-main pt-6 pb-4">
        <h1 className="text-xl font-bold text-text-primary">商品分類</h1>
      </div>

      {/* Desktop: Sidebar + Content */}
      <div className="container-main hidden md:grid md:grid-cols-[240px_1fr] md:gap-6">
        {/* Sidebar */}
        <nav className="bg-bg-secondary rounded-2xl p-2 h-fit sticky top-20">
          {mainCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200
                ${
                  activeCategory === cat.id
                    ? "bg-white text-text-primary font-semibold shadow-sm"
                    : "text-text-secondary hover:bg-white/50"
                }
              `}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-sm">{cat.labelZh}</span>
            </button>
          ))}
        </nav>

        {/* Subcategories Panel */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">{currentCategory?.icon}</span>
                <h2 className="text-lg font-bold text-text-primary">
                  {currentCategory?.labelZh}
                </h2>
              </div>

              {currentCategory?.subcategories &&
              currentCategory.subcategories.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentCategory.subcategories
                    .filter((sub) => sub.id !== "all")
                    .map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/store?category=${activeCategory}&sub=${sub.id}`}
                        className="group flex items-center justify-between bg-white border border-border-light rounded-xl px-5 py-4 hover:border-accent-blue/30 hover:shadow-sm transition-all duration-200"
                      >
                        <span className="text-sm text-text-primary group-hover:text-accent-blue transition-colors">
                          {sub.labelZh}
                        </span>
                        <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent-blue transition-colors" />
                      </Link>
                    ))}

                  {/* View All Link */}
                  <Link
                    href={`/store?category=${activeCategory}`}
                    className="group flex items-center justify-between bg-accent-blue/5 border border-accent-blue/10 rounded-xl px-5 py-4 hover:bg-accent-blue/10 transition-all duration-200"
                  >
                    <span className="text-sm text-accent-blue font-medium">
                      查看全部{currentCategory.labelZh}
                    </span>
                    <ChevronRight className="w-4 h-4 text-accent-blue" />
                  </Link>
                </div>
              ) : (
                <Link
                  href={`/store?category=${activeCategory}`}
                  className="group inline-flex items-center gap-2 bg-white border border-border-light rounded-xl px-5 py-4 hover:border-accent-blue/30 hover:shadow-sm transition-all duration-200"
                >
                  <span className="text-sm text-text-primary group-hover:text-accent-blue transition-colors">
                    查看全部{currentCategory?.labelZh}商品
                  </span>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent-blue transition-colors" />
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile: Accordion Style */}
      <div className="container-main md:hidden space-y-2">
        {mainCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const hasSubs =
            cat.subcategories && cat.subcategories.length > 0;

          return (
            <div
              key={cat.id}
              className="bg-white border border-border-light rounded-xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setActiveCategory(isActive ? "" : cat.id)
                }
                className="w-full flex items-center justify-between px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{cat.icon}</span>
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-text-primary" : "text-text-secondary"
                    }`}
                  >
                    {cat.labelZh}
                  </span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-text-muted transition-transform duration-200 ${
                    isActive ? "rotate-90" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-1">
                      {hasSubs ? (
                        <>
                          {cat.subcategories!
                            .filter((sub) => sub.id !== "all")
                            .map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/store?category=${cat.id}&sub=${sub.id}`}
                                className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-bg-secondary transition-colors"
                              >
                                <span className="text-sm text-text-secondary">
                                  {sub.labelZh}
                                </span>
                                <ChevronRight className="w-3.5 h-3.5 text-text-muted" />
                              </Link>
                            ))}
                          <Link
                            href={`/store?category=${cat.id}`}
                            className="flex items-center justify-between py-3 px-3 rounded-lg bg-accent-blue/5 hover:bg-accent-blue/10 transition-colors"
                          >
                            <span className="text-sm text-accent-blue font-medium">
                              查看全部
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-accent-blue" />
                          </Link>
                        </>
                      ) : (
                        <Link
                          href={`/store?category=${cat.id}`}
                          className="flex items-center justify-between py-3 px-3 rounded-lg bg-accent-blue/5 hover:bg-accent-blue/10 transition-colors"
                        >
                          <span className="text-sm text-accent-blue font-medium">
                            查看全部商品
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-accent-blue" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </main>
  );
}
