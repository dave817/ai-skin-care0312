"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ScanFace, ShoppingBag, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import HeroShader from "@/components/shaders/HeroShader";
import SectionShader from "@/components/shaders/SectionShader";
import FadeIn from "@/components/motion/FadeIn";
import StaggerChildren, { staggerItem } from "@/components/motion/StaggerChildren";
import ProductCard from "@/components/store/ProductCard";
import MarqueeBanner from "@/components/ui/MarqueeBanner";
import { featuredProducts } from "@/data/products";

const steps = [
  {
    icon: ScanFace,
    step: "01",
    title: "上傳照片",
    desc: "拍攝左、正、右三個角度的面部照片，讓 AI 全方位了解你的膚質",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "AI 即時分析",
    desc: "專業級 AI 分析八大膚質指標，生成你的個人膚質報告",
  },
  {
    icon: ShoppingBag,
    step: "03",
    title: "精準配對",
    desc: "根據分析結果，從50+精選產品中為你推薦最合適的護膚方案",
  },
];

const trustItems = [
  { value: "10,000+", label: "膚質分析" },
  { value: "50+", label: "精選產品" },
  { value: "免運費", label: "滿 HK$300" },
  { value: "順豐速運", label: "全港配送" },
];

const testimonials = [
  {
    text: "第一次覺得買護膚品不是在碰運氣，AI 分析結果很準確，推薦的產品用了兩週膚質明顯改善。",
    author: "Chloe L.",
    skin: "混合偏油肌",
  },
  {
    text: "本來以為只是噱頭，但分析出來的膚質報告比我之前去美容院的還詳細。推薦的精華液真的很適合我！",
    author: "Wing T.",
    skin: "敏感乾燥肌",
  },
  {
    text: "介面好靚，分析速度好快。最驚喜是 AI 顧問仲可以解答我關於成分嘅問題，好似有個專屬皮膚科醫生。",
    author: "Karen M.",
    skin: "混合肌",
  },
];

