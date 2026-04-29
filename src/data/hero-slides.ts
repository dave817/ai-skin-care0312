export interface HeroSlide {
  id: string;
  badge?: string;
  brandName: string;
  brandLogoText?: string;
  headline: string;
  subhead: string;
  modelImage: string;
  modelImageAlt: string;
  modelStickerCopy?: string;
  productImage: string;
  productImageAlt: string;
  comparisonImages?: { src: string; label: string; alt: string }[];
  giftImage?: string;
  giftCopy?: string;
  ctaLink: string;
  ctaText: string;
  accentColor: string;
}

/**
 * PLACEHOLDER SLIDES — replace photos and copy with real assets.
 * Image URLs use Unsplash (already whitelisted in next.config.ts).
 * To swap: send 5 photos per slide + Chinese copy, or edit this file directly.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: "weightloss-1",
    badge: "限時優惠",
    brandName: "SLIM GLOW",
    brandLogoText: "SLIM·GLOW",
    headline: "燃燒脂肪 雕塑曲線",
    subhead: "30天見證纖體效果，從此自信嗮",
    modelImage:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80&auto=format",
    modelImageAlt: "纖體女生展示產品",
    modelStickerCopy: "[韓國爆款♥減重首選]",
    productImage:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80&auto=format",
    productImageAlt: "纖體產品包裝",
    comparisonImages: [
      {
        src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80&auto=format",
        label: "Before",
        alt: "使用前",
      },
      {
        src: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&q=80&auto=format",
        label: "After",
        alt: "使用後",
      },
      {
        src: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80&auto=format",
        label: "30天",
        alt: "30天後",
      },
    ],
    giftImage:
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=200&q=80&auto=format",
    giftCopy: "送纖體茶 mini",
    ctaLink: "/store?category=health",
    ctaText: "立即選購",
    accentColor: "#C17C6A",
  },
  {
    id: "korean-skincare",
    badge: "全店93折",
    brandName: "K-GLOW",
    brandLogoText: "K·GLOW",
    headline: "韓國爆紅護膚精選",
    subhead: "滿$599送$480貨裝禮品",
    modelImage:
      "https://images.unsplash.com/photo-1614108223275-c1f86e7a6e0b?w=900&q=80&auto=format",
    modelImageAlt: "韓系美肌示範",
    modelStickerCopy: "[韓國女生愛用♥]",
    productImage:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&q=80&auto=format",
    productImageAlt: "韓國護膚品系列",
    ctaLink: "/store?category=skincare",
    ctaText: "選購護膚",
    accentColor: "#4A9FE5",
  },
  {
    id: "ai-analysis",
    badge: "免費試用",
    brandName: "AI ANALYZE",
    brandLogoText: "AI·SKIN",
    headline: "AI 智能膚質分析",
    subhead: "3 張照片睇穿你嘅肌膚煩惱",
    modelImage:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=900&q=80&auto=format",
    modelImageAlt: "AI 膚質分析示範",
    modelStickerCopy: "[一鍵測肌齡♥]",
    productImage:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=900&q=80&auto=format",
    productImageAlt: "肌膚分析報告",
    ctaLink: "/analyze",
    ctaText: "開始分析",
    accentColor: "#B8A88A",
  },
];
