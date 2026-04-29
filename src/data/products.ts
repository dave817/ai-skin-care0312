/**
 * Product catalog seed data.
 * Source: ohmyglow.co (scraped 2026-04-29 via Firecrawl).
 * On first admin load, seed → Upstash Redis via `匯入種子資料` button.
 *
 * Optional fields:
 *   descriptionImageKr — long Korean description image URL (e.g. from oliveyoung.co.kr)
 *   descriptionImageZh — AI-translated Traditional Chinese version (rendered via /api/translate-image)
 */

export interface Product {
  id: string;
  slug: string;
  brand: string;
  nameZh: string;
  nameEn: string;
  category: string;
  subcategory: string;
  priceOriginal: number;
  priceSale: number | null;
  currency: string;
  descriptionZh: string;
  imageUrl: string;
  imageAlt: string;
  tags: string[];
  skinConcerns: string[];
  rating: number;
  reviewCount: number;
  volume: string;
  stock: number;
  active: boolean;
  /* Optional Korean → Traditional Chinese long description images
     descriptionImagesKr: scraped from oliveyoung.co.kr (long detail bar images)
     descriptionImagesZh: AI-translated PNGs via /api/translate-image (1:1 with Kr) */
  descriptionImagesKr?: string[];
  descriptionImagesZh?: string[];
}

export type Category = {
  id: string;
  labelZh: string;
  icon?: string;
  subcategories?: { id: string; labelZh: string }[];
};

export const mainCategories: Category[] = [
  {
    id: "skincare",
    labelZh: "護膚",
    icon: "🧴",
    subcategories: [
      { id: "all", labelZh: "全部" },
      { id: "toner", labelZh: "化妝水" },
      { id: "serum", labelZh: "精華液" },
      { id: "cream", labelZh: "乳液 / 乳霜" },
      { id: "mask", labelZh: "面膜" },
      { id: "mist", labelZh: "噴霧 / 精油" },
      { id: "cleanser", labelZh: "臉部清潔" },
      { id: "eye-care", labelZh: "眼霜" },
      { id: "sunscreen", labelZh: "防曬護理" },
      { id: "lip-care", labelZh: "唇部護理" },
    ],
  },
  {
    id: "body-hair",
    labelZh: "身體 & 頭髮",
    icon: "💆",
    subcategories: [
      { id: "all", labelZh: "全部" },
      { id: "hair-care", labelZh: "頭髮護理" },
      { id: "hair-styling", labelZh: "造型定型" },
      { id: "body-care", labelZh: "身體護理" },
    ],
  },
  {
    id: "makeup",
    labelZh: "彩妝",
    icon: "💄",
    subcategories: [
      { id: "all", labelZh: "全部" },
      { id: "lip", labelZh: "唇部彩妝" },
      { id: "eye-brow", labelZh: "眼眉彩妝" },
      { id: "face", labelZh: "臉部彩妝" },
    ],
  },
  {
    id: "tools",
    labelZh: "美容工具",
    icon: "🪥",
    subcategories: [
      { id: "all", labelZh: "全部" },
      { id: "brushes", labelZh: "刷具" },
      { id: "puffs", labelZh: "粉撲" },
    ],
  },
  { id: "food", labelZh: "食品", icon: "🍵" },
  { id: "home", labelZh: "居家生活", icon: "🏠" },
  { id: "health", labelZh: "健康", icon: "💊" },
];

function p(
  id: string,
  brand: string,
  nameZh: string,
  nameEn: string,
  slug: string,
  category: string,
  subcategory: string,
  priceOriginal: number,
  priceSale: number | null,
  imageUrl: string,
  descriptionZh: string,
  tags: string[],
  skinConcerns: string[],
  volume: string,
  rating: number,
  reviewCount: number,
  stock = 50,
  descriptionImagesKr?: string[]
): Product {
  return {
    id,
    slug,
    brand,
    nameZh,
    nameEn,
    category,
    subcategory,
    priceOriginal,
    priceSale,
    currency: "HKD",
    descriptionZh,
    imageUrl,
    imageAlt: `${brand} ${nameZh}`,
    tags,
    skinConcerns,
    rating,
    reviewCount,
    volume,
    stock,
    active: true,
    ...(descriptionImagesKr ? { descriptionImagesKr } : {}),
  };
}

/* OliveYoung Korean long-description image URLs (scraped 2026-04-29 via Firecrawl MCP).
   Run each through /admin/translate or /api/translate-image to generate
   descriptionImagesZh PNGs, then add the URLs to the matching product.
   Source: https://www.oliveyoung.co.kr */