export default function Home() {
  const topProducts = featuredProducts.slice(0, 4);

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Shader background */}
        <HeroShader />

        {/* Warm overlay to ensure text readability */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,240,235,0.7) 0%, rgba(245,240,235,0.3) 50%, rgba(245,240,235,0.5) 100%)",
          }}
        />

        <div className="container-main relative z-10 py-20 md:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Left — Text content, offset for asymmetry */}
            <div className="lg:col-span-7 lg:pr-8">
              <FadeIn delay={0.2} direction="none">
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-10 h-[1.5px] bg-accent-rose" />
                  <span className="text-accent-rose text-[13px] tracking-[0.2em] font-sans font-medium">
                    AI 智能護膚
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <h1 className="font-serif leading-[1.1] mb-8">
                  <span className="block text-text-primary">你的肌膚，</span>
                  <span className="block mt-2 text-accent-rose relative">
                    值得被真正了解。
                    {/* Decorative underline */}
                    <svg
                      className="absolute -bottom-2 left-0 w-full h-3 text-accent-rose/20"
                      viewBox="0 0 300 12"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M2 8 C40 2, 80 10, 120 6 C160 2, 200 9, 240 5 C260 3, 280 7, 298 4"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.6}>
                <p className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-lg mb-12">
                  上傳面部照片，AI 即時分析你的膚質狀況，
                  <br className="hidden md:block" />
                  為你推薦最適合的護膚方案與產品。
                </p>
              </FadeIn>

              <FadeIn delay={0.8}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/analyze" className="btn-primary text-base px-8 py-4">
                    <Sparkles className="w-[18px] h-[18px]" />
                    開始 AI 膚質分析
                  </Link>
                  <Link href="/store" className="btn-secondary text-base px-8 py-4">
                    瀏覽產品
                    <ArrowRight className="w-[18px] h-[18px]" />
                  </Link>
                </div>
              </FadeIn>

              {/* Mini trust signals under CTAs */}
              <FadeIn delay={1.0}>
                <div className="flex items-center gap-6 mt-10 text-text-muted text-[13px]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                    免費分析
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                    即時結果
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                    無需註冊
                  </span>
                </div>
              </FadeIn>
            </div>

            {/* Right — Decorative image / visual element */}
            <div className="hidden lg:block lg:col-span-5">
              <FadeIn delay={0.6} direction="left">
                <div className="relative">
                  {/* Main hero image */}
                  <div className="relative rounded-[28px] overflow-hidden aspect-[3/4] shadow-2xl shadow-accent-rose/10">
                    <Image
                      src="https://picsum.photos/seed/skincare-hero/600/800"
                      alt="護膚品展示"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 0vw, 40vw"
                      priority
                    />
                    {/* Warm overlay tint */}
                    <div className="absolute inset-0 bg-gradient-to-t from-accent-rose/10 via-transparent to-accent-gold/5" />
                  </div>

                  {/* Floating accent card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="absolute -bottom-6 -left-8 bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl shadow-black/5 border border-white/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-accent-green/10 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-accent-green" />
                      </div>
                      <div>
                        <p className="text-text-primary text-sm font-medium">膚質健康分數</p>
                        <p className="text-accent-green text-xl font-serif font-semibold">87/100</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Small decorative circle */}
                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full border-2 border-accent-gold/20" />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section className="relative py-14 md:py-18 border-y border-border-light/50">
        <div className="container-main">
          <StaggerChildren
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4"
            staggerDelay={0.08}
          >
            {trustItems.map((item) => (
              <motion.div key={item.label} variants={staggerItem} className="text-center">
                <div className="font-serif text-[1.8rem] md:text-[2.2rem] text-text-primary mb-1">
                  {item.value}
                </div>
                <div className="text-text-muted text-[13px] tracking-wide">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ===== BRAND MARQUEE ===== */}
      <MarqueeBanner
        items={[
          "COSRX",
          "Dear, Klairs",
          "Beauty of Joseon",
          "LANEIGE",
          "Isntree",
          "SKIN1004",
          "Illiyoon",
          "Anua",
          "Torriden",
          "mixsoon",
          "Round Lab",
          "Innisfree",
        ]}
        className="py-5 text-text-muted/30 text-[13px] tracking-[0.3em] uppercase font-sans border-y border-border-light/30"
        separator="·"
        speed={40}
      />

      {/* ===== HOW IT WORKS ===== */}
      <section className="section-spacing relative overflow-hidden">
        {/* Subtle shader background */}
        <div className="absolute inset-0 opacity-30">
          <SectionShader variant="gold" />
        </div>

        <div className="container-main relative z-10">
          <FadeIn>
            <div className="max-w-xl mb-16 md:mb-20">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-[1.5px] bg-accent-gold" />
                <span className="text-accent-gold text-[11px] tracking-[0.2em] uppercase font-sans font-semibold">
                  使用流程
                </span>
              </div>
              <h2 className="font-serif text-text-primary mb-5">
                三步驟，找到你的
                <br className="hidden sm:block" />
                專屬護膚方案
              </h2>
              <p className="text-text-muted text-[15px] leading-relaxed">
                不需要花時間研究成分、看評價。AI 幫你做最精準的判斷，
                從此告別盲目護膚。
              </p>
            </div>
          </FadeIn>

          <StaggerChildren
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            staggerDelay={0.12}
          >
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.step} variants={staggerItem}>
                  <div className="group relative p-8 md:p-10 rounded-[22px] bg-white/70 backdrop-blur-sm border border-border-light/60 hover:border-accent-rose/25 transition-all duration-500 hover:shadow-[0_16px_50px_rgba(193,124,106,0.08)] h-full">
                    {/* Step number — large, decorative */}
                    <span className="absolute top-6 right-8 font-serif text-[4rem] font-bold text-border-light/40 leading-none select-none">
                      {step.step}
                    </span>

                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-rose/10 to-accent-gold/10 flex items-center justify-center mb-7 group-hover:from-accent-rose/15 group-hover:to-accent-gold/15 transition-all duration-500">
                      <Icon className="w-6 h-6 text-accent-rose" />
                    </div>

                    <h3 className="font-serif text-[1.3rem] text-text-primary mb-3">
                      {step.title}
                    </h3>
                    <p className="text-text-muted text-[14px] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </StaggerChildren>
        </div>
      </section>

      {/* ===== HAND-DRAWN DIVIDER ===== */}
      <div className="divider-hand-drawn" />

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="section-spacing">
        <div className="container-main">
          <div className="flex items-end justify-between mb-14 md:mb-18">
            <FadeIn>
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-10 h-[1.5px] bg-accent-green" />
                  <span className="text-accent-green text-[11px] tracking-[0.2em] uppercase font-sans font-semibold">
                    精選推薦
                  </span>
                </div>
                <h2 className="font-serif text-text-primary">人氣熱賣產品</h2>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Link
                href="/store"
                className="hidden md:flex items-center gap-2 text-[13px] text-text-muted hover:text-accent-rose transition-colors duration-300 group"
              >
                查看全部
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </FadeIn>
          </div>

          <StaggerChildren
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
            staggerDelay={0.08}
          >
            {topProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </StaggerChildren>

          {/* Mobile "view all" */}
          <FadeIn className="mt-10 text-center md:hidden">
            <Link
              href="/store"
              className="inline-flex items-center gap-2 text-sm text-accent-rose font-medium"
            >
              查看全部產品
              <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-bg-secondary/40" />
        <div className="absolute inset-0 opacity-20">
          <SectionShader variant="cool" />
        </div>

        <div className="container-main relative z-10">
          <FadeIn>
            <div className="text-center mb-14 md:mb-18">
              <div className="flex items-center justify-center gap-3 mb-5">
                <span className="w-10 h-[1.5px] bg-accent-rose" />
                <span className="text-accent-rose text-[11px] tracking-[0.2em] uppercase font-sans font-semibold">
                  用家分享
                </span>
                <span className="w-10 h-[1.5px] bg-accent-rose" />
              </div>
              <h2 className="font-serif text-text-primary">她們的真實體驗</h2>
            </div>
          </FadeIn>

          <StaggerChildren
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
            staggerDelay={0.1}
          >
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={staggerItem}>
                <div className="relative p-8 md:p-9 rounded-[22px] bg-white/70 backdrop-blur-sm border border-border-light/50 h-full">
                  {/* Quote mark */}
                  <span className="absolute top-5 left-7 font-serif text-[3.5rem] text-accent-rose/15 leading-none select-none">
                    "
                  </span>

                  <p className="text-text-secondary text-[14.5px] leading-[1.9] mb-7 mt-4 relative z-10">
                    {t.text}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-rose/20 to-accent-gold/20 flex items-center justify-center">
                      <span className="text-accent-rose text-xs font-semibold">
                        {t.author[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-text-primary text-sm font-medium">{t.author}</p>
                      <p className="text-text-muted text-xs">{t.skin}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* ===== DIVIDER ===== */}
      <div className="divider-hand-drawn" />

      {/* ===== AI ANALYSIS CTA ===== */}
      <section className="section-spacing relative overflow-hidden">
        <div className="container-main relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — Image composition */}
            <FadeIn direction="right">
              <div className="relative">
                <div className="rounded-[24px] overflow-hidden aspect-[4/3] shadow-xl shadow-accent-rose/8">
                  <Image
                    src="https://picsum.photos/seed/skincare-analysis/800/600"
                    alt="AI 膚質分析示意"
                    width={800}
                    height={600}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent-rose/10 via-transparent to-transparent" />
                </div>

                {/* Floating UI mockup card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="absolute -bottom-5 -right-5 md:right-8 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl shadow-black/5 border border-white/60"
                >
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <ScanFace className="w-4.5 h-4.5 text-accent-rose" />
                    <span className="text-text-primary text-xs font-medium">膚質分析結果</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { label: "水潤度", value: 72, color: "bg-accent-green" },
                      { label: "毛孔", value: 45, color: "bg-accent-gold" },
                      { label: "膚色均勻", value: 83, color: "bg-accent-rose" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2 text-[11px]">
                        <span className="text-text-muted w-14">{item.label}</span>
                        <div className="flex-1 h-1.5 bg-bg-secondary rounded-full overflow-hidden w-24">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.value}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${item.color}`}
                          />
                        </div>
                        <span className="text-text-primary font-mono w-6 text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </FadeIn>

            {/* Right — Text */}
            <div>
              <FadeIn>
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-10 h-[1.5px] bg-accent-rose" />
                  <span className="text-accent-rose text-[11px] tracking-[0.2em] uppercase font-sans font-semibold">
                    核心功能
                  </span>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h2 className="font-serif text-text-primary mb-6">
                  AI 膚質分析，
                  <br />
                  精準到每一個細節
                </h2>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="text-text-secondary text-[15px] leading-relaxed mb-8">
                  上傳三張面部照片，AI 即時分析八大膚質指標 —— 包括水潤度、毛孔、色素沉着、
                  細紋、敏感度等。生成專業膚質報告，並推薦最適合你的護膚產品。
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <ul className="space-y-4 mb-10">
                  {[
                    "八大膚質指標全面評估",
                    "個人化早晚護膚程序建議",
                    "精準配對店內產品，一鍵加入購物車",
                    "AI 護膚顧問隨時解答你的疑問",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-text-secondary text-[14px]">
                      <span className="w-5 h-5 rounded-full bg-accent-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </FadeIn>

              <FadeIn delay={0.4}>
                <Link href="/analyze" className="btn-primary">
                  <Sparkles className="w-4 h-4" />
                  免費開始分析
                </Link>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-bg-secondary/50" />
        <div className="absolute inset-0 opacity-25">
          <SectionShader variant="warm" />
        </div>

        <div className="container-main relative z-10 text-center max-w-2xl mx-auto">
          <FadeIn>
            <h2 className="font-serif text-text-primary mb-6">
              準備好了解你的肌膚了嗎？
            </h2>
          </FadeIn>
          <FadeIn delay={0.15}>
            <p className="text-text-muted text-[15px] leading-relaxed mb-10 max-w-md mx-auto">
              只需三張照片，AI 即時為你分析膚質並推薦合適產品。
              <br />
              完全免費，無需註冊。
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <Link href="/analyze" className="btn-primary text-base px-10 py-4">
              <Sparkles className="w-[18px] h-[18px]" />
              免費開始分析
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
