import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Outfit,
  Noto_Sans_TC,
  Noto_Serif_TC,
  Space_Mono,
} from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
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
  title: "Dear Glow Beauty | 日韓化妝品護膚品專門店",
  description:
    "日韓化妝品護膚品專門店，直送香港。AI智能膚質分析，個人化產品推薦，滿HK$160免運費。探索最新日韓護膚趨勢，找到最適合你的護膚方案。",
  keywords: [
    "韓國美妝",
    "韓國護膚",
    "K-beauty",
    "香港",
    "AI膚質分析",
    "護膚品推薦",
    "韓國護膚品直送",
  ],
  openGraph: {
    title: "Dear Glow Beauty | 日韓化妝品護膚品專門店",
    description:
      "日韓化妝品護膚品專門店，直送香港。AI智能膚質分析，個人化產品推薦，滿HK$160免運費。",
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
        <CartProvider>
          <GlobalEffects />
          <Navbar />
          <main className="relative z-10 min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
