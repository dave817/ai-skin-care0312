# AI Skincare E-Commerce Platform — CLAUDE.md

## Project Overview
AI-powered skincare e-commerce platform for the Hong Kong market. Users upload face photos, receive AI skin analysis via Gemini, get personalized product recommendations, and shop — all wrapped in a visually stunning, shader-enhanced UI.

**Language**: Traditional Chinese ONLY (繁體中文). No i18n, no English toggle.
**Deployment**: Vercel
**Reference design**: ohmyglow.co (for store layout), but with "Anti-AI Aesthetic" (see Design section)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14+ (App Router, TypeScript) |
| Styling | Tailwind CSS + CSS Modules for custom effects |
| UI Components | shadcn/ui (customized with brand palette) |
| Shaders | @paper-design/shaders OR custom GLSL via react-shaders |
| Animations | Framer Motion |
| Charts | Recharts (radar chart for skin analysis) |
| Fonts | Cormorant Garamond, Outfit, Noto Sans TC, Noto Serif TC (Google Fonts) |
| AI - Skin Analysis | Google Gemini 3.1 Pro (@google/genai SDK) |
| AI - Chatbot | Google Gemini Flash (@google/genai SDK) |
| Payments | Stripe Checkout |
| CMS | Google Sheets API → JSON sync |
| Image Hosting | Cloudinary (free tier) |
| Database | Vercel KV / Upstash Redis (orders + sessions) or JSON + GitHub |
| Email | Resend.com (free tier) |
| Hosting | Vercel (free tier to start) |

---

## Design System — "Dermatologist's Atelier" (Anti-AI Aesthetic)

### Color Palette (CSS Variables)
```css
--bg-primary: #F5F0EB;      /* Warm linen (NOT white) */
--bg-secondary: #E8E4DC;    /* Soft sage */
--text-primary: #3A3028;    /* Deep walnut (NOT black) */
--accent-rose: #C17C6A;     /* Terracotta rose — primary accent */
--accent-gold: #B8A88A;     /* Muted gold — luxury */
--accent-green: #7A9E8E;    /* Eucalyptus — health/success */
--error: #D4776B;           /* Soft coral */
```

### Typography
- **Chinese Headings**: Noto Serif TC (serif, editorial)
- **Chinese Body**: Noto Sans TC (line-height: 1.8)
- **English/Latin Headings**: Cormorant Garamond
- **English/Latin Body**: Outfit
- **Accents/Labels/Prices**: Space Mono or Syne

### Layout Rules
- Generous whitespace: minimum 80px between major sections
- Asymmetric hero layouts
- Product grid: 2-col mobile / 3-col tablet / 4-col desktop
- Rounded corners: 12-16px (organic, never sharp)
- Scroll-triggered fade-in with subtle upward drift (Framer Motion)
- Subtle paper/linen noise texture on body background

### STRICT VISUAL DON'TS
- ❌ Purple/blue gradients on white
- ❌ Inter, Roboto, or system fonts as primary typeface
- ❌ Perfectly symmetrical hero sections
- ❌ Stock photos of people touching faces
- ❌ Cookie-cutter cards with identical shadows
- ❌ Rainbow gradient CTAs
- ❌ Overly animated elements

### Shader Effects
| Location | Effect | Purpose |
|----------|--------|---------|
| Hero background | Organic fluid gradient (aurora/silk) | "This isn't AI-generated" signal |
| Skin analysis loading | Particle morphing / DNA helix | Premium wait experience |
| CTA button hover | Subtle iridescent shimmer | Luxury tactile feel |
| Skin score gauge | Radial gradient with glow | Score feels alive |
| Section backgrounds | Subtle noise/grain overlay | Analog warmth |