const KR_IMG_P001_ANUA_HEARTLEAF_77 = [
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000243621/202602261516/crop2/www.anua.kr/anua/dp/A_01_heartleaf/01_toner/250ml/260106/toner_1.png?created=202602261517",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000243621/202602261516/crop3/www.anua.kr/anua/dp/A_01_heartleaf/01_toner/250ml/260106/toner_2.png?created=202602261517",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000243621/202602261516/crop0/www.anua.kr/anua/dp/A_01_heartleaf/01_toner/250ml/260106/toner_3.png?created=202602261517",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000243621/202602261516/crop1/www.anua.kr/anua/dp/A_01_heartleaf/01_toner/250ml/260106/toner_4.png?created=202602261517",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000243621/202602261516/crop0/www.anua.kr/anua/dp/A_01_heartleaf/01_toner/250ml/260106/toner_6.png?created=202602261517",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000243621/202602261516/crop1/www.anua.kr/anua/dp/A_01_heartleaf/01_toner/250ml/260106/toner_7_2.png?created=202602261517",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000243621/202602261516/crop0/www.anua.kr/anua/dp/A_01_heartleaf/01_toner/250ml/260106/toner_8.png?created=202602261517",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000243621/202602261516/crop1/www.anua.kr/anua/dp/A_01_heartleaf/01_toner/250ml/260106/toner_9.png?created=202602261517",
];

const KR_IMG_P002_TORRIDEN_DIVE_IN = [
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000170266/202601112304/crop0/torriden.jpg1.kr/torriden/product/DI/toner/01.jpg?created=202601112304",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000170266/202601112304/crop0/torriden.jpg1.kr/torriden/product/DI/toner/03-1.jpg?created=202601112304",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000170266/202601112304/crop0/torriden.jpg1.kr/torriden/product/DI/toner/04.jpg?created=202601112304",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000170266/202601112304/crop0/torriden.jpg1.kr/torriden/product/DI/toner/05.jpg?created=202601112304",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000170266/202601112304/crop0/torriden.jpg1.kr/torriden/product/DI/toner/07.jpg?created=202601112304",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000170266/202601112304/crop0/torriden.jpg1.kr/torriden/product/DI/toner/08-1.jpg?created=202601112304",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000170266/202601112304/crop0/torriden.jpg1.kr/torriden/product/DI/toner/09.jpg?created=202601112304",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000170266/202601112304/crop0/torriden.jpg1.kr/torriden/product/DI/toner/12.jpg?created=202601112304",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000170266/202601112304/crop0/torriden.jpg1.kr/torriden/product/DI/toner/18.jpg?created=202601112304",
];

const KR_IMG_P006_WELLAGE_BLUE_AMPOULE = [
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000231885/202604171442/crop0/www.wellage.co.kr/detail/OY_ha_ample/251118_02.jpg?created=202604171442",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000231885/202604171442/crop0/www.wellage.co.kr/detail/ha_ample_100_06_02.jpg?created=202604171442",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000231885/202604171442/crop0/www.wellage.co.kr/detail/ha_ample_100_09_01.jpg?created=202604171442",
];

const KR_IMG_P010_ANUA_QUERCETINOL = [
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000222790/202602261516/crop0/www.anua.kr/anua/dp/A_01_heartleaf/07_qctn_foam/250709/qctn_Foam_1.jpg?created=202602261519",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000222790/202602261516/crop1/www.anua.kr/anua/dp/A_01_heartleaf/07_qctn_foam/250709/qctn_Foam_1.jpg?created=202602261519",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000222790/202602261516/crop0/www.anua.kr/anua/dp/A_01_heartleaf/ingredient/heartleaf_tm_1.jpg?created=202602261519",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000222790/202602261516/crop1/www.anua.kr/anua/dp/A_01_heartleaf/ingredient/heartleaf_tm_1.jpg?created=202602261519",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000222790/202602261516/crop0/www.anua.kr/anua/dp/A_01_heartleaf/07_qctn_foam/250709/qctn_Foam_5.jpg?created=202602261519",
];

const KR_IMG_P012_SUNGBOON_DEEP_COLLAGEN = [
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000210971/202604091132/crop0/sungboon.com/sungboon/oliveyoung/deep_collagen/deep_collagen/02.jpg?created=202604101154",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000210971/202604091132/crop0/sungboon.com/sungboon/oliveyoung/deep_collagen/deep_collagen/03.png?created=202604101154",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000210971/202604091132/crop0/sungboon.com/sungboon/oliveyoung/deep_collagen/deep_collagen/04.jpg?created=202604101154",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000210971/202604091132/crop0/sungboon.com/sungboon/oliveyoung/deep_collagen/deep_collagen/05.jpg?created=202604101154",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000210971/202604091132/crop0/sungboon.com/sungboon/oliveyoung/deep_collagen/deep_collagen/07.jpg?created=202604101154",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000210971/202604091132/crop0/sungboon.com/sungboon/oliveyoung/deep_collagen/deep_collagen/08.jpg?created=202604101154",
];

