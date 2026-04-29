# Dear Glow Beauty — 日韓化妝品護膚品專門店 E-Commerce Platform

## Project Overview
**Shop-first** Korean beauty e-commerce platform for the Hong Kong market. Primary function is online shopping (inspired by KuP app), with AI skin analysis as a secondary feature. Users browse and buy Korean beauty products, read beauty blog posts, and optionally use AI skin analysis for personalized product recommendations.

**Language**: Traditional Chinese ONLY (繁體中文). No i18n, no English toggle.
**Deployment**: Vercel
**Primary Reference**: KuP app (80% design influence — adapted for desktop web)
**Secondary Reference**: ohmyglow.co (web layout patterns, blog structure, product sourcing)
**Positioning**: E-commerce first, AI skin analysis second

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16+ (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Shaders | shaders package (Aurora, Swirl, FilmGrain — kept from v1) |
| Animations | Framer Motion |
| Charts | Recharts (radar chart for skin analysis) |
| Fonts | Cormorant Garamond, Outfit, Noto Sans TC, Noto Serif TC, Space Mono |
| AI - Skin Analysis | Google Gemini 3.1 Pro (@google/genai SDK) |
| AI - Chatbot | Google Gemini Flash (@google/genai SDK) |
| Payments | Stripe Checkout |
| CMS | Google Sheets API → JSON sync |
| Image Hosting | ohmyglow.co CDN (initial), Cloudinary (production) |
| Database | Vercel KV / Upstash Redis (orders + sessions) |
| Email | Resend.com |
| Hosting | Vercel |

---

## Design System — "KuP-inspired Clean Shop"

### Color Palette
```css
--bg-primary: #FFFFFF;          /* Clean white background */
--bg-secondary: #F7F7F7;        /* Light gray sections */
--bg-tertiary: #FBF8F5;         /* Warm off-white */
--bg-warm: #F5F0EB;             /* Warm linen (for AI/shader sections) */
--text-primary: #1A1A1A;        /* Near-black text */
--text-secondary: #555555;      /* Secondary text */
--text-muted: #999999;          /* Muted/helper text */
--accent-blue: #4A9FE5;         /* Primary CTA (add to cart, buy) */
--accent-rose: #C17C6A;         /* Secondary accent (AI features) */
--accent-gold: #B8A88A;         /* Luxury/premium badges */
--accent-green: #4CAF50;        /* Success/new badges */
--accent-red: #E53935;          /* Discount/sale tags */
```

### Typography
- **Headings**: Outfit / Noto Sans TC (bold, clean)
- **Body**: Outfit / Noto Sans TC (line-height: 1.7-1.8)
- **Prices**: Space Mono
- **Decorative**: Cormorant Garamond / Noto Serif TC (shader sections only)

### Layout (KuP App → Desktop Web)
- Clean white background (not warm linen)
- Rounded corners: 12-16px
- Product grid: 2-col mobile / 3-col tablet / 4-col desktop
- Category icons in rounded containers with emoji
- Blue CTA buttons (rounded-full for primary)
- Sticky add-to-cart bar on product pages
- Heart/wishlist icons on product cards
- Star ratings on products
- Discount tags in red
- Promotional banners in light blue (#E8F4FD)

### Shader Effects (Preserved from v1)
- **AI Analysis section**: Aurora shader background for visual wow
- **Loading states**: Shader animation during AI processing
- **Hero accent**: Subtle shader on home page AI promotion section
- NOT used for primary shop sections (clean white for those)

---

## Project Structure

```
/src/app
  /layout.tsx              → Root layout (CartProvider, Navbar, Footer)
  /page.tsx                → Home (search, promo, categories, products, blog preview)
  /store/page.tsx          → Product catalog (category tabs, sort, grid)
  /store/[slug]/page.tsx   → Product detail (image, info, reviews, add to cart)
  /categories/page.tsx     → Category browser (sidebar + subcategories)
  /blog/page.tsx           → Blog list (card grid)
  /blog/[slug]/page.tsx    → Blog post (content + product recommendations)
  /cart/page.tsx           → Shopping cart
  /analyze/page.tsx        → AI Skin Analysis
  /checkout/page.tsx       → Checkout with Stripe
  /admin/page.tsx          → Admin panel

/src/components
  /layout                  → Navbar, Footer, GlobalEffects
  /shaders                 → HeroShader, SectionShader, NoiseOverlay, CursorEffect
  /motion                  → FadeIn, StaggerChildren
  /store                   → ProductCard
  /ui                      → MarqueeBanner

/src/data
  /products.ts             → 30+ products (scraped from ohmyglow) with types
  /blogs.ts                → Blog posts data

/src/lib
  /cart-context.tsx         → Cart state (React Context + Provider)
  /utils.ts                → Helpers (cn, formatPrice, calcDiscount)
```

---

## Key Pages & Features

### Home Page (KuP-style)
1. Search bar
2. Promotional banner (dismissable)
3. Category icon grid (8 categories)
4. Featured/bestseller products
5. AI skin analysis promotion (with shader effect)
6. New arrivals
7. Blog preview (3 latest posts)
8. Brand marquee
9. Trust strip

### Store Page
- Category tabs + subcategory filters
- Sort options (recommended, price low/high, newest)
- Product grid with ProductCard components
- Product count

### Product Detail Page (KuP-style)
- Large product image
- Likes count, brand, rating
- Product name, price with discount
- Description section
- Reviews section
- Related products
- Sticky "加入購物車" button

### Blog (ohmyglow-style)
- Blog list: card grid with image, title, date, excerpt
- Blog post: featured image, content, embedded product recommendations
- Products in blog posts link to add-to-cart

### Cart Page (KuP-style)
- Empty state: "您的購物車是空的！" + product suggestions
- Items: image, name, quantity controls, price
- Order summary with shipping threshold

### AI Skin Analysis (Secondary Feature)
- Upload 3 face photos
- Gemini-powered analysis
- Results with product recommendations → add to cart
- Shader-enhanced loading/results

---

## Categories (Matching KuP)

| Main Category | Subcategories |
|--------------|---------------|
| 護膚 | 化妝水, 精華液, 乳液/乳霜, 面膜, 噴霧/精油, 臉部清潔, 眼霜, 防曬護理, 唇部護理 |
| 身體 & 頭髮 | 頭髮護理, 造型定型, 身體護理 |
| 彩妝 | 唇部彩妝, 眼眉彩妝, 臉部彩妝 |
| 美容工具 | 刷具, 粉撲 |
| 食品 | — |
| 居家生活 | — |
| 健康 | — |

---

## Coding Conventions

- All user-facing text in **Traditional Chinese** (繁體中文)
- `'use client'` only for interactive components
- Tailwind for all styling (no CSS Modules except shaders)
- All prices in HKD, formatted as `HK$xxx`
- Product data in `/src/data/products.ts` with typed interfaces
- Cart state via React Context (`useCart` hook)
- All images via Next.js `<Image>` component
- Blue buttons for shop actions, rose accent for AI features
- Product cards show: image, wishlist heart, brand, name, discount, price, rating

---

## Important Notes

- **Shop-first positioning** — online store is the primary function, not AI
- **No medical claims** — AI analysis is "參考" only
- **No photo storage** — face photos processed in-memory
- **Stripe PCI** — use Stripe Checkout only
- **Product images** — currently from ohmyglow.co CDN, will migrate to Cloudinary
- **Blog products** — blog posts embed product recommendations with add-to-cart
