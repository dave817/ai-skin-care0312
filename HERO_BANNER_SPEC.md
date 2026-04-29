# Hero Banner Asset Spec — for ChatGPT image generation

The home-page hero is a 50/50 split-screen carousel (Embla, auto-advances every 8 s, respects `prefers-reduced-motion`). Each slide has 5 distinct image assets + 5 copy fields. Edit `src/data/hero-slides.ts` directly to swap.

---

## Slide-by-slide ChatGPT prompts

You can paste these directly into ChatGPT (or GPT-4o image / DALL-E / Sora 2) to generate each asset. Aspect ratios + style are tuned for the layout.

---

### SLIDE 1 — WEIGHTLOSS (priority — first slide visitors see)

**1.1 Model lifestyle photo** (LEFT side of split, 900×1200 px, portrait)
> "Hyper-realistic studio portrait of an Asian woman in her 20s wearing minimal cream activewear, holding a sleek lavender-purple weightloss supplement bottle with one hand near her face. Soft natural window light, warm peachy pink background gradient, slight grain, editorial fashion-magazine quality. Confident, healthy glow. Negative space top-left for text overlay. Square crop ready for portrait 3:4 layout. Korean beauty editorial style."

**1.2 Product hero shot** (RIGHT side, 900×900 px, square)
> "Product photography: a sleek lavender-purple supplement bottle labeled 'SLIM·GLOW' in modern sans-serif on minimalist clean white background. Soft drop shadow underneath. Bottle is cylindrical with rose-gold cap, slight reflection on glossy label. Centered composition with breathing room around. Studio lighting, e-commerce hero style."

**1.3 Brand logo** (transparent PNG, 600×120 px)
> "Minimalist logo wordmark 'SLIM·GLOW' in a refined modern sans-serif (similar to Outfit or Manrope), letter-spaced, dark charcoal grey on transparent background. Tiny lavender dot accent between SLIM and GLOW. Premium beauty-brand feel."

**1.4 Before / After / 30 days trio** (3 images, 400×540 px each)
> "Three-panel comparison silhouette of a woman's torso side-profile against soft pink-to-cream gradient background, generic and non-identifiable. Panel 1: starting silhouette labeled 'Before'. Panel 2: visibly slimmer, labeled 'After'. Panel 3: more defined, labeled '30天'. Consistent lighting, neutral pose, beauty-magazine editorial style. Avoid medical claims. Soft, aspirational, not clinical."

**1.5 Gift mini photo** (200×200 px)
> "Tiny lifestyle photo of a slim sample-size weightloss tea sachet box in matching lavender-purple, on warm cream background. Top-down angle, soft shadow. E-commerce 'gift bonus' style."

**Copy fields (Traditional Chinese — feel free to edit):**
- `badge`: 限時優惠
- `brandLogoText`: SLIM·GLOW
- `headline`: 燃燒脂肪 雕塑曲線
- `subhead`: 30天見證纖體效果，從此自信嗮
- `modelStickerCopy`: [韓國爆款♥減重首選]
- `giftCopy`: 送纖體茶 mini

---

### SLIDE 2 — KOREAN SKINCARE FEATURE

**2.1 Model lifestyle** (900×1200)
> "Asian woman in her late 20s in a cream silk slip top, holding a Korean skincare essence bottle, soft morning light through sheer curtains, warm beige background, dewy glass-skin effect, beauty editorial style. Minimal aesthetic, slight grain."

**2.2 Product hero** (900×900)
> "Product flat-lay: 4 Korean skincare bottles (essence, serum, cream, ampoule) arranged in soft circular composition on warm beige linen background. Glass bottles with minimal gold-accented labels. Top-down view, soft morning shadow, subtle dewy droplets nearby."

**2.3 Brand logo** (600×120, transparent)
> "Wordmark 'K·GLOW' in elegant serif typography (Playfair-style), dark navy on transparent background, premium K-beauty brand feel."

**Copy:**
- `badge`: 全店93折
- `headline`: 韓國爆紅護膚精選
- `subhead`: 滿$599送$480貨裝禮品
- `modelStickerCopy`: [韓國女生愛用♥]

---

### SLIDE 3 — AI SKIN ANALYSIS

**3.1 Model lifestyle** (900×1200)
> "Asian woman in her 20s smiling softly while holding her smartphone toward her face, as if scanning her skin. Soft pink-cream studio background, modern minimal, tech-meets-beauty aesthetic. Light pastel digital-mesh overlay subtly visible on the screen."

**3.2 Product hero** (900×900)
> "Stylised UI mockup: a smartphone showing a gradient-pink skin-analysis report with circular score, radar chart, and 8 metric bars in soft pastel colors. Floating product recommendation cards beside. Background: soft warm linen with subtle digital particles."

**3.3 Brand logo** (600×120, transparent)
> "Wordmark 'AI·SKIN' with subtle gradient effect from soft rose to gold, modern geometric typography on transparent background."

**Copy:**
- `badge`: 免費試用
- `headline`: AI 智能膚質分析
- `subhead`: 3 張照片睇穿你嘅肌膚煩惱
- `modelStickerCopy`: [一鍵測肌齡♥]

---

## File handoff format

When ChatGPT (or your designer) returns the assets:

1. **Naming**: `hero-{slide-id}-{asset}.{ext}` e.g. `hero-weightloss-1-model.jpg`, `hero-weightloss-1-product.jpg`, etc.
2. **Format**: JPG for photos (lifestyle/product/comparison/gift), PNG with transparency for logos.
3. **Drop them into**: `public/images/hero/` (create the folder), OR upload via admin → translate page (each upload returns a URL you paste back into `src/data/hero-slides.ts`).
4. **Edit `src/data/hero-slides.ts`** — replace the Unsplash URLs with your new image paths/URLs.

Example after swap:
```ts
{
  id: "weightloss-1",
  modelImage: "/images/hero/hero-weightloss-1-model.jpg",
  productImage: "/images/hero/hero-weightloss-1-product.jpg",
  ...
}
```

That's it. The carousel + slide template are fully built — only assets are missing.