const KR_IMG_P013_CKD_RETINO_COLLAGEN = [
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000180075/202603142223/crop0/gi.esmplus.com/ckdhcbeau1/Product_Page_2024/CKD/RETINO_COLLAGEN/guasha_neck_cream_202603/01.jpg?created=202603142228",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000180075/202603142223/crop0/gi.esmplus.com/ckdhcbeau1/Product_Page_2024/CKD/RETINO_COLLAGEN/guasha_neck_cream_202603/03.jpg?created=202603142228",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000180075/202603142223/crop0/gi.esmplus.com/ckdhcbeau1/Product_Page_2024/CKD/RETINO_COLLAGEN/guasha_neck_cream_202603/05.jpg?created=202603142228",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000180075/202603142223/crop0/gi.esmplus.com/ckdhcbeau1/Product_Page_2024/CKD/RETINO_COLLAGEN/guasha_neck_cream_202603/07.jpg?created=202603142228",
];

const KR_IMG_P017_ABOUT_TONE_SUN_BASE = [
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000235163/202604201814/crop0/abouttone.ivyro.net/product/abt_sunserumbase_2000_01.jpg?created=202604201815",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000235163/202604201814/crop0/abouttone.ivyro.net/product/abt_sunserumbase_2000_02.jpg?created=202604201815",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000235163/202604201814/crop0/abouttone.ivyro.net/product/abt_sunserumbase_2000_03.jpg?created=202604201815",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000235163/202604201814/crop0/abouttone.ivyro.net/product/abt_sunserumbase_2000_04.jpg?created=202604201815",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000235163/202604201814/crop0/abouttone.ivyro.net/product/abt_sunserumbase_2000_05.jpg?created=202604201815",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000235163/202604201814/crop0/abouttone.ivyro.net/product/abt_sunserumbase_2000_06.jpg?created=202604201815",
];

const KR_IMG_P019_SUNGBOON_GREEN_TOMATO = [
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000229522/202604091129/crop0/sungboon.com/sungboon/page/_re/greentomato_NMN_ampoule/260115/02_1.jpg?created=202604091138",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000229522/202604091129/crop0/sungboon.com/sungboon/page/_re/greentomato_NMN_ampoule/251017/03_0.jpg?created=202604091138",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000229522/202604091129/crop0/sungboon.com/sungboon/page/_re/greentomato_NMN_ampoule/260115/04.jpg?created=202604091138",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000229522/202604091129/crop0/sungboon.com/sungboon/page/_re/greentomato_NMN_ampoule/260115/06.jpg?created=202604091138",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000229522/202604091129/crop0/sungboon.com/sungboon/page/_re/greentomato_NMN_ampoule/260115/08.jpg?created=202604091138",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000229522/202604091129/crop0/sungboon.com/sungboon/page/_re/greentomato_NMN_ampoule/260115/09_1.jpg?created=202604091138",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000229522/202604091129/crop0/sungboon.com/sungboon/page/_re/greentomato_NMN_ampoule/260115/10.jpg?created=202604091138",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000229522/202604091129/crop0/sungboon.com/sungboon/page/_re/greentomato_NMN_ampoule/260115/11_2.jpg?created=202604091138",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000229522/202604091129/crop0/sungboon.com/sungboon/page/_re/greentomato_NMN_ampoule/260115/14.jpg?created=202604091138",
];

const KR_IMG_P022_ESPOIR_BE_VELVET = [
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000184222/202604291706/crop0/espoir.xcache.kinxcdn.com/product/makeup/face/bevelvet/25AD/Winter/01.jpg?created=202604291706",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000184222/202604291706/crop0/espoir.xcache.kinxcdn.com/product/makeup/face/bevelvet/25AD/Winter/02.jpg?created=202604291706",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000184222/202604291706/crop0/espoir.xcache.kinxcdn.com/product/makeup/face/bevelvet/25AD/Winter/03.jpg?created=202604291706",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000184222/202604291706/crop0/espoir.xcache.kinxcdn.com/product/makeup/face/bevelvet/25AD/Winter/04.jpg?created=202604291706",
];

const KR_IMG_P024_ESPOIR_WATER_SPLASH = [
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000179353/202604132122/crop0/espoir.xcache.kinxcdn.com/product/makeup/sun/watersplash/sunsera/sunsera_01_re.jpg?created=202604132122",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000179353/202604132122/crop0/espoir.xcache.kinxcdn.com/product/makeup/sun/watersplash/sunsera/sunsera_03_oy.jpg?created=202604132122",
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000179353/202604132122/crop0/espoir.xcache.kinxcdn.com/product/makeup/sun/watersplash/sunsera/sunsera_04_oy_sun_lineup.jpg?created=202604132122",
];

const KR_IMG_P034_ONE_THING_NIACINAMIDE = [
  "https://image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/crop/A000000158322/202507281138/crop0/image.oliveyoung.co.kr/cfimages/cf-goods/uploads/images/html/attached/2025/04/09/c24_09144119.jpg?created=202511131316",
];

