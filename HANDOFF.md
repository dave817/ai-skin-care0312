# Dear Glow Beauty — Implementation Handoff (Round 2)

**Status: Build is GREEN. All 14 original tasks delivered. 36 routes compile cleanly.**

---

## Round 2 additions (this session)

### Build & infrastructure
- ✅ **Fixed Google Fonts build timeout** — switched from `next/font/google` to self-hosted via `@fontsource/*` packages. No more network fetches at build time.
- ✅ **Firecrawl MCP configured** — `.mcp.json` with your API key. CLI installed via `firecrawl init --all --browser`. 13 Firecrawl skills installed across AI coding agents.
- ✅ **Storefront refactored to read from Redis repo** — `/`, `/store`, `/store/[slug]`, `/blog`, `/blog/[slug]` are now server components that call `listProducts()` / `listBlogs()`. Admin edits flow to public site automatically. Each public page revalidates every 60s; admin saves trigger immediate `revalidatePath()`.
- ✅ **Tiptap WYSIWYG editor** — replaces the HTML textarea in `BlogForm`. Toolbar with bold/italic/strike, headings, lists, blockquote, code, image upload (direct to Vercel Blob), link, undo/redo.
- ✅ **Stripe scaffolding** — `src/lib/stripe.ts`, `/api/checkout/create-session`, `/api/stripe/webhook`. Checkout page calls Stripe when configured, falls back to demo mode otherwise. Webhook expands `line_items` for proper email rendering.
- ✅ **SF Express scaffolding** — `src/lib/sf-express.ts` with stub `createOrder()` + `querySFTracking()`. Route handler at `/api/shipping/create-order` returns 503 with helpful message until credentials provided.
- ✅ **Resend email integration (LIVE)** — `src/lib/email.ts`. Order confirmation + admin notification emails with HTML escaping. API key wired in.

### Security hardening (from security review findings)
- ✅ **AUTH_SECRET enforcement** — admin auth throws in production if `AUTH_SECRET` isn't set; no longer falls back to `ADMIN_PASSWORD`. Min 16 chars enforced.
- ✅ **HTML sanitization** — `sanitize-html` strips dangerous tags from blog content + product description before storing in Redis. Closes XSS via `dangerouslySetInnerHTML`.
- ✅ **CSRF Origin check** — admin POST/PATCH/DELETE routes verify Origin/Referer matches site URL.
- ✅ **Rate limit on `/api/admin/login`** — 5 attempts / 15 min per IP.
- ✅ **Rate limit on `/api/chat`** — 30 req / 1 min per IP.
- ✅ **Rate limit on `/api/translate-image`** + admin auth required (was open).
- ✅ **Empty bypass token guard** — empty `ADMIN_BYPASS_TOKEN` no longer bypasses rate limits.
- ✅ **Constant-time comparison** for bypass token (prevents timing leak).
- ✅ **Email HTML escaping** — `escapeHtml()` applied to all dynamic values inserted into order email templates.
- ✅ **Cache invalidation** — admin save calls `revalidatePath()` + `invalidateCatalogCache()` so AI catalog and storefront refresh immediately.
- ✅ **Stripe webhook line items** — retrieves session with `expand: ['line_items.data.price.product']` so order confirmation email renders actual products.

### Accessibility (from a11y audit findings)
- ✅ **Hero carousel reduced-motion** — `useReducedMotion()` from Framer Motion disables auto-advance when user prefers reduced motion. Visible Pause/Play toggle when motion is enabled. 8s interval (up from 6s) for Cantonese reading speed.
- ✅ **Hero carousel ARIA** — `aria-roledescription="carousel"`, slide groups labeled "第 N 張，共 M 張", focus-visible outlines on prev/next/dots, `aria-current` on active dot.
- ✅ **Carousel dot touch targets** — wrapper button now 24×24px (with inner 1.5px pill visual). Meets WCAG 2.5.8.
- ✅ **Chat drawer dialog semantics** — `aria-modal="true"`, `aria-labelledby`, focus moves to close button on open and restores on close, Esc closes, backdrop on all breakpoints, dedicated X close button.
- ✅ **Chat streaming aria-live** — message log has `role="log" aria-live="polite"` so screen readers hear AI replies.
- ✅ **Color contrast fix** — `--text-muted` darkened from `#999999` (2.85:1, fails WCAG AA) → `#6B6B6B` (4.55:1, passes).

### Performance fixes (from code review findings)
- ✅ **Deduped `listProducts()` calls** in `/store/[slug]` — was calling Redis pipeline twice per page load, now once.
- ✅ **Catalog cache invalidation hooks** — admin product/blog mutations call `invalidateCatalogCache()`.

---

## Required setup before going live

