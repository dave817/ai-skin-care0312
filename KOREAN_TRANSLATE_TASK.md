# Task for Codex: Translate Korean Product Detail Images to Traditional Chinese

## Context

I run a Korean beauty e-commerce site (Dear Glow Beauty, dearglowbeauty.com, Hong Kong market). The product detail pages display long Korean detail images scraped from oliveyoung.co.kr — these contain Korean marketing copy, ingredient breakdowns, before/after photos, and usage instructions.

I need each Korean image **regenerated as a Traditional Chinese (繁體中文 / 香港用語) version** while preserving:
- The exact same composition (model photos, product shots, color blocks)
- Brand fonts, color palette, and layout proportions
- Photographic elements (skin close-ups, ingredient close-ups, before/after)
- Decorative graphics (arrows, badges, icons)
- Only **swap the Korean text content** for natural Traditional Chinese suitable for Hong Kong customers

Use **gpt-image-2** (image-to-image edit mode) for best fidelity. The Korean source URLs and the destination structure are listed below.

## Tech setup

- OpenAI API key already in your environment
- Source: 47 Korean PNG/JPG URLs hosted on `image.oliveyoung.co.kr` (publicly accessible, no auth)
- Destination: upload each generated Chinese image to **Vercel Blob** (project token: ask user, env var `BLOB_READ_WRITE_TOKEN`)
- Output: a JSON map `{ productId: string[] }` where each array preserves the same order as the Korean source

## Per-image generation prompt (use this verbatim with gpt-image-2)

```
You are translating a Korean beauty product detail image to Traditional Chinese (繁體中文 / 香港 Cantonese-style usage).

INPUT: The provided image is a long-form vertical product detail panel from a Korean beauty e-commerce site (oliveyoung.co.kr). It contains:
- Korean marketing headlines and body copy
- Product photography (bottles, packaging, swatches)
- Ingredient diagrams and percentage callouts
- Before/After comparison panels
- Usage step illustrations
- Lifestyle/model shots

TASK: Generate a NEW image with EXACTLY the same:
- Composition and proportions
- Color palette and brand identity
- Product photography (do not regenerate — preserve as-is)
- Lifestyle photos (preserve as-is)
- Decorative graphics, badges, percentage callouts, arrows
- Layout and spacing

But REPLACE all Korean text with natural Traditional Chinese translation:
- Use Hong Kong Cantonese tone where copy is conversational ("呢款", "嘅", "可以")
- Use formal Traditional Chinese for ingredient lists and technical claims
- Preserve numerical values (percentages, volumes, ppm) exactly
- Preserve brand names in original Latin script
- Keep typographic hierarchy (large headlines stay large, body stays body)
- Match font weights and styles

Output a single Traditional Chinese version of the image at the same dimensions as input.
```

## Korean source images (47 total across 11 products)

### P001 — ANUA Heartleaf 77 + B3Zinc Soothing Serum (8 images)
```
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000243621/202602261516/crop2/www.anua.kr/anua/dp/A_01_heartleaf/01_toner/250ml/260106/toner_1.png?created=202602261517
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000243621/202602261516/crop3/www.anua.kr/anua/dp/A_01_heartleaf/01_toner/250ml/260106/toner_2.png?created=202602261517
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000243621/202602261516/crop0/www.anua.kr/anua/dp/A_01_heartleaf/01_toner/250ml/260106/toner_3.png?created=202602261517
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000243621/202602261516/crop1/www.anua.kr/anua/dp/A_01_heartleaf/01_toner/250ml/260106/toner_4.png?created=202602261517
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000243621/202602261516/crop0/www.anua.kr/anua/dp/A_01_heartleaf/01_toner/250ml/260106/toner_6.png?created=202602261517
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000243621/202602261516/crop1/www.anua.kr/anua/dp/A_01_heartleaf/01_toner/250ml/260106/toner_7_2.png?created=202602261517
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000243621/202602261516/crop0/www.anua.kr/anua/dp/A_01_heartleaf/01_toner/250ml/260106/toner_8.png?created=202602261517
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000243621/202602261516/crop1/www.anua.kr/anua/dp/A_01_heartleaf/01_toner/250ml/260106/toner_9.png?created=202602261517
```

