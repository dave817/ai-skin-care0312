# AI Skincare E-Commerce Website — Product Description Document

> A complete product specification for building an AI-powered skincare analysis and e-commerce platform. Designed as a build guide for Claude Code.

---

## 1. Product Vision

### One-Liner
An AI-powered skincare e-commerce platform where users upload photos of their face, receive instant skin analysis from Gemini 3.1 Pro, get personalized product recommendations linked directly to an integrated shopping cart, and can chat with an AI skincare advisor — all wrapped in a visually stunning, shader-enhanced UI that feels handcrafted, not AI-generated.

### The Core Problem
Most skincare shoppers don't know what their skin actually needs. They browse overwhelming product catalogs, read conflicting reviews, and end up buying based on marketing hype rather than their actual skin condition. This creates two problems: buyers waste money on wrong products, and sellers suffer high return rates and low repeat purchases.

### The Solution
Replace guesswork with AI-powered visual analysis. A user uploads three photos of their face (left / front / right), Gemini 3.1 Pro analyzes their skin condition across multiple dimensions (texture, tone, hydration, pores, pigmentation, fine lines, acne), and immediately recommends specific products from the store — with one-click add-to-cart. The experience feels like visiting a premium dermatologist's office, not browsing a generic online shop.

### Target Market
- **Primary**: Women aged 25-45 in Hong Kong / Guangdong, skincare-conscious, willing to spend HKD 200-800/month on skincare
- **Secondary**: Men with growing interest in grooming / skincare basics
- **Language**: Traditional Chinese (primary), English (secondary)
- **Payment**: Credit card (Stripe), potentially FPS/PayMe later
- **Delivery**: SF Express (順豐速運), arranged by shop owner after order

---

## 2. Core Features

### Feature 1: AI Skin Analysis (Gemini 3.1 Pro)

**User Flow:**
1. User lands on "AI 膚質分析" page
2. Guided upload UI asks for 3 photos: left profile → front face → right profile
3. Camera guidelines shown (good lighting, no makeup, neutral expression, plain background)
4. User uploads or takes photos directly (mobile camera access)
5. Photos are sent to backend → Gemini 3.1 Pro API with structured analysis prompt
6. AI returns structured JSON analysis covering:
   - **Skin Type**: Oily / Dry / Combination / Sensitive / Normal
   - **Skin Concerns** (scored 1-10): Acne, Pores, Dark Spots/Pigmentation, Fine Lines/Wrinkles, Redness/Sensitivity, Dehydration, Uneven Texture, Dark Circles
   - **Overall Skin Health Score**: 0-100
   - **Personalized Summary**: 2-3 sentences in user's language explaining their skin condition
   - **Recommended Routine**: Morning + Evening routine steps
   - **Product Recommendations**: Matched from the store's product catalog (passed in the prompt as context)
7. Beautiful results page with:
   - Radar chart visualization of skin concerns
   - Skin health score with animated gauge
   - Concern-by-concern breakdown with brief explanation
   - **Product recommendation cards** — each with product image, name, price, match reason, and **"Add to Cart"** button
   - "Chat with AI Advisor" CTA for follow-up questions
8. User can save/share their analysis report

**Technical Implementation:**
```
Frontend: React component with drag-drop + camera capture
Backend API route: /api/analyze-skin
  → Receives 3 base64 images
  → Constructs Gemini 3.1 Pro prompt with:
    - System instruction (dermatologist persona, structured output format)
    - Product catalog JSON (injected from CMS data)
    - 3 images as multimodal input
  → Returns structured JSON
  → Frontend renders analysis + product cards
Model: gemini-3.1-pro-preview (or latest stable Gemini 3.x Pro)
```

**Gemini System Prompt Guidelines:**
- Persona: "You are an experienced dermatologist and skincare consultant"
- Never diagnose medical conditions — use language like "appears to show signs of" and "you may want to consider"
- Always recommend consulting a dermatologist for serious concerns
- Output must be structured JSON matching the frontend schema
- Product recommendations must reference actual product IDs from the injected catalog
- Support both English and Traditional Chinese responses (detect from user preference)
- Include disclaimer: analysis is for reference only, not medical advice