### Already wired (working with provided keys)
- ✅ `VERTEX_API_KEY` — Vertex AI Express Mode
- ✅ `RESEND_API_KEY` — Resend email
- ✅ Firecrawl MCP API key

### You must add to `.env.local` before deploying
```bash
# Generate strong secrets
AUTH_SECRET=$(openssl rand -base64 32)
ADMIN_PASSWORD=YourStrongPassword123!
ADMIN_BYPASS_TOKEN=$(openssl rand -hex 16)

# From Upstash dashboard (free tier)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# From Vercel dashboard → Storage → Blob
BLOB_READ_WRITE_TOKEN=...

# Resend — verify a domain so you can send from @dearglowbeauty.com
# Without domain verification, RESEND_FROM_EMAIL must remain onboarding@resend.dev (Resend sandbox)
RESEND_FROM_EMAIL=onboarding@resend.dev    # OR your verified domain
RESEND_ADMIN_EMAIL=your-admin@email.com    # gets notified on new orders

# Site
NEXT_PUBLIC_SITE_URL=https://dearglowbeauty.com   # production URL
AUTH_URL=https://dearglowbeauty.com
```

### Need from your client (Phase 2)
```bash
# Stripe — get from Stripe Dashboard → Developers → API keys
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...    # from Stripe webhook endpoint setup

# SF Express HK — register merchant account at https://open.sf-express.com
SF_APP_KEY=...
SF_APP_SECRET=...
SF_MERCHANT_CODE=...
```

---

## Quick test checklist (after env setup)

```bash
npm run dev
```

1. **Home** — hero carousel auto-advances (or paused if reduced-motion). Featured/new products + blog preview render from Redis.
2. **`/analyze`** — upload front photo → returns enriched analysis. Quota badge shows "今日剩餘 X/5 次".
3. **Chat** — click bottom-right bubble → ask "我有油性肌想搵控油精華" → streams Cantonese with `[[P001]]` rendered as product chips.
4. **Admin login** (`/admin/login`) — enter ADMIN_PASSWORD → dashboard. After 5 failed attempts in 15 min, locked out.
5. **Admin → Products** — click "匯入種子資料" → 32 products imported into Redis. Edit one → save → visit `/store` and see updated info immediately.
6. **Admin → Blogs** — edit existing post or create new with Tiptap → save → visit `/blog` and see it.
7. **Admin → 韓中圖片翻譯** — upload OliveYoung Korean image → returns translated PNG.
8. **`/checkout`** — add to cart → checkout → without Stripe key, demo confirmation. With key, redirects to Stripe.

---

## Open issues remaining (not blocking, document for future)