### P002 — Torriden DIVE-IN Multi Pad (7 images)
```
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000170266/202601112304/crop0/torriden.jpg1.kr/torriden/product/DI/toner/01.jpg?created=202601112304
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000170266/202601112304/crop0/torriden.jpg1.kr/torriden/product/DI/toner/03-1.jpg?created=202601112304
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000170266/202601112304/crop0/torriden.jpg1.kr/torriden/product/DI/toner/04.jpg?created=202601112304
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000170266/202601112304/crop0/torriden.jpg1.kr/torriden/product/DI/toner/05.jpg?created=202601112304
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000170266/202601112304/crop0/torriden.jpg1.kr/torriden/product/DI/toner/07.jpg?created=202601112304
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000170266/202601112304/crop0/torriden.jpg1.kr/torriden/product/DI/toner/09.jpg?created=202601112304
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000170266/202601112304/crop0/torriden.jpg1.kr/torriden/product/DI/toner/12.jpg?created=202601112304
```

### P006 — Wellage Real Hyaluronic Blue Ampoule (3 images)
```
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000231885/202604171442/crop0/www.wellage.co.kr/detail/OY_ha_ample/251118_02.jpg?created=202604171442
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000231885/202604171442/crop0/www.wellage.co.kr/detail/ha_ample_100_06_02.jpg?created=202604171442
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000231885/202604171442/crop0/www.wellage.co.kr/detail/ha_ample_100_09_01.jpg?created=202604171442
```

### P010 — ANUA Heartleaf Quercetinol Cleansing Foam (3 images)
```
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000222790/202602261516/crop0/www.anua.kr/anua/dp/A_01_heartleaf/07_qctn_foam/250709/qctn_Foam_1.jpg?created=202602261519
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000222790/202602261516/crop0/www.anua.kr/anua/dp/A_01_heartleaf/ingredient/heartleaf_tm_1.jpg?created=202602261519
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000222790/202602261516/crop0/www.anua.kr/anua/dp/A_01_heartleaf/07_qctn_foam/250709/qctn_Foam_5.jpg?created=202602261519
```

### P012 — Sungboon Editor Deep Collagen Mask (4 images)
```
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000210971/202604091132/crop0/sungboon.com/sungboon/oliveyoung/deep_collagen/deep_collagen/02.jpg?created=202604101154
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000210971/202604091132/crop0/sungboon.com/sungboon/oliveyoung/deep_collagen/deep_collagen/04.jpg?created=202604101154
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000210971/202604091132/crop0/sungboon.com/sungboon/oliveyoung/deep_collagen/deep_collagen/05.jpg?created=202604101154
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000210971/202604091132/crop0/sungboon.com/sungboon/oliveyoung/deep_collagen/deep_collagen/07.jpg?created=202604101154
```

### P013 — CKD Retino Collagen Cream (4 images)
```
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000180075/202603142223/crop0/gi.esmplus.com/ckdhcbeau1/Product_Page_2024/CKD/RETINO_COLLAGEN/guasha_neck_cream_202603/01.jpg?created=202603142228
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000180075/202603142223/crop0/gi.esmplus.com/ckdhcbeau1/Product_Page_2024/CKD/RETINO_COLLAGEN/guasha_neck_cream_202603/03.jpg?created=202603142228
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000180075/202603142223/crop0/gi.esmplus.com/ckdhcbeau1/Product_Page_2024/CKD/RETINO_COLLAGEN/guasha_neck_cream_202603/05.jpg?created=202603142228
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000180075/202603142223/crop0/gi.esmplus.com/ckdhcbeau1/Product_Page_2024/CKD/RETINO_COLLAGEN/guasha_neck_cream_202603/07.jpg?created=202603142228
```

### P017 — About Tone Sun Serum Base (5 images)
```
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000235163/202604201814/crop0/abouttone.ivyro.net/product/abt_sunserumbase_2000_01.jpg?created=202604201815
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000235163/202604201814/crop0/abouttone.ivyro.net/product/abt_sunserumbase_2000_02.jpg?created=202604201815
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000235163/202604201814/crop0/abouttone.ivyro.net/product/abt_sunserumbase_2000_03.jpg?created=202604201815
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000235163/202604201814/crop0/abouttone.ivyro.net/product/abt_sunserumbase_2000_04.jpg?created=202604201815
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000235163/202604201814/crop0/abouttone.ivyro.net/product/abt_sunserumbase_2000_05.jpg?created=202604201815
```

