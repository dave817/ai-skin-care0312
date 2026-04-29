import Link from "next/link";
import {
  Package,
  FileText,
  ImagePlus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { allProducts } from "@/data/products";
import { blogPosts } from "@/data/blogs";

export default function AdminDashboard() {
  const stats = [
    {
      label: "產品總數",
      value: allProducts.filter((p) => p.active).length,
      href: "/admin/products",
      icon: Package,
      color: "#4A9FE5",
    },
    {
      label: "網誌文章",
      value: blogPosts.length,
      href: "/admin/blogs",
      icon: FileText,
      color: "#C17C6A",
    },
    {
      label: "韓中翻譯工具",
      value: "AI",
      href: "/admin/translate",
      icon: ImagePlus,
      color: "#B8A88A",
    },
    {
      label: "訂單管理",
      value: "—",
      href: "/admin/orders",
      icon: ShoppingBag,
      color: "#999999",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">儀表板</h1>
        <p className="text-text-muted text-sm mt-1">歡迎返嚟，後台管理員</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.href}
              href={stat.href}
              className="bg-white rounded-xl p-5 border border-border-light hover:border-accent-rose/40 transition-colors group"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${stat.color}1a`, color: stat.color }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs text-text-muted mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-text-primary">
                {stat.value}
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs text-accent-rose opacity-0 group-hover:opacity-100 transition-opacity">
                查看
                <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-6 border border-border-light">
        <h2 className="text-base font-bold text-text-primary mb-4">快速指南</h2>
        <ul className="space-y-2.5 text-sm text-text-secondary">
          <li className="flex gap-3">
            <span className="text-accent-rose font-bold">•</span>
            <span>
              <strong>產品管理</strong>：新增、編輯、刪除產品。支援上載產品圖片同詳細描述。
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent-rose font-bold">•</span>
            <span>
              <strong>網誌管理</strong>：撰寫美妝相關文章，可以嵌入產品推薦。
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent-rose font-bold">•</span>
            <span>
              <strong>韓中圖片翻譯</strong>：上載韓國原文圖片，AI 自動翻譯成繁體中文並重新渲染。
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