### From code review (3 medium-severity items still open)
1. `vertex-client.ts` / `redis.ts` / `stripe.ts` cache assignment race — benign (creates 2 instances under cold-start concurrency, one is GC'd). Cosmetic fix would be to assign synchronously.
2. `getProductBySlug` / `getBlogBySlug` still load full collection per slug lookup. With <100 items, fine. Add a `slug→id` Redis hash if catalog grows past ~500.
3. `compressImage` in `analyze/page.tsx` may leak object URL on `canvas.toBlob` null path. Edge-case only.

### From a11y audit (4 medium items still open)
1. **Sort dropdown** in `StoreClient.tsx` is a custom popover, not a native `<select>` or Radix Listbox. No arrow-key navigation, no Esc. Fix: swap to Radix Select.
2. **Heading hierarchy on /analyze** — h1 → h4 jumps. Fix: rewrite headings to h1 → h2 → h3.
3. **Form `aria-invalid` + `aria-describedby`** — checkout form silently disables submit. Inline error messages needed for screen reader users.
4. **Skip links + landmarks** — add `<a href="#main">跳至主要內容</a>` skip link in layout, plus `<main id="main">`.

### From security audit (one residual concern)
1. **Live API keys in `.env.local`** — your `VERTEX_API_KEY` and `RESEND_API_KEY` are in plaintext. `.env.local` IS gitignored (verified), so they won't be committed. **But: rotate both keys before going to production** if any unauthorized party may have seen them in chat history.

---

## Hero banner asset request — for ChatGPT generation

See **`HERO_BANNER_SPEC.md`** for exact image generation prompts for all 3 carousel slides.

**Quick summary** — for slide 1 (weightloss, the priority slide), I need:
- 1× model lifestyle photo (woman holding product, 900×1200, soft warm bg)
- 1× clean product hero shot (purple bottle on white, 900×900)
- 1× brand logo PNG (transparent, "SLIM·GLOW", 600×120)
- 3× before/after/30天 silhouette comparison images (400×540 each)
- 1× gift mini photo (sample box, 200×200)
- Headline + subhead + sticker copy (placeholders provided)

Slides 2 (Korean skincare) and 3 (AI analysis) follow the same template — full prompts in HERO_BANNER_SPEC.md.

When you have the assets, drop them in `public/images/hero/` and edit `src/data/hero-slides.ts` to point to them.

---

## What I still need from you

| # | Item | Why |
|---|------|-----|
| 1 | **Upstash Redis credentials** | Required for: rate limiting, admin CMS persistence, AI catalog caching. Free tier sufficient. |
| 2 | **Vercel Blob token** | Required for: admin image uploads (product/blog/Korean translations). Free tier ~1 GB. |
| 3 | **Hero banner images** | 5 photos × 3 slides — see HERO_BANNER_SPEC.md for ChatGPT prompts. |
| 4 | **Strong ADMIN_PASSWORD** | Pick a 12+ char password and add to .env.local. |
| 5 | **From client: Stripe keys** | `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (set up webhook endpoint at `/api/stripe/webhook` in Stripe dashboard). |
| 6 | **From client: SF Express HK credentials** | `SF_APP_KEY`, `SF_APP_SECRET`, `SF_MERCHANT_CODE`. Client must register at https://open.sf-express.com. Until provided, shipping uses Phase 1 flat-rate calculator. |
| 7 | **Resend domain verification** | Currently sending from `onboarding@resend.dev` (Resend sandbox, deliverable but not branded). Verify your `dearglowbeauty.com` domain in Resend dashboard for branded sender. |
| 8 | **Production domain** | Set `NEXT_PUBLIC_SITE_URL` and `AUTH_URL` in Vercel env vars when deploying. |
| 9 | **Admin notification email** | Set `RESEND_ADMIN_EMAIL` to receive new-order pings. |
| 10 | **Real product photos** | Currently using ohmyglow.co CDN URLs. Confirm reseller/affiliate rights or replace with your own photos before launch. |

---

## Files created/modified — Round 2

### New
- `.mcp.json` (Firecrawl MCP config)
- `HERO_BANNER_SPEC.md` (asset spec)
- `src/lib/sanitize.ts` (XSS prevention)
- `src/lib/csrf.ts` (Origin check helper)
- `src/lib/stripe.ts` (Stripe client + checkout session)
- `src/lib/sf-express.ts` (SF Express stub)
- `src/lib/email.ts` (Resend integration)
- `src/app/api/checkout/create-session/route.ts`
- `src/app/api/stripe/webhook/route.ts`
- `src/app/api/shipping/create-order/route.ts`
- `src/app/checkout/success/page.tsx`
- `src/app/HomeClient.tsx` (extracted from page.tsx)
- `src/app/store/StoreClient.tsx` (extracted)
- `src/app/store/[slug]/ProductDetailClient.tsx` (extracted)
- `src/app/blog/[slug]/BlogDetailClient.tsx` (extracted)
- `src/components/admin/TiptapEditor.tsx`

### Modified
- `src/app/layout.tsx` — local fonts, removed `next/font/google`
- `next.config.ts` — `serverExternalPackages` for resvg/satori, more remotePatterns
- `src/lib/admin-auth.ts` — AUTH_SECRET enforcement
- `src/lib/rate-limit.ts` — added chat/translate/login limiters
- `src/lib/ai/product-catalog-prompt.ts` — async, reads from repo, cache invalidation
- `src/app/api/analyze-skin/route.ts` — async sanitization
- `src/app/api/chat/route.ts` — rate limit + async catalog
- `src/app/api/translate-image/route.ts` — admin auth + rate limit
- `src/app/api/admin/{login, products, products/[id], blogs, blogs/[id]}/route.ts` — CSRF + sanitize + revalidate
- `src/app/api/stripe/webhook/route.ts` — line_items expansion
- `src/lib/email.ts` — HTML escaping throughout
- `src/components/home/HeroBanner.tsx` — reduced-motion + ARIA + larger touch targets + pause control
- `src/components/chat/ChatDrawer.tsx` — dialog semantics + focus management + aria-live + Esc + matchAll regex
- `src/components/admin/BlogForm.tsx` — Tiptap integration
- `src/app/checkout/page.tsx` — Stripe handoff with demo fallback
- `src/app/page.tsx`, `src/app/store/page.tsx`, `src/app/store/[slug]/page.tsx`, `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx` — all server components fetching from repo
- `src/app/globals.css` — `--text-muted` contrast fix + `.form-input` styles
- `.env.local` — Stripe, SF Express, Resend, site URL placeholders

### Packages added
- `sanitize-html` + `@types/sanitize-html`
- `stripe`
- `resend`
- `@tiptap/{react, starter-kit, pm, extension-link, extension-image, extension-placeholder}`
- `@fontsource/{cormorant-garamond, outfit, noto-sans-tc, noto-serif-tc, space-mono}`
