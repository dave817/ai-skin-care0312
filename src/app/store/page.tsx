"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  allProducts,
  mainCategories,
  getProductsByCategory,
  getProductsBySubcategory,
} from "@/data/products";
import ProductCard from "@/components/store/ProductCard";

type SortOption = "recommended" | "price-asc" | "price-desc" | "newest";

const sortLabels: Record<SortOption, string> = {
  recommended: "推薦排序",
  "price-asc": "價格由低至高",
  "price-desc": "價格由高至低",
  newest: "最新上架",
};

const categoryTabs = [
  { id: "all", labelZh: "全部" },
  ...mainCategories.filter((c) => ["skincare", "body-hair", "makeup", "tools"].includes(c.id)),
];

function StoreContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSub = searchParams.get("sub") || "all";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSubcategory, setActiveSubcategory] = useState(initialSub);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [sortOpen, setSortOpen] = useState(false);

  // Get subcategories for the active category
  const currentCategory = mainCategories.find((c) => c.id === activeCategory);
  const subcategories = currentCategory?.subcategories || [];

  // Filter products
  const filteredProducts = useMemo(() => {
    let products =
      activeCategory === "all"
        ? allProducts.filter((p) => p.active)
        : activeSubcategory && activeSubcategory !== "all"
        ? getProductsBySubcategory(activeCategory, activeSubcategory)
        : getProductsByCategory(activeCategory);

    // Sort
    switch (sortBy) {
      case "price-asc":
        products = [...products].sort(
          (a, b) => (a.priceSale ?? a.priceOriginal) - (b.priceSale ?? b.priceOriginal)
        );
        break;
      case "price-desc":
        products = [...products].sort(
          (a, b) => (b.priceSale ?? b.priceOriginal) - (a.priceSale ?? a.priceOriginal)
        );
        break;
      case "newest":
        products = [...products].filter((p) => p.tags.includes("new")).concat(
          [...products].filter((p) => !p.tags.includes("new"))
        );
        break;
      default:
        // recommended: bestsellers first
        products = [...products].sort((a, b) => {
          const aScore = a.tags.includes("bestseller") ? 2 : a.tags.includes("new") ? 1 : 0;
          const bScore = b.tags.includes("bestseller") ? 2 : b.tags.includes("new") ? 1 : 0;
          return bScore - aScore;
        });
    }

    return products;
  }, [activeCategory, activeSubcategory, sortBy]);

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
    setActiveSubcategory("all");
  };

  return (
    <main className="min-h-screen bg-bg-primary pb-20">
      {/* Header */}
      <div className="container-main pt-6 pb-4">
        <h1 className="text-xl font-bold text-text-primary">商品目錄</h1>
        <p className="text-sm text-text-muted mt-1">
          共 {filteredProducts.length} 件商品
        </p>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-0 z-20 bg-bg-primary border-b border-border-light">
        <div className="container-main">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide -mx-4 px-4">
            {categoryTabs.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`
                  flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${
                    activeCategory === cat.id
                      ? "bg-text-primary text-white"
                      : "bg-bg-secondary text-text-secondary hover:bg-border"
                  }
                `}
              >
                {cat.labelZh}
              </button>
            ))}
          </div>

          {/* Subcategory Tabs */}
          {subcategories.length > 0 && activeCategory !== "all" && (
            <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubcategory(sub.id)}
                  className={`
                    flex-shrink-0 text-sm transition-all duration-200 pb-1 border-b-2
                    ${
                      activeSubcategory === sub.id
                        ? "text-text-primary border-text-primary font-semibold"
                        : "text-text-muted border-transparent hover:text-text-secondary"
                    }
                  `}
                >
                  {sub.labelZh}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sort & Count Bar */}
      <div className="container-main">
        <div className="flex items-center justify-between py-3">
          <span className="text-xs text-text-muted">
            {filteredProducts.length} 件商品
          </span>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {sortLabels[sortBy]}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  sortOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {sortOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setSortOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-border-light overflow-hidden z-40 min-w-[160px]">
                  {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSortBy(key);
                        setSortOpen(false);
                      }}
                      className={`
                        w-full text-left px-4 py-3 text-sm transition-colors
                        ${
                          sortBy === key
                            ? "text-accent-blue font-medium bg-blue-50/50"
                            : "text-text-secondary hover:bg-bg-secondary"
                        }
                      `}
                    >
                      {sortLabels[key]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container-main">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-text-muted text-lg mb-2">暫無商品</p>
            <p className="text-text-muted text-sm">請嘗試其他分類</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.06 },
              },
            }}
            key={`${activeCategory}-${activeSubcategory}-${sortBy}`}
          >
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default function StorePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-bg-primary flex items-center justify-center">
          <p className="text-text-muted">載入中...</p>
        </main>
      }
    >
      <StoreContent />
    </Suspense>
  );
}
