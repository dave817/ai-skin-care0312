import Link from "next/link";

const footerLinks = {
  購物指南: [
    { label: "所有產品", href: "/store" },
    { label: "AI 膚質分析", href: "/analyze" },
    { label: "順豐運送", href: "#" },
    { label: "退換貨政策", href: "#" },
  ],
  關於璞肌: [
    { label: "品牌故事", href: "#" },
    { label: "聯絡我們", href: "#" },
    { label: "私隱政策", href: "#" },
    { label: "使用條款", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-text-primary text-bg-secondary">
      <div className="container-main py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-5 lg:col-span-6">
            <Link href="/" className="inline-block group">
              <span className="font-serif text-[1.7rem] tracking-wide text-bg-primary group-hover:text-accent-gold transition-colors duration-300">
                璞肌
              </span>
              <span className="block text-[10px] text-text-muted tracking-[0.18em] uppercase font-sans mt-0.5 opacity-50">
                Pure Skin
              </span>
            </Link>
            <p className="mt-6 text-bg-secondary/50 text-[13.5px] leading-[1.9] max-w-sm">
              以 AI 科技結合專業護膚知識，為你的肌膚提供最精準的分析與產品推薦。
              讓每一次護膚都不再盲目。
            </p>
            <div className="mt-7 flex items-center gap-5 text-bg-secondary/35 text-[12px] tracking-wide">
              <span>香港</span>
              <span className="w-[3px] h-[3px] rounded-full bg-bg-secondary/20" />
              <span>順豐速運</span>
              <span className="w-[3px] h-[3px] rounded-full bg-bg-secondary/20" />
              <span>安全支付</span>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="md:col-span-3">
              <h4 className="text-bg-primary/70 text-[12px] tracking-[0.15em] uppercase font-sans font-semibold mb-6">
                {title}
              </h4>
              <ul className="space-y-3.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-bg-secondary/40 text-[13.5px] hover:text-accent-gold transition-colors duration-300"
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
        <div className="mt-16 pt-7 border-t border-bg-secondary/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-bg-secondary/25 text-[11.5px] tracking-wide">
            © {new Date().getFullYear()} 璞肌 Pure Skin. All rights reserved.
          </p>
          <p className="text-bg-secondary/20 text-[11px]">
            AI 分析僅供參考，不構成醫療建議。如有皮膚問題，請諮詢專業皮膚科醫生。
          </p>
        </div>
      </div>
    </footer>
  );
}
