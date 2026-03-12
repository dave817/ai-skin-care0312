import Link from "next/link";

const footerLinks = {
  購物: [
    { label: "所有產品", href: "/store" },
    { label: "分類瀏覽", href: "/categories" },
    { label: "新品上架", href: "/store?sort=newest" },
    { label: "優惠專區", href: "/store?tag=sale" },
  ],
  服務: [
    { label: "AI 膚質分析", href: "/analyze" },
    { label: "美妝網誌", href: "/blog" },
    { label: "順豐運送", href: "#" },
    { label: "退換貨政策", href: "#" },
  ],
  關於: [
    { label: "品牌故事", href: "#" },
    { label: "聯絡我們", href: "#" },
    { label: "私隱政策", href: "#" },
    { label: "使用條款", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white/80">
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 md:gap-6">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-5">
            <Link href="/" className="inline-block group">
              <span className="text-2xl font-bold tracking-tight text-white group-hover:text-accent-blue transition-colors">
                Dear Glow Beauty
              </span>
              <span className="block text-[10px] text-white/40 tracking-[0.15em] font-sans mt-0.5">
                日韓化妝品護膚品專門店
              </span>
            </Link>
            <p className="mt-4 text-white/40 text-sm leading-relaxed max-w-xs">
              日韓化妝品護膚品專門店，配合 AI 智能膚質分析，為你推薦最適合的護膚方案。
            </p>
            <div className="mt-5 flex items-center gap-4 text-white/30 text-xs">
              <span>🇭🇰 香港</span>
              <span>·</span>
              <span>正貨保證</span>
              <span>·</span>
              <span>安全支付</span>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="md:col-span-2 lg:col-span-2">
              <h4 className="text-white/60 text-xs tracking-wider uppercase font-semibold mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/40 text-sm hover:text-white/80 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Dear Glow Beauty. All rights reserved.
          </p>
          <p className="text-white/20 text-[11px]">
            AI 分析僅供參考，不構成醫療建議。
          </p>
        </div>
      </div>
    </footer>
  );
}
