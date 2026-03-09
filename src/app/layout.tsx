import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Outfit,
  Noto_Sans_TC,
  Noto_Serif_TC,
  Space_Mono,
} from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlobalEffects from "@/components/layout/GlobalEffects";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

const notoSerifTC = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-tc",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "璞肌 Pure Skin | AI 智能護膚分析與產品推薦",
  description:
    "上傳照片，即刻獲得 AI 專業膚質分析，配合精選護膚產品推薦，讓你的護膚程序不再盲目。香港本地順豐送貨。",
  keywords: ["護膚", "AI膚質分析", "skincare", "香港", "護膚品推薦"],
  openGraph: {
    title: "璞肌 Pure Skin | AI 智能護膚分析",
    description: "AI 驅動的個人化護膚方案 — 專為香港市場而設",
    locale: "zh_HK",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body
        className={`${cormorant.variable} ${outfit.variable} ${notoSansTC.variable} ${notoSerifTC.variable} ${spaceMono.variable} antialiased`}
      >
        <GlobalEffects />
        <Navbar />
        <main className="relative z-10 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
