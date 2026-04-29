# OliveYoung Korean Description Image Scraper — How To Use

This is a manual workflow because OliveYoung blocks heavy automation, and each product needs to be matched by hand to its Korean equivalent.

## Goal

Each product in `src/data/products.ts` should have:

- `descriptionImagesKr: string[]` — Korean long detail images from OliveYoung (the bar-style images with text/ingredients/before-after)
- `descriptionImagesZh: string[]` — AI-translated Traditional Chinese versions (rendered as PNGs by `/api/translate-image`)

## Step 1 — Find the OliveYoung product URL

For each product in `src/data/products.ts`, search OliveYoung for the Korean equivalent:

1. Go to https://www.oliveyoung.co.kr
2. Search by Korean brand name (e.g. ANUA → 아누아, Torriden → 토리든, Round Lab → 라운드랩)
3. Click the matching product
4. Copy the URL (e.g. `https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000243621`)

OR use Firecrawl search via Claude Code:

```bash
# In a Claude Code session, with Firecrawl MCP already configured (.mcp.json)
firecrawl search "site:oliveyoung.co.kr 아누아 어성초"
```

## Step 2 — Extract the long description images

Run this in Claude Code (Firecrawl MCP):

```js
// Tool: mcp__firecrawl-mcp__firecrawl_scrape
{
  url: "https://www.oliveyoung.co.kr/store/goods/getGoodsDetail.do?goodsNo=A000000XXXXXX",
  formats: ["json"],
  jsonOptions: {
    prompt: "Extract the array of long description detail images embedded in the product detail tab. These are vertical images with Korean text/marketing/ingredients. Only image.oliveyoung.co.kr URLs.",
    schema: {
      type: "object",
      properties: {
        descriptionImagesKr: { type: "array", items: { type: "string" } }
      }
    }
  },
  waitFor: 5000
}
```

Save the resulting URL array.

## Step 3 — Translate each image to Traditional Chinese

For each Korean image URL:

1. Open `/admin/translate` on the running site (admin login required)
2. Either upload the image file, OR write a small script that POSTs to `/api/translate-image` with each Korean image
3. Receive the translated PNG (Vercel Blob URL or inline base64)
4. Save that URL as `descriptionImagesZh[i]`

### Programmatic approach (one image per call)

```bash
# With dev server running on localhost:3000 and admin cookie set:

curl -X POST http://localhost:3000/api/translate-image \
  -H "Cookie: dgb-admin-auth=YOUR_ADMIN_COOKIE" \
  -F "image=@./korean-detail-image.png"

# Response: { url: "https://...vercel-storage.com/translated/...png", mode: "blob", ... }
```

The first time you do this, the system needs:
- `BLOB_READ_WRITE_TOKEN` set so the result lands on Vercel Blob (otherwise base64 inline)
- `VERTEX_API_KEY` set for the Gemini OCR/translate call

## Step 4 — Update product data

Edit `src/data/products.ts`, add to each product:

```ts
p("P001", "ANUA", "...", "...", "...", "skincare", "serum", 168, null,
  "...imageUrl...",
  "...descriptionZh...",
  ["new"], ["acne"], "30ml", 4.8, 312)
// then add:
{
  ...p001,
  descriptionImagesKr: [
    "https://image.oliveyoung.co.kr/...toner_1.png",
    "https://image.oliveyoung.co.kr/...toner_2.png",
    // ...
  ],
  descriptionImagesZh: [
    "https://abc123.public.blob.vercel-storage.com/translated/p001-1.png",
    "https://abc123.public.blob.vercel-storage.com/translated/p001-2.png",
    // ...
  ]
}
```

OR use the admin CMS at `/admin/products/[id]/edit` to add the URLs in a multi-line input (when that feature is added).

## Step 5 — Render on product detail page

The `ProductDetailClient.tsx` component currently renders `product.descriptionZh` with `dangerouslySetInnerHTML`. Update it to also render the description images as a vertical stack at the bottom of the description section:

```tsx
{product.descriptionImagesZh && product.descriptionImagesZh.length > 0 && (
  <div className="space-y-2 mt-6">
    {product.descriptionImagesZh.map((src, i) => (
      <Image key={i} src={src} alt={`${product.nameZh} 詳細介紹 ${i + 1}`}
        width={800} height={1200}
        className="w-full h-auto rounded-lg" />
    ))}
  </div>
)}
```

## Sample data (already populated)

See `scripts/oliveyoung-korean-samples.json` — 3 products (ANUA P001, Torriden P002, Round Lab P003) already have their Korean image URLs scraped. Translation is the next step.