**Important Disclaimers (must appear on the page):**
- "AI 分析僅供參考，不構成醫療建議。如有皮膚問題，請諮詢專業皮膚科醫生。"
- "AI analysis is for reference only and does not constitute medical advice. Please consult a dermatologist for skin concerns."

---

### Feature 2: AI Skincare Chatbot (Gemini Flash)

**Purpose:** Answer user questions about their skin analysis results, product ingredients, skincare routines, and general skincare knowledge. Similar to Chatbase but custom-built with the store's product catalog baked in.

**User Flow:**
1. Floating chat bubble (bottom-right) on all pages
2. Click to expand into chat panel
3. If user has completed a skin analysis, the chatbot has that context
4. Suggested quick replies: "What's my skin type?", "推薦早晚護膚程序", "這個產品適合我嗎?", "成分問題"
5. Chatbot answers in the language the user writes in
6. When recommending products, chatbot renders interactive product cards with "Add to Cart" buttons inline

**Technical Implementation:**
```
Model: gemini-2.5-flash (or latest Gemini Flash — optimized for speed + cost)
Context injection:
  - Product catalog with descriptions, ingredients, prices
  - User's skin analysis results (if available, stored in session)
  - Skincare knowledge base (common ingredients, routines, skin types)
Streaming: Yes, for real-time typing effect
API route: /api/chat
```

**Chatbot Behavior Rules:**
- Never claim products can cure, treat, or heal medical conditions
- Recommend seeing a dermatologist for persistent acne, rashes, or unusual changes
- Can explain ingredients (niacinamide, retinol, hyaluronic acid, etc.) and their benefits
- Can suggest routines (morning/evening, layering order)
- Should gently guide toward products available in the store
- Bilingual: respond in the language the user writes in

---

### Feature 3: Online Store (ohmyglow.co Style)

**Design Reference:** ohmyglow.co — a Hong Kong K-beauty e-commerce site featuring:
- Top announcement bar with promotions and payment methods
- Clean product grid with product image, brand name, product name, original price, sale price, discount badge
- Category navigation (skincare subcategories: cleansers, toners, serums, moisturizers, sunscreen, masks, etc.)
- Product detail pages with multiple images, detailed descriptions, ingredients, usage instructions
- Shopping cart with quantity adjustment
- Checkout with Stripe payment

**Store Pages:**
- `/store` — Product catalog with category filters, sorting (new/bestseller/price), search
- `/store/[slug]` — Product detail page
- `/cart` — Shopping cart
- `/checkout` — Stripe Checkout
- `/order-confirmation` — Thank you page with SF Express tracking info

**Product Card Design:**
- Product image (hover for second image if available)
- Brand name (small, above product name)
- Product name (Traditional Chinese primary, English subtitle)
- Original price (strikethrough) + sale price + discount percentage badge
- "Add to Cart" button
- "New" / "Bestseller" / "Limited" badges where applicable

**Checkout Flow:**
1. Cart review (adjust quantities, remove items)
2. Shipping info form (name, phone, address — HK addresses for SF Express)
3. Stripe Checkout (credit card)
4. Order confirmation email
5. Shop owner receives order notification (email/WhatsApp webhook)
6. Owner arranges SF Express delivery manually
7. Owner updates tracking number via CMS → customer receives notification

---

### Feature 4: Google Sheets CMS

**The Concept:** The shop owner (non-technical) manages products via a Google Sheets spreadsheet. Changes to the spreadsheet automatically reflect on the website.

**Spreadsheet Structure:**

| Column | Field | Type | Example |
|---|---|---|---|
| A | product_id | string | `SKU001` |
| B | brand | string | `COSRX` |
| C | name_zh | string | `低pH值早安凝膠潔面乳` |
| D | name_en | string | `Low pH Good Morning Gel Cleanser` |
| E | category | string | `cleanser` |
| F | subcategory | string | `gel-cleanser` |
| G | price_original | number | `128` |
| H | price_sale | number | `98` |
| I | currency | string | `HKD` |
| J | description_zh | text | (product description in Chinese) |
| K | description_en | text | (product description in English) |
| L | ingredients | text | (full ingredient list) |
| M | usage_zh | text | (usage instructions in Chinese) |
| N | usage_en | text | (usage instructions in English) |
| O | image_urls | text | (comma-separated URLs to product images hosted on Google Drive/Imgur/Cloudinary) |
| P | tags | text | `new,bestseller,acne-prone` |
| Q | stock | number | `50` |
| R | active | boolean | `TRUE` |
| S | skin_concerns | text | `acne,oily,pores` (for AI matching) |
| T | volume | string | `150ml` |