### P019 — Sungboon Editor Green Tomato NMN Ampoule (6 images)
```
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000229522/202604091129/crop0/sungboon.com/sungboon/page/_re/greentomato_NMN_ampoule/260115/02_1.jpg?created=202604091138
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000229522/202604091129/crop0/sungboon.com/sungboon/page/_re/greentomato_NMN_ampoule/260115/03.jpg?created=202604091138
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000229522/202604091129/crop0/sungboon.com/sungboon/page/_re/greentomato_NMN_ampoule/260115/04.jpg?created=202604091138
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000229522/202604091129/crop0/sungboon.com/sungboon/page/_re/greentomato_NMN_ampoule/260115/06.jpg?created=202604091138
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000229522/202604091129/crop0/sungboon.com/sungboon/page/_re/greentomato_NMN_ampoule/260115/08.jpg?created=202604091138
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000229522/202604091129/crop0/sungboon.com/sungboon/page/_re/greentomato_NMN_ampoule/260115/10.jpg?created=202604091138
```

### P022 — Espoir Pro Tailor Be Velvet Cushion (4 images)
```
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000184222/202604291706/crop0/espoir.xcache.kinxcdn.com/product/makeup/face/bevelvet/25AD/Winter/01.jpg?created=202604291706
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000184222/202604291706/crop0/espoir.xcache.kinxcdn.com/product/makeup/face/bevelvet/25AD/Winter/02.jpg?created=202604291706
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000184222/202604291706/crop0/espoir.xcache.kinxcdn.com/product/makeup/face/bevelvet/25AD/Winter/03.jpg?created=202604291706
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000184222/202604291706/crop0/espoir.xcache.kinxcdn.com/product/makeup/face/bevelvet/25AD/Winter/04.jpg?created=202604291706
```

### P024 — Espoir Water Splash Sun Cream (2 images)
```
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000179353/202604132122/crop0/espoir.xcache.kinxcdn.com/product/makeup/sun/watersplash/sunsera/sunsera_01_re.jpg?created=202604132122
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000179353/202604132122/crop0/espoir.xcache.kinxcdn.com/product/makeup/sun/watersplash/sunsera/sunsera_03_oy.jpg?created=202604132122
```

### P034 — ONE THING Niacinamide Toner (1 image)
```
https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000158322/202507281138/crop0/image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/attached/2025/04/09/c24_09144119.jpg?created=202511131316
```

---

## Implementation script (Codex should generate this)

Write a Node.js script `scripts/translate-with-gpt-image-2.ts` that:

1. Reads the URL list above (hardcode it as a JS object grouped by productId)
2. For each URL:
   - Downloads the Korean image (`fetch(url)` → `arrayBuffer()`)
   - Calls **OpenAI gpt-image-2 edit endpoint** with the prompt above and the source image
     ```ts
     const result = await openai.images.edit({
       model: "gpt-image-2",
       image: koreanImageFile,
       prompt: TRANSLATE_PROMPT,
       size: "auto",
       n: 1,
     });
     ```
   - Receives the generated Chinese image (base64 or URL)
   - Uploads to Vercel Blob:
     ```ts
     import { put } from "@vercel/blob";
     const blob = await put(
       `translated/${productId}-${index}.png`,
       chineseImageBuffer,
       { access: "public", contentType: "image/png" }
     );
     ```
   - Records `{ productId, index, originalKr, translatedZh: blob.url }`
3. Adds rate limiting: max 3 concurrent requests, 1 sec delay between batches
4. After all 47 images done, writes `scripts/korean-translated-output.json`:
   ```json
   {
     "P001": ["https://blob.vercel-storage.com/translated/P001-0.png", ...],
     "P002": [...],
     ...
   }
   ```

## Cost & time estimate

- gpt-image-2: ~$0.10 per generation × 47 = **~$5 total**
- Wall clock: ~10 minutes (with rate limiting)

## After Codex completes — manual step for me

I'll take the output JSON and update `src/data/products.ts` to add `descriptionImagesZh` arrays to each matching product, e.g.:

```ts
const ZH_P001 = ["https://blob...P001-0.png", "https://blob...P001-1.png", ...];

p({id:"P001", ..., descriptionImagesZh: ZH_P001 })
```

Once committed and pushed, the public product detail pages will automatically render the Chinese versions instead of the Korean originals (the `ProductDetailClient.tsx` already prefers `descriptionImagesZh` when present).

## Quality acceptance criteria

For each generated image, verify:
- [ ] No Korean characters remain in the output
- [ ] All photos (model, product, ingredients) preserved without distortion
- [ ] Brand colors and fonts visually similar
- [ ] Text reads naturally in Traditional Chinese (no machine-translation awkwardness)
- [ ] Numerical values (percentages, ml, ppm) match the original exactly
- [ ] Output dimensions match input