**Shader Rules**: CSS fallback for no-WebGL, lazy-init (don't block FCP), cap devicePixelRatio at 2, test on mobile Safari, keep fragment shaders under 50 lines.

---

## Project Structure

```
/app
  /layout.tsx              → Root layout with fonts, theme, metadata
  /page.tsx                → Home page (shader hero, how-it-works, featured products)
  /analyze/page.tsx        → AI Skin Analysis (upload → loading → results)
  /store/page.tsx          → Product catalog with filters
  /store/[slug]/page.tsx   → Product detail page
  /cart/page.tsx           → Shopping cart
  /checkout/page.tsx       → Checkout with Stripe
  /order-confirmation/page.tsx
  /admin/page.tsx          → Password-protected admin panel
  /api
    /analyze-skin/route.ts → Gemini 3.1 Pro endpoint (receives 3 images)
    /chat/route.ts         → Gemini Flash streaming chat
    /products/route.ts     → Product catalog from cached JSON
    /sync-products/route.ts → Google Sheets → JSON sync
    /checkout/route.ts     → Stripe session creation
    /webhook/stripe/route.ts → Stripe payment webhook
    /orders/route.ts       → Admin: list orders
    /orders/[id]/tracking/route.ts → Admin: update tracking

/components
  /ui                      → shadcn/ui components (customized)
  /shaders                 → WebGL shader components + CSS fallbacks
  /layout                  → Navbar, Footer, ChatBubble
  /analysis                → Upload zones, Results, ScoreGauge, RadarChart
  /store                   → ProductCard, ProductGrid, CategoryTabs, Filters
  /cart                    → CartDrawer, CartItem, CartSummary
  /chat                    → ChatWidget, ChatMessage, ProductCardInline

/lib
  /gemini.ts               → Gemini API client setup
  /stripe.ts               → Stripe client setup
  /sheets.ts               → Google Sheets sync logic
  /products.ts             → Product data loading + types
  /cart-context.tsx         → Cart state (React Context)
  /analysis-context.tsx    → Skin analysis results state

/data
  /products.json           → Cached product catalog (synced from Google Sheets)

/public
  /textures                → Noise/grain SVGs, hand-drawn dividers
  /images                  → Placeholder assets
```

---

## Build Phases

### Phase 1: Project Scaffold & Design Foundation
- Initialize Next.js 14+ with TypeScript + Tailwind + App Router
- Install all dependencies (shadcn/ui, framer-motion, recharts, stripe, @google/genai, lucide-react, @paper-design/shaders)
- Set up CSS variables, fonts (Google Fonts), global styles
- Create base layout: Navbar (logo, nav links, cart icon) + Footer
- Add paper/linen noise texture background
- Set up SVG hand-drawn section dividers
- **Deliverable**: Clean, styled shell with navigation — already looks premium

### Phase 2: Shader-Enhanced Home Page (VISUAL PRIORITY)
- Full-viewport shader hero section with organic fluid gradient (#C17C6A → #B8A88A → #7A9E8E)
- Headline: 「你的肌膚，值得被真正了解。」
- Two CTAs: 「AI 膚質分析」 + 「瀏覽產品」
- How-it-works 3-step section with staggered scroll animations
- Featured products carousel (mock data)
- Trust strip with key metrics
- Floating chat bubble (UI only, not functional yet)
- **Deliverable**: Stunning home page — the "wow" demo for client

### Phase 3: Store & Product Pages
- Create mock products.json with 20+ products (realistic HKD prices, zh names, categories, skin concern tags)
- Store page: category tabs, sort/filter, product grid with staggered fade-in
- Product detail page: image gallery, info, tabs (description/ingredients/usage), related products
- Cart context (React Context): add/remove/quantity
- Cart page: line items, subtotal, checkout CTA
- Navbar cart icon with item count badge
- **Deliverable**: Fully browsable, beautiful store

### Phase 4: AI Skin Analysis
- Upload UI: 3 zones (left/front/right) with face silhouette placeholders
- Camera capture support (mobile) + drag-drop (desktop)
- Shader-powered loading animation during analysis
- Backend /api/analyze-skin: Gemini 3.1 Pro with product catalog context
- Results page: animated score gauge, radar chart, concern cards, product recommendations with "加入購物車"
- Analysis context for chatbot access
- Medical disclaimers (「AI 分析僅供參考，不構成醫療建議」)
- **Deliverable**: Core AI feature working end-to-end

### Phase 5: AI Chatbot
- Floating chat widget (bottom-right, expands to panel)
- Chat UI: message bubbles, typing indicator, suggested quick replies
- Backend /api/chat: Gemini Flash with streaming, product catalog + skin analysis context
- Inline product cards in chat with "加入購物車"
- Full-screen chat on mobile
- **Deliverable**: AI advisor working with product recommendations

### Phase 6: Checkout & Orders
- Checkout page: shipping form (SF Express address/pickup point), order summary
- Stripe Checkout integration (/api/checkout → Stripe session)
- Stripe webhook for payment confirmation
- Order confirmation page
- Owner notification (email via Resend, WhatsApp webhook placeholder)
- Admin panel: orders list, order detail, tracking number input, product sync button
- **Deliverable**: Complete purchase flow

### Phase 7: Google Sheets CMS
- Google Sheets API integration (service account)
- /api/sync-products: fetch sheet → transform → products.json
- Admin "同步產品" button
- Cloudinary image URLs in spreadsheet
- **Deliverable**: Non-technical product management

### Phase 8: Polish & Performance
- All shader effects finalized with CSS fallbacks
- Framer Motion page transitions
- Image optimization (Next.js Image + Cloudinary)
- Font optimization (display swap, preload)
- SEO: meta tags, Open Graph, JSON-LD Product schema, sitemap.xml
- Accessibility: ARIA labels, keyboard nav, color contrast
- Mobile testing (iPhone SE → iPhone 15 Pro Max)
- **Deliverable**: Production-ready, polished website

---

## API Keys Required (Environment Variables)

```env
# Gemini AI
GOOGLE_GEMINI_API_KEY=          # Google AI Studio API key

# Stripe
STRIPE_SECRET_KEY=              # Stripe secret key
STRIPE_PUBLISHABLE_KEY=         # Stripe publishable key
STRIPE_WEBHOOK_SECRET=          # Stripe webhook signing secret

# Google Sheets CMS
GOOGLE_SHEETS_ID=               # Spreadsheet ID
GOOGLE_SERVICE_ACCOUNT_EMAIL=   # Service account email
GOOGLE_SERVICE_ACCOUNT_KEY=     # Service account private key (JSON)

# Cloudinary (optional — images via URL in sheets)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email
RESEND_API_KEY=                 # Resend.com API key

# Admin
ADMIN_PASSWORD=                 # Simple admin panel password

# WhatsApp (placeholder)
WHATSAPP_WEBHOOK_URL=           # Owner notification webhook
```

---

## Coding Conventions

- All user-facing text in **Traditional Chinese** (繁體中文). No English fallbacks.
- Use `'use client'` only when needed (interactive components). Default to Server Components.
- Tailwind for layout + spacing. CSS Modules only for shader/custom effects.
- shadcn/ui components customized with brand palette — never use defaults.
- All prices in HKD, formatted as `HK$xxx`.
- Product data types defined in `/lib/products.ts`.
- Error boundaries on AI features (graceful degradation if Gemini fails).
- All images via Next.js `<Image>` component for optimization.
- Shader components must export a `<noscript>` / CSS fallback variant.

---

## Important Notes

- **No medical claims** — AI analysis is "參考" (reference) only, always include disclaimer.
- **No photo storage** — face photos processed in-memory, never persisted.
- **Privacy** — include privacy policy page (HK Personal Data Privacy Ordinance).
- **Stripe PCI** — use Stripe Checkout/Elements only, never handle card data.
- **Visual quality is the #1 priority** — the site must look handcrafted and premium, never generic.