export const allProducts: Product[] = [
  p("P001", "ANUA", "魚腥草X維B3鋅舒緩減紅抗痘修護精華", "Heartleaf 77 + B3Zinc Soothing Serum", "anua-heartleaf-77-b3zinc-soothing-serum", "skincare", "serum", 168, null,
    "https://www.ohmyglow.co/wp-content/uploads/2026/04/OYOTANUAHeartleaf-77-B3-Zinc-Trouble-Serum-30ml-Double-Set-cover.png",
    "ANUA 77 魚腥草精華升級配方，針對反覆出現嘅問題肌打造嘅舒緩精華。以核心魚腥草系列強化配方，搭配獨家 99,100ppm B3 Zinc™ 複合物，提升精華滲透同鎮靜效果。",
    ["new", "bestseller"], ["acne", "redness", "sensitive"], "30ml", 4.8, 312, 50, KR_IMG_P001_ANUA_HEARTLEAF_77),

  p("P002", "Torriden", "DIVE-IN 低分子透明質酸爽膚棉片", "DIVE-IN Low Molecule Hyaluronic Acid Multi Pad", "torriden-dive-in-multi-pad", "skincare", "toner", 188, 118,
    "https://www.ohmyglow.co/wp-content/uploads/2022/05/TORRIDEN.DIVE-IN-Low-Molecule-Hyaluronic-Acid-Multi-Pad-cover-new-1.jpg",
    "Torriden Dive-In 低分子透明質酸爽膚棉片，快速補水鎮靜，收縮毛孔。3秒內極速補水，薄薄棉片牢牢緊貼肌膚，所有膚質適用。",
    ["bestseller", "sale"], ["dry", "sensitive"], "80片", 4.9, 1842, 50, KR_IMG_P002_TORRIDEN_DIVE_IN),

  p("P003", "Round Lab", "專利複合維他命維B3美白淡斑精華", "Vita Niacinamide Dark Spot Serum", "round-lab-vita-niacinamide-serum", "skincare", "serum", 218, 138,
    "https://www.ohmyglow.co/wp-content/uploads/2025/05/ROUND-LAB-VITA-NIACINAMIDE-DARK-SPOT-SERUM-30ml-cover.jpg",
    "高濃度菸鹼醯胺配方。維他命B3 比一般維他命C穩定，集中明亮膚色，改善暗沉與斑點。",
    ["bestseller", "sale"], ["dark-spots", "uneven-tone"], "30ml", 4.7, 568),

  p("P004", "Round Lab", "松樹積雪草控油特效舒緩清爽防曬", "Pine Calming CICA Sunscreen SPF50+ PA++++", "round-lab-pine-calming-sunscreen", "skincare", "sunscreen", 228, 138,
    "https://www.ohmyglow.co/wp-content/uploads/2025/09/ROUND-LAB-PINE-CALMING-CICA-SUNSCREEN-40ml-cover.jpg",
    "ROUND LAB 松樹舒緩積雪草防曬霜，SPF50+ PA++++ 高效防曬全方位防護。質地輕薄不黏膩，清爽無負擔，一次基本清潔即可徹底卸除。",
    ["bestseller", "sale"], ["sensitive", "oily", "acne"], "40ml", 4.8, 921),

  p("P005", "numbuzin", "No.3 植萃米酵素嫩膚深清泡泡潔面乳", "No.3 Rice Enzyme Skin Softening Cleansing Foam", "numbuzin-no3-rice-cleansing-foam", "skincare", "cleanser", 128, 78,
    "https://www.ohmyglow.co/wp-content/uploads/2024/12/numbuzin-No.3-Rice-Enzyme-Skin-Softening-Cleansing-Foam-cover-1.jpg",
    "大米酵素＋獨特三階段轉化技術 (mask → peeling → foam)，一支3用！霜狀按摩、輕盈去角質、豐富酵素泡泡潔面。",
    ["new", "sale"], ["dry", "dullness"], "170ml", 4.6, 287),

  p("P006", "Wellage", "Real Hyaluronic Blue Ampoule 100% 純透明質酸保濕精華", "Real Hyaluronic Blue Ampoule", "wellage-real-hyaluronic-blue-ampoule", "skincare", "serum", 168, 118,
    "https://www.ohmyglow.co/wp-content/uploads/2023/11/Wellage-Real-Hyaluronic-Blue-Ampoule-cover-1.jpg",
    "2025全年度 GlowPick Award 最佳保濕精華第一名。水狀質地不黏稠易吸收，主打 100% 純透明質酸，由內到外飲飽水。",
    ["bestseller", "award-winning"], ["dry", "sensitive"], "60ml", 4.9, 2103, 50, KR_IMG_P006_WELLAGE_BLUE_AMPOULE),

  p("P007", "isntree", "極低分子透明質酸保濕精華", "Ultra-Low Molecular Hyaluronic Acid Serum", "isntree-ultra-low-ha-serum", "skincare", "serum", 168, 138,
    "https://www.ohmyglow.co/wp-content/uploads/2023/06/isntree-Ultra-Low-Molecular-Hyaluronic-Acid-Serum-cover-1.jpg",
    "極低分子透明質酸深入肌膚底層，提供持久保濕。純素配方適合所有肌膚類型。",
    ["vegan", "bestseller"], ["dry", "sensitive"], "50ml", 4.7, 658),

  p("P008", "beplain", "綠豆弱酸洗面奶", "Mung Bean PH-balanced Cleansing Foam", "beplain-mung-bean-cleansing-foam", "skincare", "cleanser", 110, 78,
    "https://www.ohmyglow.co/wp-content/uploads/2022/01/beplain-mung-bean-ph-balanced-cleansing-foam-cover-1.jpg",
    "pH 5.5 弱酸性，深層清潔毛孔同時保持肌膚水潤。含 32.17% 綠豆提取物，溫和不刺激，敏感肌適用。",
    ["bestseller"], ["sensitive", "dry"], "80ml", 4.8, 1456),

  p("P009", "Medicube", "Deep Vita C Pad 高濃度維C美白去暗沉爽膚棉片", "Deep Vita C Pad", "medicube-deep-vita-c-pad", "skincare", "toner", 298, 168,
    "https://www.ohmyglow.co/wp-content/uploads/2025/02/medicube-Deep-Vita-C-Pad-cover-1.jpg",
    "高濃度維他命C衍生物及 500,000 ppm 維他命樹水，含 2% Niacinamide，有效改善色斑同提亮膚色。",
    ["bestseller"], ["dark-spots", "dullness"], "70片", 4.8, 1234),

  p("P010", "ANUA", "魚腥草槲皮素毛孔深清潔膚乳", "Heartleaf Quercetinol Pore Deep Cleansing Foam", "anua-heartleaf-quercetinol-cleansing", "skincare", "cleanser", 118, 89,
    "https://www.ohmyglow.co/wp-content/uploads/2023/10/anua-HEARTLEAF-QUERCETINOL-PORE-DEEP-CLEANSING-FOAM-cover-1.jpg",
    "深清毛孔，洗走黑頭暗粒油光角質。質地順滑 creamy 柔軟，加有細顆粒鮮魚腥草，輕易搓出綿密泡泡。",
    ["bestseller"], ["pores", "oily", "blackheads"], "150ml", 4.7, 879, 50, KR_IMG_P010_ANUA_QUERCETINOL),

  p("P011", "DEWYTREE", "AC Deep Calming 涼感降溫積雪草深層鎮靜減紅面膜", "AC Deep Calming Mask", "dewytree-ac-deep-calming-mask", "skincare", "mask", 126, 16,
    "https://www.ohmyglow.co/wp-content/uploads/2025/08/DEWYTREE-AC-DEEP-CALMING-MASK-10EA-27g10EA-cover.jpg",
    "即時降低肌膚溫度，舒緩外部刺激引起嘅泛紅同不適。獨家成分 CICAMINT™ 安撫受損肌膚。",
    ["sale"], ["redness", "sensitive", "dry"], "27g x 10片", 4.6, 234),

  p("P012", "Sungboon Editor", "深層低分子膠原＋煙醯胺維他命C 亮白果凍面膜", "Deep Collagen Niacin Vita C Brightening Mask", "sungboon-deep-collagen-mask", "skincare", "mask", 128, 38,
    "https://www.ohmyglow.co/wp-content/uploads/2026/01/Sungboon-Editor-Deep-Collagen-Niacin-Vita-C-Brightening-Mask-cover-2.jpg",
    "低分子膠原為基底嘅 hydrogel 果凍精華面膜，富含高濃度膠原同亮白活性成分，一次改善暗沉膚色與提升彈力。",
    ["sale"], ["dark-spots", "dry", "fine-lines"], "4片裝", 4.7, 512, 50, KR_IMG_P012_SUNGBOON_DEEP_COLLAGEN),

  p("P013", "CKD", "Retino Collagen 維A視黃醇低分子膠原蛋白提彈淡紋面霜", "Retino Collagen Small Molecule 300 Cream", "ckd-retino-collagen-cream", "skincare", "cream", 279, 138,
    "https://www.ohmyglow.co/wp-content/uploads/2025/04/CKD-Retino-Collagen-Small-Molecule-300-Cream-cover-1.jpg",
    "低分子膠原蛋白霜，吸收力強嘅彈力乳霜，有效增強皮膚彈性同淡化皺紋。小分子膠原蛋白 X 第三代維A X 脂質體膠囊三重活性。",
    ["anti-aging"], ["wrinkles", "dry", "elasticity"], "40ml", 4.6, 367, 50, KR_IMG_P013_CKD_RETINO_COLLAGEN),

  p("P014", "Torriden", "DIVE-IN 低分子透明質酸溫和低敏卸妝水", "DIVE-IN Low Molecular HA Cleansing Water", "torriden-dive-in-cleansing-water", "skincare", "cleanser", 49, null,
    "https://www.ohmyglow.co/wp-content/uploads/2022/08/torriden-dive-in-cleansing-water.jpg",
    "5D 複合透明質酸，深層保濕同時溫和卸妝。低敏配方適合敏感肌膚，無需沖洗，方便快捷。",
    ["new"], ["dry", "sensitive"], "100ml", 4.5, 198),

  p("P015", "Cosnori", "有機牛油果油米萃純素眼霜", "Avocado Eye Cream All Face", "cosnori-avocado-eye-cream", "skincare", "eye-care", 169, 96,
    "https://www.ohmyglow.co/wp-content/uploads/2023/12/cosnori-Avocado-Eyecream-All-Face-30ml-cover-1.jpg",
    "Cosnori 皇牌熱賣眼霜，化解評測 4.57/5.0。富含 66.9% 米萃取同有機牛油果油，有效對抗黑眼圈同細紋。",
    ["bestseller", "vegan"], ["dark-circles", "fine-lines"], "30ml", 4.7, 1023),

  p("P016", "Some By Mi", "BYE BYE BLACKHEAD 30天奇蹟去黑頭綠茶深清泡泡潔面", "BYE BYE BLACKHEAD Bubble Cleanser", "somebymi-bye-bye-blackhead", "skincare", "cleanser", 168, 96,
    "https://www.ohmyglow.co/wp-content/uploads/2022/12/Some-By-Mi-BYE-BYE-BLACKHEAD-30-Days-Miracle-Green-Tea-Tox-Bubble-Cleanser-cover-1.jpg",
    "16種茶同天然植物提取嘅 BHA，有效去除黑頭、收緊毛孔，溫和去角質。每週使用 2-3 次，肌膚明亮光滑。",
    ["bestseller"], ["blackheads", "pores", "dullness"], "120g", 4.6, 743),

  p("P017", "About Tone", "Sun Serum Base 妝前防曬精華", "Sun Serum Base SPF50+ PA++++", "about-tone-sun-serum-base", "skincare", "sunscreen", 138, 79,
    "https://www.ohmyglow.co/wp-content/uploads/2025/11/About-Tone-Sun-Serum-Base-cover-1.jpg",
    "妝前防曬精華結合保濕、防曬同持妝，妝容更服貼持久。75% 水感保濕成分，輕盈水潤無黏膩感。",
    ["new"], ["dry", "acne", "dark-spots"], "30ml", 4.7, 156, 50, KR_IMG_P017_ABOUT_TONE_SUN_BASE),

  p("P018", "CKD", "高濃度綠蜂膠 3合1 美肌提亮有色物理防曬", "Green Propolis All-covery Sun SPF50+ PA++++", "ckd-green-propolis-sun", "skincare", "sunscreen", 189, 89,
    "https://www.ohmyglow.co/wp-content/uploads/2025/01/CKD-Green-Propolis-All-covery-Sun-cover-6.jpg",
    "高濃度綠蜂膠 3合1 防曬：皺紋改善、美白同 UV 防曬三重功能。自然輕盈妝效。",
    ["sale"], ["dry", "dark-spots", "wrinkles"], "40ml", 4.5, 412),

  p("P019", "Sungboon Editor", "Green Tomato NMN 毛孔緊緻安瓶", "Green Tomato NMN Pore Lifting Ampoule", "sungboon-green-tomato-ampoule", "skincare", "serum", 268, 128,
    "https://www.ohmyglow.co/wp-content/uploads/2026/02/Sungboon-Editor-Green-Tomato-NMN-Pore-Lifting-Ampoule-detail-3.jpg",
    "皇牌人氣安瓶累計銷量數百萬瓶，全新升級配方。專利綠番茄 X 高濃度 NMN，針對縱向、橫向、色素同下陷毛孔提供 3D 改善。",
    ["bestseller"], ["pores", "elasticity"], "40ml", 4.8, 1567, 50, KR_IMG_P019_SUNGBOON_GREEN_TOMATO),

  p("P020", "CLIO", "Sharp So Simple 極細防水眼線筆", "Sharp So Simple Waterproof Pencil Liner", "clio-sharp-so-simple-liner", "makeup", "eye-brow", 120, 68,
    "https://www.ohmyglow.co/wp-content/uploads/2024/02/clio-Sharp-So-Simple-Waterproof-Pencil-Liner-01-11-cover-1.jpg",
    "CLIO No.1 眼線筆，超纖細 2mm 筆芯設計，線條細緻。持久防水配方，防汗、防油、不易暈染。",
    ["bestseller"], [], "0.14g", 4.9, 3245),

  p("P021", "OddType", "Unseen Blur 軟霧絲絨不沾杯唇釉", "Unseen Blur Tint", "oddtype-unseen-blur-tint", "makeup", "lip", 168, 128,
    "https://www.ohmyglow.co/wp-content/uploads/2023/09/OddType-Unseen-Blur-Tint-14-colors-cover-1.jpg",
    "革命性小圓平頭暈染唇掃頭，配合軟滑慕絲質地配方，塗出不厚重高質絲絨唇妝。",
    ["new"], [], "4g", 4.7, 892),

  p("P022", "Espoir", "Pro Tailor Be Velvet Cover 持久絲絨啞緻氣墊粉底", "Pro Tailor Be Velvet Cover Cushion", "espoir-pro-tailor-velvet-cushion", "makeup", "face", 168, null,
    "https://www.ohmyglow.co/wp-content/uploads/2023/07/espoir-Protailor-Be-Velvet-Cover-Cushion-New-Class-cover-1.jpg",
    "持久絲絨啞緻氣墊粉底，配方輕薄能有效遮蓋毛孔，妝容自然無瑕。",
    ["bestseller", "vegan"], [], "13g + 13g Refill", 4.8, 1876, 50, KR_IMG_P022_ESPOIR_BE_VELVET),

  p("P023", "NAMING.", "Zero Gravity Cover Fit 零重力輕盈貼服氣墊粉底", "Zero Gravity Cover Fit Cushion SPF40 PA++", "naming-zero-gravity-cushion", "makeup", "face", 159, 104,
    "https://www.ohmyglow.co/wp-content/uploads/2024/09/naming-Zero-Gravity-Cover-Fit-Cushion-cover-1.jpg",
    "蝴蝶區毛孔完美修飾，底妝光滑舒服。針對凹凸不平、毛孔瑕疵，無重貼薄輕盈底妝。",
    ["bestseller", "new"], [], "13g + Refill", 4.7, 654),

  p("P024", "Espoir", "Water Splash 爆水提亮潤色防曬乳霜", "Water Splash Sun Cream Ceramide", "espoir-water-splash-sun-cream", "skincare", "sunscreen", 168, 118,
    "https://www.ohmyglow.co/wp-content/uploads/2023/03/Espoir-Water-Splash-Sun-Cream-Ceramide-cover-1.jpg",
    "Espoir 皇牌爆水防曬霜添加 Ceramide 神經酰胺成份，加強皮膚屏障，提高保濕能力。充滿水分清爽感，肌膚水潤柔軟。",
    ["bestseller"], ["dry"], "60ml", 4.7, 1124, 50, KR_IMG_P024_ESPOIR_WATER_SPLASH),

  p("P025", "Glossier", "Lash Slick 皇牌纖長持久睫毛膏", "Lash Slick", "glossier-lash-slick", "makeup", "eye-brow", 175, null,
    "https://www.ohmyglow.co/wp-content/uploads/Lash-Slick-1.jpg",
    "自然增長睫毛，根根分明、自然纖長嘅濃密睫毛。妝效持久，不暈染不結塊，溫水可卸。",
    ["bestseller"], [], "8.5g", 4.6, 432),

  p("P026", "The Saem", "Cover Perfection 多功能完美遮瑕筆", "Cover Perfection Concealer Pencil", "thesaem-cover-perfection-concealer", "makeup", "face", 42, 35,
    "https://www.ohmyglow.co/wp-content/uploads/2023/09/the-saem-Cover-Perfection-Concealer-Pencil-cover-1-3.jpg",
    "2025 GlowPick Awards 第一名遮瑕筆。多種顏色選擇適合不同膚色，方便隨時隨地補妝。",
    ["bestseller", "award-winning"], [], "1.4g", 4.8, 2891),

  p("P027", "Colorgram", "Micro Slim 纖細雙頭眉筆", "Micro Slim Brow Pencil", "colorgram-micro-slim-brow-pencil", "makeup", "eye-brow", 76, 38,
    "https://www.ohmyglow.co/wp-content/uploads/2025/04/colorgram-Micro-Slim-Brow-Pencil-cover-1.jpg",
    "纖細雙頭眉筆，方便攜帶。顏色自然，持久不脫妝，眉毛立體感更佳。",
    ["sale"], [], "0.04g", 4.5, 256),

  p("P028", "twoedit by LUNA", "多功能修飾校正雙色遮瑕盤", "Skin Cover Conceal Palette", "twoedit-skin-cover-conceal", "makeup", "face", 54, null,
    "https://www.ohmyglow.co/wp-content/uploads/2025/07/DaisoLuna-Skin-Cover-Conceal-Palette-cover.avif",
    "專為亞洲肌膚打造嘅多功能修飾遮瑕盤，隨心混合、量膚調色，滿足所有肌膚需求。",
    ["new"], [], "4g", 4.6, 178),

  p("P029", "moev", "Annurcatin 天然蘋果多酚無矽洗髮露", "Annurcatin Shampoo", "moev-annurcatin-shampoo", "body-hair", "hair-care", 116, null,
    "https://www.ohmyglow.co/wp-content/uploads/2025/06/moev-Annurcatin-Shampoo-300ml-cover.jpg",
    "100% 自然來源界面活性劑，為頭皮同髮絲帶來溫和清潔。針對脆弱及受損頭皮，加強髮根力量。",
    ["new"], [], "300ml", 4.7, 423),

  p("P030", "moss", "Hand & Body Lotion 持久療癒芳香潤膚乳液 #Pause", "Hand & Body Lotion Pause", "moss-hand-body-lotion-pause", "body-hair", "body-care", 310, 196,
    "https://www.ohmyglow.co/wp-content/uploads/2023/12/Moss-Hand-Body-lotion-pause.jpg",
    "為日常增添香氣體驗。需要休息嘅時候，停止你正在做嘅事情，閉上眼睛專注於滲入嘅空氣。",
    ["bestseller"], ["dry"], "300ml", 4.8, 567),

  p("P031", "Milk Touch", "野人參金 PDRN 日常特別面膜", "Wild Ginseng Gold PDRN Daily Special Mask", "milk-touch-wild-ginseng-pdrn-mask", "skincare", "mask", 268, 179,
    "https://www.ohmyglow.co/wp-content/uploads/2024/10/Milk-Touch-Wild-Ginseng-Gold-PDRN-Daily-Special-Mask-cover-1.jpg",
    "野人參同 PDRN 成分有效滋潤同修復肌膚。適合日常使用，幫助提升肌膚光澤感。",
    ["new"], ["dry", "sensitive"], "30片", 4.7, 234),

  p("P032", "Torhop", "桑拿海鹽＋綠泥膠原蛋白面膜禮盒", "Saunan Heating Salt + Loyly Green Mud Mask Set", "torhop-saunan-loyly-set", "skincare", "mask", 258, 199,
    "https://www.ohmyglow.co/wp-content/uploads/2025/02/Torhop-Gift-Wrapping-Saunan-Heating-Salt-Mask-35g-Loyly-Green-mud-Collagen-Mask-35g-Set-cover-1.jpg",
    "Torhop 精美禮盒裝，家中一邊 shower 一邊做美肌 SPA。包含桑拿海鹽面膜 35g 同綠泥膠原蛋白面膜 35g。",
    ["sale"], ["pores", "oily"], "35g x 2", 4.6, 189),

  p("P033", "WHIPPED", "Vegan Pack 天然植萃溫和弱酸性卸妝潔面乳", "Vegan Pack Cleanser", "whipped-vegan-pack-cleanser", "skincare", "cleanser", 159, null,
    "https://www.ohmyglow.co/wp-content/uploads/2025/05/Whipped-Vegan-Pack-Cleanser-cover-1.jpg",
    "潔面、面膜及護理三合一。低過敏性配方，有效清除防曬同彩妝，敏感肌適用。",
    ["vegan"], ["sensitive", "dry"], "130g", 4.6, 145),

  p("P034", "ONE THING", "Niacinamide Glutathione 5% 維B穀胱甘肽美白爽膚水", "Niacinamide Glutathione Toner 5%", "one-thing-niacinamide-toner", "skincare", "toner", 186, 138,
    "https://www.ohmyglow.co/wp-content/uploads/2025/01/One-Thing-Niacinamide-Glutathione-Toner-cover-1.jpg",
    "5% Niacinamide 均勻膚色，改善色素沉著。Glutathione 加強美白，無刺激滋潤保養。",
    ["bestseller"], ["dark-spots", "sensitive"], "210ml", 4.7, 678, 50, KR_IMG_P034_ONE_THING_NIACINAMIDE),

  p("P035", "numbuzin", "No.3 Radiance Glowing 酵母提亮去暗沉爽膚棉片", "No.3 Radiance Glowing Jumbo Pad", "numbuzin-no3-radiance-pad", "skincare", "toner", 198, 138,
    "https://www.ohmyglow.co/wp-content/uploads/2023/11/numbuzin-No.3-Radiance-Glowing-Jumbo-Essence-Pad-cover-1.jpg",
    "50種氨基酸、礦物質等發酵成份精華，重啟透亮光澤肌。適合皮膚粗糙、捱夜臘黃肌。",
    ["bestseller"], ["dullness", "sensitive"], "70片", 4.8, 1289),

  p("P036", "S.Nature", "Aqua Oasis 綠洲泛醇保濕降溫舒緩棉片", "Aqua Oasis Panthe-Allan Calming Pad", "snature-aqua-oasis-pad", "skincare", "toner", 198, 126,
    "https://www.ohmyglow.co/wp-content/uploads/2024/11/S-NATURE-Aqua-Oasis-Panthe-Allan-Calming-Pad-cover.jpg",
    "D-泛醇 30,000ppm + 尿囊素 1,500ppm + 8 種透明質酸，強效保濕同舒緩。EWG 綠色等級認證。",
    ["bestseller"], ["sensitive", "dry"], "60片", 4.8, 945),
];

export const featuredProducts = allProducts.filter(
  (p) => p.tags.includes("bestseller") || p.tags.includes("award-winning")
);

export const getProductsByCategory = (category: string) =>
  allProducts.filter((p) => p.category === category && p.active);

export const getProductsBySubcategory = (category: string, subcategory: string) =>
  allProducts.filter(
    (p) => p.category === category && p.subcategory === subcategory && p.active
  );

export const getProductBySlug = (slug: string) =>
  allProducts.find((p) => p.slug === slug);
