"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  ImagePlus,
  ShoppingBag,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "儀表板", icon: LayoutDashboard },
  { href: "/admin/products", label: "產品管理", icon: Package },
  { href: "/admin/blogs", label: "網誌管理", icon: FileText },
  { href: "/admin/translate", label: "韓中圖片翻譯", icon: ImagePlus },
  { href: "/admin/orders", label: "訂單", icon: ShoppingBag },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isLogin = pathname === "/admin/login";
  if (isLogin) return <>{children}</>;

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-bg-secondary flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-border-light flex-shrink-0 flex flex-col">
        <div className="px-6 py-5 border-b border-border-light">
          <Link href="/admin" className="block">
            <p className="font-serif text-lg font-bold text-text-primary leading-tight">
              Dear Glow Beauty
            </p>
            <p className="text-xs text-text-muted">後台管理</p>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent-rose/10 text-accent-rose"
                    : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border-light">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-secondary hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            登出
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-x-auto">{children}</main>
    </div>
  );
}
