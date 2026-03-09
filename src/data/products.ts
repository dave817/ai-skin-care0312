export interface Product {
  id: string;
  slug: string;
  brand: string;
  nameZh: string;
  nameEn: string;
  category: string;
  priceOriginal: number;
  priceSale: number | null;
  currency: string;
  descriptionZh: string;
  ingredients: string;
  imageUrl: string;
  imageAlt: string;
  tags: string[];
  skinConcerns: string[];
  volume: string;
  stock: number;
  active: boolean;
}

// Realistic placeholder images — skincare product photography style
// Using picsum with specific seeds for consistent results
const img = (seed: number) =>
  `https://picsum.photos/seed/skincare${seed}/600/600`;

export const featuredProducts: Product[] = [
  {
    id: "SKU001",
    slug: "cosrx-low-ph-cleanser",
    brand: "COSRX",
    nameZh: "低pH值早安凝膠潔面乳",
    nameEn: "Low pH Good Morning Gel Cleanser",
    category: "cleanser",
    priceOriginal: 128,
    priceSale: 98,
    currency: "HKD",
    descriptionZh: "溫和低pH潔面乳，適合每日早晚使用。含茶樹油成分，深層清潔同時不破壞肌膚屏障。",
    ingredients: "Water, Cocamidopropyl Betaine, Sodium Lauroyl Aspartate, Tea Tree Oil...",
    imageUrl: img(101),
    imageAlt: "COSRX 低pH值早安凝膠潔面乳",
    tags: ["bestseller"],
    skinConcerns: ["acne", "oily", "pores"],
    volume: "150ml",
    stock: 45,
    active: true,
  },
  {
    id: "SKU002",
    slug: "klairs-supple-preparation-toner",
    brand: "Dear, Klairs",
    nameZh: "柔潤保濕化妝水",
    nameEn: "Supple Preparation Facial Toner",
    category: "toner",
    priceOriginal: 198,
    priceSale: 168,
    currency: "HKD",
    descriptionZh: "無刺激保濕化妝水，為後續護膚做好準備。含透明質酸，深層補水不黏膩。",
    ingredients: "Water, Butylene Glycol, Dimethyl Sulfone, Betaine, Sodium Hyaluronate...",
    imageUrl: img(102),
    imageAlt: "Dear, Klairs 柔潤保濕化妝水",
    tags: ["new"],
    skinConcerns: ["dehydration", "sensitive"],
    volume: "180ml",
    stock: 38,
    active: true,
  },
  {
    id: "SKU003",
    slug: "beauty-of-joseon-glow-serum",
    brand: "Beauty of Joseon",
    nameZh: "人蔘亮膚精華液",
    nameEn: "Glow Serum: Propolis + Niacinamide",
    category: "serum",
    priceOriginal: 158,
    priceSale: null,
    currency: "HKD",
    descriptionZh: "蜂膠與煙醯胺精華液，提亮膚色、收細毛孔。輕薄質地快速吸收，適合所有膚質。",
    ingredients: "Propolis Extract, Niacinamide, Butylene Glycol, Glycerin...",
    imageUrl: img(103),
    imageAlt: "Beauty of Joseon 人蔘亮膚精華液",
    tags: ["bestseller", "new"],
    skinConcerns: ["dark-spots", "pores", "dull"],
    volume: "30ml",
    stock: 22,
    active: true,
  },
  {
    id: "SKU004",
    slug: "laneige-water-sleeping-mask",
    brand: "LANEIGE",
    nameZh: "睡眠面膜",
    nameEn: "Water Sleeping Mask",
    category: "mask",
    priceOriginal: 268,
    priceSale: 228,
    currency: "HKD",
    descriptionZh: "過夜保濕睡眠面膜，睡眠時深層補水修復。含 SLEEP-TOX™ 淨化技術，醒來肌膚水潤飽滿。",
    ingredients: "Water, Butylene Glycol, Cyclopentasiloxane, Glycerin, Trehalose...",
    imageUrl: img(104),
    imageAlt: "LANEIGE 睡眠面膜",
    tags: ["bestseller"],
    skinConcerns: ["dehydration", "fine-lines"],
    volume: "70ml",
    stock: 30,
    active: true,
  },
  {
    id: "SKU005",
    slug: "isntree-hyaluronic-acid-watery-sun-gel",
    brand: "Isntree",
    nameZh: "透明質酸水潤防曬凝膠",
    nameEn: "Hyaluronic Acid Watery Sun Gel",
    category: "sunscreen",
    priceOriginal: 178,
    priceSale: 148,
    currency: "HKD",
    descriptionZh: "SPF50+ PA++++ 高效防曬，水潤質地不泛白。含透明質酸保濕成分，防曬同時補水。",
    ingredients: "Water, Dibutyl Adipate, Homosalate, Silica, Hyaluronic Acid...",
    imageUrl: img(105),
    imageAlt: "Isntree 透明質酸水潤防曬凝膠",
    tags: ["new"],
    skinConcerns: ["sun-protection", "dehydration"],
    volume: "50ml",
    stock: 55,
    active: true,
  },
  {
    id: "SKU006",
    slug: "skin1004-centella-ampoule",
    brand: "SKIN1004",
    nameZh: "積雪草舒緩安瓶精華",
    nameEn: "Madagascar Centella Asiatica Ampoule",
    category: "serum",
    priceOriginal: 188,
    priceSale: 158,
    currency: "HKD",
    descriptionZh: "馬達加斯加積雪草精華，鎮定修復敏感肌膚。純淨成分，適合痘痘肌和敏感肌使用。",
    ingredients: "Centella Asiatica Extract (100%)...",
    imageUrl: img(106),
    imageAlt: "SKIN1004 積雪草舒緩安瓶精華",
    tags: [],
    skinConcerns: ["redness", "sensitive", "acne"],
    volume: "100ml",
    stock: 42,
    active: true,
  },
  {
    id: "SKU007",
    slug: "illiyoon-ceramide-cream",
    brand: "Illiyoon",
    nameZh: "神經酰胺修護面霜",
    nameEn: "Ceramide Ato Concentrate Cream",
    category: "moisturizer",
    priceOriginal: 198,
    priceSale: null,
    currency: "HKD",
    descriptionZh: "強效修護面霜，重建肌膚屏障。含神經酰胺成分，適合乾燥和敏感肌膚長效保濕。",
    ingredients: "Water, Butylene Glycol, Hydrogenated Poly, Ceramide NP...",
    imageUrl: img(107),
    imageAlt: "Illiyoon 神經酰胺修護面霜",
    tags: [],
    skinConcerns: ["dry", "sensitive", "barrier-repair"],
    volume: "200ml",
    stock: 35,
    active: true,
  },
  {
    id: "SKU008",
    slug: "anua-heartleaf-toner",
    brand: "Anua",
    nameZh: "魚腥草77%舒緩化妝水",
    nameEn: "Heartleaf 77% Soothing Toner",
    category: "toner",
    priceOriginal: 218,
    priceSale: 178,
    currency: "HKD",
    descriptionZh: "77% 魚腥草萃取，溫和舒緩鎮定。調節油脂分泌，改善痘痘肌膚狀況，四季皆宜。",
    ingredients: "Houttuynia Cordata Extract (77%), Butylene Glycol, 1,2-Hexanediol...",
    imageUrl: img(108),
    imageAlt: "Anua 魚腥草77%舒緩化妝水",
    tags: ["bestseller"],
    skinConcerns: ["acne", "redness", "oily"],
    volume: "250ml",
    stock: 28,
    active: true,
  },
];

export const categories = [
  { id: "all", labelZh: "全部" },
  { id: "cleanser", labelZh: "潔面" },
  { id: "toner", labelZh: "化妝水" },
  { id: "serum", labelZh: "精華" },
  { id: "moisturizer", labelZh: "面霜" },
  { id: "sunscreen", labelZh: "防曬" },
  { id: "mask", labelZh: "面膜" },
  { id: "eye-care", labelZh: "眼部護理" },
];