**Sync Mechanism (Options, ranked by simplicity):**

**Option A: Google Sheets API → Build Script (Recommended)**
- A Next.js API route or GitHub Action fetches data from Google Sheets API
- Transforms into JSON product catalog
- Commits to repo or stores in a JSON file / database
- Website rebuilds (Vercel auto-deploys on push) or uses ISR (Incremental Static Regeneration)
- Owner clicks a "Sync" button on a simple admin page, or it runs on a schedule (every 30 min)

**Option B: Google Apps Script Webhook**
- Google Apps Script triggers on spreadsheet edit
- Sends webhook to a Next.js API endpoint
- Endpoint fetches latest sheet data and updates the product JSON
- Near real-time updates

**Option C: Direct Fetch at Runtime**
- Website fetches Google Sheets data at build time via `getStaticProps` or at request time via API
- Simplest but slowest; caching needed
- No GitHub commit needed

**Image Hosting:**
- Owner uploads product images to a shared Google Drive folder or Cloudinary
- Image URLs are pasted into the spreadsheet
- Recommendation: Use Cloudinary (free tier: 25GB) for automatic image optimization, resizing, and CDN delivery

---

## 3. Design Philosophy — Anti-AI Aesthetic

### The Problem with "AI Look"
As you articulated perfectly:

> 那種千篇一律的「AI 味」會大幅降低購買意願 — 因為它傳遞出一種「不想花心思」的信號，直接扼殺了信任感。

Generic AI-generated UI (purple gradients, Inter font, predictable card layouts, generic illustrations) signals laziness and destroys trust. For a skincare brand where trust = conversions, the UI must feel deliberately crafted by a human designer.

### The Shader Strategy

WebGL/GLSL shaders inject a layer of visual sophistication that AI currently cannot replicate. They create organic, living textures that feel handmade.

**Shader Libraries to Use:**
- **shaders.com (npm: `@paper-design/shaders`)** — Visual editor + framework components (Vue/React/Svelte/Solid). Design in the editor, export production-ready code. Best option for non-shader-programmers.
- **react-shaders / shadertoy-react** — Drop Shadertoy GLSL code directly into React components. Good for custom effects.
- **Three.js `shaderMaterial`** via `@react-three/fiber` — Maximum control for complex 3D shader effects.

**Where to Apply Shaders:**

| Location | Shader Effect | Purpose |
|---|---|---|
| **Hero section background** | Organic fluid gradient (aurora/silk effect) | Instant "this isn't AI-generated" signal. Living, breathing texture. |
| **Skin analysis loading screen** | Particle morphing / DNA helix shader | Makes the 5-10 second Gemini analysis wait feel premium, not broken |
| **Product category transitions** | Smooth liquid distortion on page transitions | Delight micro-moment |
| **CTA button hover states** | Subtle iridescent / holographic shimmer | Luxury tactile feel without being gimmicky |
| **Skin health score gauge** | Radial gradient shader with glow | Makes the score feel alive, not like a static chart |
| **Background textures** | Subtle noise/grain overlay on sections | Breaks the "flat white digital" feel, adds analog warmth |

