export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  date: string;
  author: string;
  tags: string[];
  relatedProductIds: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "blog-001",
    slug: "korean-hair-care-spa-guide",
    title: "📌韓系美髮育髮清單.zip🎀 | ⏰限時優惠低至88折⚡喺屋企都可以自製星級 HAIR SPA👩🏻‍🦰🥰",
    excerpt: "最近又笠又濕嘅天氣搞到冇心機整頭添！不如趁機在家做個Hair Spa，從頭皮管理到受損修護全部搞掂。以下精選韓系美髮育髮好物，限時優惠低至88折！",
    content: `<h2>重點頭皮管理 🧴</h2>
<p>頭皮健康係靚頭髮嘅基礎！定期做頭皮深層清潔，可以幫助去除多餘油脂和老廢角質，令頭皮呼吸暢通。</p>
<p>👉🏻 建議每週使用1-2次頭皮去角質產品</p>
<p>👉🏻 配合頭皮精華按摩，促進血液循環</p>

<h2>改善受損毛躁髮質 💆‍♀️</h2>
<p>經常染燙、使用熱工具都會令頭髮受損毛躁。選擇含有角蛋白、胺基酸嘅護髮產品，可以深層修復受損髮質。</p>
<p>👉🏻 洗髮後用護髮素集中修護髮尾</p>
<p>👉🏻 每週做一次深層髮膜護理</p>

<h2>日常養護防掉髮 🌿</h2>
<p>壓力大、作息不規律都可能導致掉髮問題。日常養護好重要！</p>
<p>👉🏻 選擇溫和的洗髮水，避免過度清潔</p>
<p>👉🏻 適當補充營養，保持良好作息</p>

<h2>美髮造型定型 💫</h2>
<p>最後唔少得造型定型產品！輕盈唔黏笠嘅護髮油同定型噴霧，幫你打造自然蓬鬆髮型。</p>`,
    coverImage: "https://www.ohmyglow.co/wp-content/uploads/2026/03/Fillimilli-Matte-Fit-Brush-831-Puff-Duo-cover-510x612.jpg",
    date: "2026-03-06",
    author: "Oh!MyGlow",
    tags: ["頭髮護理", "Hair Spa", "韓系美髮"],
    relatedProductIds: ["P016", "P017", "P018", "P019", "P020"],
  },
  {
    id: "blog-002",
    slug: "march-new-products-recap",
    title: "🌸3月新品Recap | \\Minsco聯名/ 零毛孔命定胭脂☺️💫",
    excerpt: "3月份新品大放送！最矚目當然係Espoir X Minsco聯名腮紅，細膩粉質打造零毛孔柔焦妝效。仲有多款新品護膚同彩妝等緊你！",
    content: `<h2>本月最矚目：Espoir X Minsco 聯名腮紅 🌸</h2>
<p>韓國美妝KOL Minsco同Espoir聯名推出嘅柔焦腮紅，一推出就全網爆紅！質地細膩柔滑，輕輕一掃就可以打造自然好氣色。</p>
<p>👉🏻 柔焦粉質，打造零毛孔妝效</p>
<p>👉🏻 持久不脫妝，適合香港潮濕天氣</p>
<p>👉🏻 多個色號可選，冷暖皮都友好</p>

<h2>新品護膚推薦 💧</h2>
<p>Pro-Calm EGF 活膚修護面霜都係今個月必試新品！含EGF表皮生長因子，促進肌膚細胞更新。</p>

<h2>彩妝新品速覽 💄</h2>
<p>Colorgram 水果玻璃唇釉新色上架，透明果凍質地超級顯色！About Tone 迷你唇釉都值得一試。</p>`,
    coverImage: "https://www.ohmyglow.co/wp-content/uploads/2026/02/ABIB-PDRN-Glow-serum-40-pump-cover-510x612.jpg",
    date: "2026-03-06",
    author: "Oh!MyGlow",
    tags: ["新品", "彩妝", "腮紅"],
    relatedProductIds: ["P030", "P013", "P021", "P024"],
  },
  {
    id: "blog-003",
    slug: "lip-makeup-remover-review",
    title: "小編真心話💬 其實就咁用眼唇卸妝液💧抹幾下係落唔乾淨的",
    excerpt: "好多人都以為眼唇卸妝液就萬能，但其實好多持久唇彩單靠普通卸妝液係卸唔乾淨！今次小編實測幾款卸唇產品，睇下邊款最有效。",
    content: `<h2>你有冇試過卸唔乾淨唇彩？ 🤔</h2>
<p>相信好多姊妹都試過，明明已經用咗眼唇卸妝液擦咗好多下，但唇色仲係殘留喺度。尤其係啲持久唇釉同唇泥，真係好難完全卸除。</p>

<h2>實測結果 ✨</h2>
<p>今次小編試咗3款專門針對唇彩嘅卸妝產品：</p>
<p>👉🏻 <strong>Laka Washful Tint Remover</strong> — 溫和度最高，卸除力強</p>
<p>👉🏻 普通眼唇卸妝液 — 需要反覆擦拭多次</p>
<p>👉🏻 卸妝油 — 可以卸除但比較油膩</p>

<h2>小編推薦 💝</h2>
<p>如果你經常使用持久唇彩，真心推薦入一支專門嘅唇彩卸妝液。溫和唔刺激之餘，卸除力都好強！</p>`,
    coverImage: "https://www.ohmyglow.co/wp-content/uploads/2026/01/Laka-Washful-Tint-Remover-cover-1-510x612.jpg",
    date: "2026-02-27",
    author: "Oh!MyGlow",
    tags: ["卸妝", "唇彩", "實測"],
    relatedProductIds: ["P023", "P021", "P022"],
  },
  {
    id: "blog-004",
    slug: "bubble-skincare-series",
    title: "泡泡點止潔面咁簡單🫧 泡泡精華同mask都dope",
    excerpt: "泡泡護膚唔止得潔面！最新泡泡精華同泡泡面膜都超級好用，輕盈質地但保濕力超強。快啲嚟睇下有咩新品值得入手！",
    content: `<h2>泡泡護膚新趨勢 🫧</h2>
<p>以前講到泡泡護膚，大家第一時間都會諗到泡泡潔面。但而家泡泡護膚已經進化到精華、面膜都有泡泡版本！</p>

<h2>泡泡潔面推薦 🧼</h2>
<p>menokin 30秒泡泡潔面乳係近期大熱！只需30秒就可以完成清潔，綿密泡沫深入毛孔同時保護肌膚屏障。</p>

<h2>泡泡精華新體驗 ✨</h2>
<p>泡泡質地嘅精華液用起嚟超級輕盈，完全唔會有黏膩感。適合夏天或者油性肌膚使用。</p>

<h2>泡泡面膜玩新花樣 🎭</h2>
<p>新一代泡泡面膜唔止清潔，仲加入咗保濕同亮膚成分，一邊起泡一邊護膚，超級療癒！</p>`,
    coverImage: "https://www.ohmyglow.co/wp-content/uploads/2026/01/menokin-30-Seconds-Bubble-Cleanser-PORE-CLEAR-150ml-cover-510x612.jpg",
    date: "2026-02-03",
    author: "Oh!MyGlow",
    tags: ["護膚", "泡泡", "潔面"],
    relatedProductIds: ["P003", "P001", "P004"],
  },
  {
    id: "blog-005",
    slug: "pink-blossom-lip-colors",
    title: "🌸Blossom Pink.zip | 🎀OMG私心推薦粉紅系靚唇色",
    excerpt: "春天嚟啦！粉紅色系唇彩係春日必備妝容。OMG小編精選多款粉紅系唇色，從嫩粉到乾燥玫瑰色都有，總有一隻適合你！",
    content: `<h2>春日必備粉紅唇色 🌸</h2>
<p>春天係最適合粉紅色妝容嘅季節！無論係淡淡嘅嫩粉色定係帶灰調嘅乾燥玫瑰色，都可以令成個人睇起來甜美又有氣質。</p>

<h2>嫩粉色系推薦 💗</h2>
<p>適合素顏或者淡妝嘅日常使用，一擦即刻提升好氣色。</p>

<h2>乾燥玫瑰色系 🌹</h2>
<p>帶少少灰調嘅玫瑰粉色，更加顯白之餘又唔會太過甜膩，OL日常都適用。</p>

<h2>水蜜桃粉色系 🍑</h2>
<p>帶暖調嘅水蜜桃粉色，打造元氣滿滿嘅可愛妝容。約會必備！</p>`,
    coverImage: "https://www.ohmyglow.co/wp-content/uploads/2026/03/Bring-Green-Bamboo-Hyalu-Lip-Essence-MoistureColor-Double-Set-cover-1-510x612.jpg",
    date: "2026-02-20",
    author: "Oh!MyGlow",
    tags: ["唇彩", "粉紅色", "春日妝容"],
    relatedProductIds: ["P021", "P022", "P024"],
  },
  {
    id: "blog-006",
    slug: "pdrn-skincare-guide",
    title: "🧬PDRN護膚全攻略 | 2026最火成分你一定要識",
    excerpt: "PDRN（多核苷酸）成為2026年最火護膚成分！可以促進細胞再生修復，改善膚色暗沉和細紋。以下為你整理PDRN護膚完全指南。",
    content: `<h2>什麼是PDRN？ 🧬</h2>
<p>PDRN（Polydeoxyribonucleotide）即多核苷酸，係從三文魚DNA中提取嘅成分。佢可以促進細胞生長因子分泌，加速肌膚修復再生。</p>

<h2>PDRN嘅功效 ✨</h2>
<p>👉🏻 促進膠原蛋白生成</p>
<p>👉🏻 加速傷口癒合</p>
<p>👉🏻 改善膚色暗沉</p>
<p>👉🏻 減少細紋和皺紋</p>

<h2>點揀PDRN產品？ 🛒</h2>
<p>市面上PDRN產品越嚟越多，建議選擇濃度適中、配方精簡嘅產品。Abib同Wellage都係口碑好好嘅選擇。</p>`,
    coverImage: "https://www.ohmyglow.co/wp-content/uploads/2026/02/Wellage-Hyper-PDRN-One-Day-Kit-7ea-cover-510x612.jpg",
    date: "2026-01-15",
    author: "Oh!MyGlow",
    tags: ["護膚", "PDRN", "成分教學"],
    relatedProductIds: ["P008", "P009"],
  },
];

// Helper: get blog by slug
export const getBlogBySlug = (slug: string) =>
  blogPosts.find((b) => b.slug === slug);

// Helper: get related products for a blog
export const getBlogRelatedProducts = (blog: BlogPost) => {
  // Dynamic import avoided — caller should import allProducts directly
  // This is kept for backward compat but prefer importing allProducts from products.ts
  return blog.relatedProductIds;
};
