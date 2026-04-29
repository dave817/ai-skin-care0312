import type { Metadata } from "next";
import { CartProvider } from "@/lib/cart-context";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlobalEffects from "@/components/layout/GlobalEffects";
import ChatFab from "@/components/chat/ChatFab";

/* Self-hosted fonts (no Google Fonts network fetch at build time) */
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "@fontsource/outfit/300.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/noto-sans-tc/300.css";
import "@fontsource/noto-sans-tc/400.css";
import "@fontsource/noto-sans-tc/500.css";
import "@fontsource/noto-sans-tc/600.css";
import "@fontsource/noto-sans-tc/700.css";
import "@fontsource/noto-serif-tc/400.css";
import "@fontsource/noto-serif-tc/500.css";
import "@fontsource/noto-serif-tc/600.css";
import "@fontsource/noto-serif-tc/700.css";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";

import "./globals.css";

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

const fontVariables: React.CSSProperties = {
  ["--font-cormorant" as string]: '"Cormorant Garamond", Georgia, serif',
  ["--font-outfit" as string]: '"Outfit", system-ui, -apple-system, sans-serif',
  ["--font-noto-sans-tc" as string]:
    '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif',
  ["--font-noto-serif-tc" as string]:
    '"Noto Serif TC", "Songti TC", "PMingLiU", serif',
  ["--font-space-mono" as string]: '"Space Mono", "Courier New", monospace',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body className="antialiased" style={fontVariables}>
        <CartProvider>
          <GlobalEffects />
          <Navbar />
          <main className="relative z-10 min-h-screen">{children}</main>
          <Footer />
          <ChatFab />
        </CartProvider>
      </body>
    </html>
  );
}