**Shader Performance Rules:**
- Always provide a CSS fallback for devices without WebGL support
- Use `requestAnimationFrame` and throttle on mobile
- Keep fragment shaders under 50 lines for hero backgrounds
- Test on older iPhones (A12 chip minimum) — many HK users use iPhone
- Use `devicePixelRatio` capping at 2x to prevent GPU overload on Retina screens
- Lazy-initialize shaders (don't block first paint)

### Visual Design Direction: "Dermatologist's Atelier"

**Concept:** The intersection of a premium skincare clinic and an artisan workshop. Clean enough to trust, textured enough to feel human.

**Typography:**
- Headings: **Cormorant Garamond** (serif, elegant, editorial) or **Noto Serif TC** for Chinese headings
- Body: **Outfit** or **DM Sans** (clean sans-serif, modern but warm)
- Chinese body: **Noto Sans TC** with generous line-height (1.8)
- Accent/labels: **Syne** or **Space Mono** (for prices, badges — adds contrast)

**Color Palette:**
- Primary background: Warm linen `#F5F0EB` (not sterile white)
- Secondary background: Soft sage `#E8E4DC` (for alternating sections)
- Text: Deep walnut `#3A3028` (warmer than pure black)
- Primary accent: Terracotta rose `#C17C6A` (warmth, skin-tone adjacent)
- Secondary accent: Muted gold `#B8A88A` (luxury without flashiness)
- Success/health: Eucalyptus green `#7A9E8E`
- Error: Soft coral `#D4776B`
- Shader gradient colors: `#C17C6A` → `#B8A88A` → `#7A9E8E` (skin → gold → health)

**Textures & Details:**
- Subtle paper/linen noise texture overlay on background (CSS `background-image` with SVG noise or a shader)
- Thin hand-drawn-style dividers between sections (SVG, not CSS borders)
- Product images on soft shadow with warm tint, not harsh drop shadows
- Rounded corners at 12-16px (soft, organic) — never sharp corners
- Photography style: soft natural lighting, warm tones, dewy skin aesthetic

**Layout Principles:**
- Generous whitespace (minimum 80px between major sections)
- Asymmetric hero layouts (text left, image right, offset vertically)
- Product grid: 2 columns mobile, 3 tablet, 4 desktop — with staggered entry animations
- Scroll-triggered fade-in with subtle upward drift (not bouncy)
- No generic icons — use custom SVG line illustrations or none at all

**What to AVOID:**
- Purple/blue gradients on white (the #1 AI cliché)
- Inter, Roboto, or any system font as the primary typeface
- Perfectly symmetrical hero sections
- Stock photos of people touching their faces (use textures/products instead, or custom photography later)
- Cookie-cutter card components with identical shadows
- Rainbow gradient CTAs
- Overly animated elements (motion should be subtle and purposeful)

---

## 4. Technical Architecture

### Recommended Stack

```
Framework:          Next.js 14+ (App Router)
Language:           TypeScript
Styling:            Tailwind CSS + CSS Modules for custom effects
UI Components:      shadcn/ui (customized with the palette above)
Shaders:            @paper-design/shaders OR react-shaders + custom GLSL
3D (if needed):     Three.js via @react-three/fiber
Animations:         Framer Motion
Charts:             Recharts (for radar chart in skin analysis)
i18n:               next-intl (EN + Traditional Chinese)
Fonts:              Google Fonts (Cormorant Garamond, Outfit, Noto Sans TC, Noto Serif TC)

AI - Skin Analysis: Google Gemini 3.1 Pro API (@google/genai SDK)
AI - Chatbot:       Google Gemini Flash API (@google/genai SDK)

Payments:           Stripe Checkout
CMS:                Google Sheets API → JSON sync
Image hosting:      Cloudinary (free tier)
Deployment:         Vercel (frontend) — free tier sufficient to start
Database:           Vercel KV or Upstash Redis (for orders + session) — or simple JSON + GitHub

Notifications:      Email (Resend.com free tier) + WhatsApp Business API webhook
Shipping:           SF Express (manual fulfillment by owner, tracking number entry via admin)
```

### API Routes

```
POST /api/analyze-skin        → Receives 3 images, calls Gemini 3.1 Pro, returns analysis JSON
POST /api/chat                → Streaming chat endpoint, calls Gemini Flash
GET  /api/products            → Returns product catalog (from cached Google Sheets data)
POST /api/sync-products       → Triggers Google Sheets → JSON sync (admin only)
POST /api/checkout            → Creates Stripe Checkout session
POST /api/webhook/stripe      → Stripe webhook for payment confirmation
POST /api/webhook/order-notify → Sends order notification to owner (email + WhatsApp)
GET  /api/orders              → Admin: list orders
PUT  /api/orders/[id]/tracking → Admin: update SF Express tracking number
```

### Data Flow Diagram

```
[Google Sheets] → (sync script) → [products.json in repo/KV]
                                        ↓
[User browses store] ←── [Next.js SSG/ISR] ←── [products.json]
                                        ↓
[User uploads face photos] → [/api/analyze-skin] → [Gemini 3.1 Pro + product catalog]
                                        ↓
[Analysis results + product recommendations] → [Add to Cart]
                                        ↓
[Cart → Checkout] → [Stripe] → [/api/webhook/stripe] → [Order saved]
                                        ↓
[Owner notified via email/WhatsApp] → [Packs & ships via SF Express]
                                        ↓
[Owner enters tracking number in admin] → [Customer receives tracking notification]
```

---

## 5. Page-by-Page Specification

### 5.1 Home Page `/`

- **Shader hero section**: Full-viewport organic fluid gradient background with headline overlay. "你的肌膚，值得被真正了解。" / "Your skin deserves to be truly understood."
- **Two primary CTAs**: "AI 膚質分析" (leads to analysis page) + "瀏覽產品" (leads to store)
- **Trust strip**: Key stats/trust signals (e.g., "10,000+ skin analyses", "50+ curated products", "SF Express 順豐送貨")
- **How it works**: 3-step visual (Upload → Analyze → Shop) with subtle animations
- **Featured products carousel**: Bestsellers with hover effects
- **Testimonial section**: Customer quotes (text only, no photos initially)
- **AI chatbot floating button**

### 5.2 AI Skin Analysis `/analyze`

- **Upload interface**: Three-zone upload (left / front / right) with camera guidelines
- **Mobile**: Direct camera access with face-alignment overlay guide
- **Desktop**: Drag-and-drop zones with file picker fallback
- **Loading state**: Shader-powered animation (particle morphing or DNA helix) while Gemini processes (5-15 seconds)
- **Results page** (dynamically rendered after analysis):
  - Overall skin health score (animated gauge with shader glow)
  - Skin type badge
  - Radar chart of concerns
  - Concern-by-concern cards with score, explanation, and matched product(s)
  - Morning + Evening routine recommendation
  - Product recommendation section with "Add to Cart" buttons
  - "Save My Analysis" / "Share" buttons
  - "Chat with Advisor" CTA
  - Disclaimer text

### 5.3 Store `/store`

- **Sticky category navigation** (horizontal scrollable tabs): All, Cleanser, Toner, Serum, Moisturizer, Sunscreen, Mask, Eye Care, Special Care
- **Sort/Filter bar**: Sort by (new / bestseller / price low→high / price high→low), Filter by skin concern
- **Product grid**: 2-col mobile / 3-col tablet / 4-col desktop
- **Product cards**: Image, brand, name (zh), price, discount badge, quick "Add to Cart" button
- **Pagination or infinite scroll**
- **Empty state for zero results with suggestion to try AI analysis**

### 5.4 Product Detail `/store/[slug]`

- **Image gallery** (swipeable on mobile, thumbnails on desktop)
- **Product info**: Brand, name (zh + en), price, volume, stock status
- **"Add to Cart" button** (sticky on mobile)
- **AI match badge** (if user came from analysis: "AI推薦: 適合您的膚質")
- **Tabs or accordion**: Description, Ingredients, How to Use
- **Skin concern tags**: clickable, link to store filtered by that concern
- **Related products section**

### 5.5 Cart `/cart`

- **Line items** with image, name, quantity adjuster, price, remove button
- **Subtotal, shipping note** ("SF Express 免費送貨 滿$300" or similar)
- **"Proceed to Checkout" button**
- **"Continue Shopping" link**
- **Cross-sell: "Complete Your Routine" — products that complement what's in cart**

### 5.6 Checkout `/checkout`

- **Shipping form**: Name, phone, SF Express address or pickup point
- **Order summary sidebar**
- **Stripe Checkout redirect** (or embedded Stripe Elements)
- **On success → /order-confirmation**

### 5.7 Order Confirmation `/order-confirmation`

- **Thank you message with order number**
- **Order summary**
- **SF Express tracking info** (placeholder until owner updates)
- **"Continue shopping" / "Do another skin analysis" CTAs**

### 5.8 Simple Admin `/admin` (Password-protected)

- **Orders list**: Order ID, date, customer, total, status (new/shipped/delivered)
- **Order detail**: Items, customer info, payment status
- **Update tracking number** (input field → saves and notifies customer)
- **"Sync Products" button** (triggers Google Sheets re-fetch)
- **Basic analytics**: Total orders, revenue, popular products

---

## 6. Accounts & Services Needed Before Building

| Service | Purpose | Cost | Setup Time |
|---|---|---|---|
| **Google AI Studio / Gemini API key** | Skin analysis (3.1 Pro) + Chatbot (Flash) | Free tier generous; pay-as-you-go after | 10 min |
| **Stripe account** | Credit card payments | 2.9% + 30¢ per transaction | 15 min |
| **Google Cloud project** | Google Sheets API access | Free | 10 min |
| **Google Sheets** | Product CMS spreadsheet | Free | 10 min |
| **Cloudinary account** | Product image hosting + CDN | Free tier: 25GB | 5 min |
| **Vercel account** | Website hosting + deployment | Free tier sufficient | 5 min |
| **Resend.com account** | Transactional emails (order confirmation) | Free tier: 3000 emails/month | 5 min |
| **Domain name** | Custom URL | ~$10/year | 10 min |
| **SF Express business account** | Shipping (optional — can use personal) | Varies | Owner handles |

---

## 7. Claude Code Build Prompts (Sequential)

### Phase 1: Project Scaffold

```
"Initialize a Next.js 14 project with TypeScript, Tailwind CSS, App Router, and 
the following structure:

/app
  /[locale]         → i18n layout (en, zh-hant)
    /page.tsx       → Home
    /analyze        → AI Skin Analysis
    /store          → Product catalog
    /store/[slug]   → Product detail
    /cart           → Shopping cart
    /checkout       → Checkout
    /order-confirmation
    /admin          → Simple admin panel
  /api
    /analyze-skin   → Gemini 3.1 Pro endpoint
    /chat           → Gemini Flash chat endpoint
    /products       → Product catalog API
    /sync-products  → Google Sheets sync trigger
    /checkout       → Stripe session creation
    /webhook/stripe → Stripe webhook

Install: next-intl, framer-motion, recharts, stripe, @stripe/stripe-js, 
@google/genai, lucide-react, shadcn/ui

Set up CSS variables for the design palette:
  --bg-primary: #F5F0EB (warm linen)
  --bg-secondary: #E8E4DC (soft sage)
  --text-primary: #3A3028 (deep walnut)
  --accent-rose: #C17C6A (terracotta rose)
  --accent-gold: #B8A88A (muted gold)
  --accent-green: #7A9E8E (eucalyptus)

Google Fonts: Cormorant Garamond (headings), Outfit (body EN), 
Noto Sans TC (body CN), Noto Serif TC (headings CN)

Include bilingual i18n setup with language switcher. 
Do NOT use Inter, Roboto, or any generic fonts."
```

### Phase 2: Shader-Enhanced Home Page

```
"Build the home page with a premium, anti-AI-aesthetic design:

1. HERO SECTION: Full-viewport with a WebGL shader background — use 
   @paper-design/shaders or write a custom GLSL fragment shader that creates 
   an organic, slowly morphing fluid gradient using the brand colors 
   (#C17C6A, #B8A88A, #7A9E8E). Overlay with headline text: 
   '你的肌膚，值得被真正了解。' and two CTA buttons.
   IMPORTANT: Include a static CSS gradient fallback for no-WebGL devices.

2. HOW IT WORKS: 3-step section (Upload → AI Analyze → Shop) with 
   staggered scroll-reveal animations via Framer Motion.

3. FEATURED PRODUCTS: Horizontal scrollable carousel with product cards.
   Load from a placeholder products.json for now.

4. TRUST STRIP: Clean horizontal bar with key metrics.

5. Add subtle paper/linen noise texture as CSS background on body.
   Add thin SVG hand-drawn-style section dividers (not CSS borders).

6. Floating AI chatbot bubble (bottom-right, just the button for now).

The design must NOT look AI-generated. Use asymmetric layouts, warm colors, 
generous whitespace (80px+ between sections), serif headings, and the shader 
background as the hero differentiator. Mobile responsive."
```

### Phase 3: AI Skin Analysis Page

```
"Build the AI Skin Analysis page at /analyze with:

1. UPLOAD UI: Three upload zones (left profile / front face / right profile) 
   with illustrated face silhouettes as placeholders. Support drag-drop, 
   file picker, and mobile camera capture (via input type='file' accept='image/*' 
   capture='user'). Show camera guidelines as overlay tips.

2. LOADING STATE: After upload, show a shader-powered loading animation 
   (particle effect or organic morphing shapes) while the AI processes. 
   Show progress text: '正在分析您的膚質...' / 'Analyzing your skin...'

3. BACKEND: Create /api/analyze-skin that:
   - Receives 3 base64 images via POST
   - Loads product catalog from products.json
   - Calls Gemini 3.1 Pro API (@google/genai) with:
     * System prompt: Dermatologist persona, structured JSON output, 
       product matching from catalog, bilingual support
     * The 3 images as multimodal input
     * Instruction to return: skin_type, concerns (array with name + score 1-10), 
       overall_score, summary, morning_routine, evening_routine, 
       recommended_products (array of product_ids with match_reason)
   - Returns parsed JSON

4. RESULTS UI: Render the analysis as:
   - Animated score gauge (0-100) with shader glow effect
   - Skin type badge
   - Radar chart (Recharts) of concern scores
   - Concern cards with score bars, explanation, matched product(s)
   - Routine timeline (morning + evening)
   - Product recommendation cards with 'Add to Cart' buttons
   - Disclaimer footer

Store the analysis results in React state/context so the chatbot can access them.
All text bilingual. Include medical disclaimer prominently."
```

### Phase 4: Store & Product Pages

```
"Build the e-commerce store at /store with ohmyglow.co as the design reference:

1. PRODUCT DATA: Create a Google Sheets sync system:
   - /api/sync-products reads from Google Sheets API (use service account)
   - Transforms sheet rows into products.json
   - For now, create a comprehensive mock products.json with 20 skincare 
     products across categories (cleanser, toner, serum, moisturizer, 
     sunscreen, mask, eye care) with realistic HKD prices, zh/en names, 
     descriptions, and skin concern tags.

2. STORE PAGE:
   - Sticky horizontal category tabs (scrollable on mobile)
   - Sort dropdown (新品 / 暢銷 / 價格低→高 / 價格高→低)
   - Filter by skin concern (checkboxes)
   - Product grid: 2-col mobile, 3-col tablet, 4-col desktop
   - Product cards: image, brand, name_zh, original price, sale price, 
     discount badge, 'Add to Cart' quick button
   - Staggered fade-in animation on scroll

3. PRODUCT DETAIL PAGE /store/[slug]:
   - Image gallery with swipe on mobile
   - Product info (brand, name zh+en, price, volume)
   - 'Add to Cart' button (sticky bottom bar on mobile)
   - Tabs: Description / Ingredients / How to Use
   - Skin concern tags
   - Related products
   - If user has AI analysis and this product was recommended, show 
     'AI 推薦：適合您的膚質' badge

4. CART (React Context/State):
   - Cart icon in navbar with item count badge
   - Cart drawer or page with line items
   - Quantity adjust, remove, subtotal
   - 'Proceed to Checkout' button"
```

### Phase 5: Checkout & Order Management

```
"Implement checkout and order management:

1. CHECKOUT PAGE:
   - Shipping form: name, phone, SF Express delivery address or pickup point code
   - Order summary sidebar
   - 'Pay Now' button → creates Stripe Checkout session via /api/checkout
   - Redirect to Stripe hosted checkout page
   - On success: redirect to /order-confirmation with session_id

2. STRIPE WEBHOOK /api/webhook/stripe:
   - Verify Stripe signature
   - On checkout.session.completed:
     * Save order to JSON file or Vercel KV (order_id, items, customer, 
       total, payment_status, tracking_number: null)
     * Send order confirmation email via Resend
     * Send WhatsApp notification to owner (via WhatsApp Business API 
       or simple webhook URL — placeholder for now)

3. ORDER CONFIRMATION PAGE:
   - Thank you message with order number
   - Order summary
   - 'Tracking number will be provided once shipped' message
   - CTAs: 'Continue Shopping' / 'Do Another Skin Analysis'

4. ADMIN PANEL /admin (simple password protection via middleware):
   - Orders table: ID, date, customer name, total, status
   - Click order → detail view with items, customer info
   - Input field to add SF Express tracking number → saves and triggers 
     customer email notification
   - 'Sync Products from Google Sheets' button
   - Basic stats: total orders, total revenue, top products"
```

### Phase 6: AI Chatbot

```
"Build the AI chatbot component:

1. FLOATING WIDGET: Chat bubble (bottom-right) that expands to chat panel.
   Panel has: header with 'AI 護膚顧問', message list, input field, send button.

2. CHAT UI:
   - User and bot message bubbles with timestamps
   - Bot typing indicator (3 dots animation)
   - Suggested quick replies at the bottom
   - When bot recommends products, render inline product cards with 
     'Add to Cart' buttons (same cart context as store)

3. BACKEND /api/chat:
   - Receives: message, conversation history, user's skin analysis (if exists)
   - Calls Gemini Flash via @google/genai SDK
   - System prompt includes: skincare advisor persona, product catalog, 
     user's skin analysis context, bilingual support, never make medical claims
   - Streams response for real-time typing effect
   - Parses product recommendations in response and renders as cards

4. FULL-SCREEN CHAT PAGE /chat (optional):
   - Same component but full-screen layout
   - Useful for mobile users who want a dedicated chat experience

5. CONTEXT PERSISTENCE:
   - Store conversation history in React state (cleared on page refresh)
   - If user has completed skin analysis, inject results into system prompt
   
Mobile responsive. Chat panel should be full-screen on mobile."
```

### Phase 7: Polish & Shader Effects

```
"Add final polish and shader visual effects:

1. SHADERS:
   - Hero background: organic fluid gradient shader (already done in Phase 2)
   - Skin analysis loading: particle morphing shader during AI processing
   - CTA button hover: subtle iridescent shimmer effect
   - Skin score gauge: radial shader glow
   - Section backgrounds: subtle animated noise/grain overlays
   IMPORTANT: All shaders must have CSS fallbacks. Test on mobile Safari.

2. ANIMATIONS (Framer Motion):
   - Page transitions: subtle fade + slide
   - Product cards: staggered scroll-reveal
   - Skin analysis results: sequential reveal of each section
   - Cart item add: brief pulse animation on cart icon

3. PERFORMANCE:
   - Lazy-load all images (Next.js Image component)
   - Lazy-initialize shaders (don't block first contentful paint)
   - Cap shader devicePixelRatio at 2
   - Optimize fonts: display swap, preload critical fonts
   - Product images via Cloudinary with auto-format and responsive sizing

4. SEO:
   - Meta tags, Open Graph, structured data for products
   - sitemap.xml, robots.txt
   - Product pages with JSON-LD Product schema

5. ACCESSIBILITY:
   - ARIA labels on all interactive elements
   - Keyboard navigation for store and cart
   - Sufficient color contrast (test with the warm palette)
   - Alt text on all product images

6. MOBILE:
   - Test all pages on iPhone SE through iPhone 15 Pro Max widths
   - Sticky bottom bar for 'Add to Cart' on product pages
   - Full-screen chat on mobile
   - Swipe gestures on product image gallery"
```

---

## 8. Legal & Compliance Notes

- **No medical claims**: Never state that products cure, treat, or prevent any skin condition.
- **AI disclaimer**: Every AI-generated analysis must include a visible disclaimer that it's for reference only and not medical advice.
- **Privacy**: Uploaded face photos should be processed in-memory and NOT stored permanently. Make this clear to users.
- **Hong Kong Personal Data (Privacy) Ordinance**: If collecting customer data (name, phone, address for delivery), include a privacy policy page.
- **Stripe PCI compliance**: Using Stripe Checkout/Elements means you don't handle card data directly (PCI SAQ-A level).
- **Product liability**: Include standard e-commerce terms and conditions, return/refund policy.

---

## 9. Post-Launch Roadmap

| Phase | Feature | Timeline |
|---|---|---|
| v1.1 | FPS / PayMe payment integration (via Stripe HK or custom) | Month 2 |
| v1.2 | Before/after photo tracking (users save analyses over time) | Month 2 |
| v1.3 | Loyalty points system (spend HKD → earn points → redeem) | Month 3 |
| v1.4 | WeChat Mini Program version for mainland China traffic | Month 4 |
| v1.5 | Skin concern blog/content section for SEO traffic | Month 3 |
| v1.6 | Referral program ("Share your analysis, get 10% off") | Month 4 |
| v1.7 | SF Express API integration for automated tracking | Month 5 |
| v2.0 | Subscription boxes (monthly curated skincare based on AI analysis) | Month 6 |

---

*This document is designed to be the single source of truth for the entire project. Feed each Phase prompt into Claude Code sequentially. Adjust based on your friend's actual product catalog and branding preferences.*
