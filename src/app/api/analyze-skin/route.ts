import { NextRequest, NextResponse } from "next/server";
import { getVertexClient, MODEL_PRO } from "@/lib/ai/vertex-client";
import { getProductCatalog, filterValidProductIds } from "@/lib/ai/product-catalog-prompt";
import { checkSkinAnalysisLimit } from "@/lib/rate-limit";

export const maxDuration = 60;
export const runtime = "nodejs";

const CONCERN_NAMES = [
  "毛孔",
  "水潤度",
  "膚色均勻度",
  "細紋",
  "敏感度",
  "油脂分泌",
  "痘痘/粉刺",
  "黑眼圈",
] as const;

function buildAnalysisPrompt(catalogString: string): string {
  return `你是一位專業嘅皮膚科顧問。請仔細分析以下面部照片，提供針對該用戶實際情況嘅深入膚質報告（用繁體中文，廣東話語氣自然親切）。

請嚴格按照以下JSON格式輸出（純JSON，不要加markdown 標記）：

{
  "overallScore": 75,
  "skinType": "混合性肌膚",
  "concerns": [
    {
      "name": "毛孔",
      "score": 65,
      "level": "中度",
      "description": "T字位毛孔較明顯，需要定期清潔同收斂護理",
      "detailedExplanation": "150-250字針對該用戶實際分數同照片所見細節嘅深入解釋，要具體描述觀察到嘅問題部位、成因、發展趨勢，並建議護理方向。例如：「從正面同側面睇到，鼻翼及鼻頭兩側毛孔比較粗大，呢類粗大毛孔通常源於皮脂腺活躍同清潔不徹底⋯⋯」",
      "recommendedProductIds": ["P001", "P008"]
    }
  ],
  "summary": "您嘅肌膚整體狀況良好...（2-3句精準總結）",
  "morningRoutine": [
    { "step": "溫和潔面乳清潔", "productIds": ["P003"] },
    { "step": "保濕化妝水", "productIds": ["P011"] },
    { "step": "維他命C精華液", "productIds": ["P008"] },
    { "step": "清爽保濕乳液", "productIds": ["P006"] },
    { "step": "防曬霜 SPF50+", "productIds": ["P013"] }
  ],
  "nightRoutine": [
    { "step": "卸妝油/卸妝乳", "productIds": ["P004"] },
    { "step": "溫和潔面乳", "productIds": ["P003"] },
    { "step": "保濕精華液", "productIds": ["P008"] },
    { "step": "修護面霜", "productIds": ["P006"] },
    { "step": "眼霜", "productIds": ["P020"] }
  ],
  "warnings": ["AI 分析僅供參考，不構成醫療建議。如有嚴重皮膚問題，請諮詢專業皮膚科醫生。"]
}

要求：
- overallScore 同每個 concern 嘅 score 都係 0-100，分數越高代表狀態越好
- concerns 必須完整包含呢8項：${CONCERN_NAMES.join("、")}
- level 用「良好」「中度」「偏低」「偏高」「輕度」「嚴重」
- 每個 concern 嘅 detailedExplanation 必須**針對該用戶嘅實際分數**深入解釋，唔可以複製通用模板
- 每個 concern 嘅 recommendedProductIds 必須揀 2-3 個（從下方產品清單）；揀同 concern 最匹配嘅產品（睇 skinConcerns 標籤）
- morningRoutine + nightRoutine 每步驟嘅 productIds 揀 1-2 個
- 所有 product ID 必須來自下方清單，唔可以憑空創造
- summary 簡短 2-3 句

可用產品清單（只能揀以下 ID）：
${catalogString}
`;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

interface RawConcern {
  name?: unknown;
  score?: unknown;
  level?: unknown;
  description?: unknown;
  detailedExplanation?: unknown;
  recommendedProductIds?: unknown;
}

interface RawRoutineStep {
  step?: unknown;
  productIds?: unknown;
}

interface SanitizedConcern {
  name: string;
  score: number;
  level: string;
  description: string;
  detailedExplanation: string;
  recommendedProductIds: string[];
}

interface SanitizedRoutineStep {
  step: string;
  productIds: string[];
}

async function sanitizeConcerns(raw: unknown): Promise<SanitizedConcern[]> {
  if (!Array.isArray(raw)) return [];
  const result: SanitizedConcern[] = [];
  for (const c of raw as RawConcern[]) {
    const name = typeof c.name === "string" ? c.name : "";
    if (!name) continue;
    result.push({
      name,
      score:
        typeof c.score === "number" ? Math.max(0, Math.min(100, c.score)) : 50,
      level: typeof c.level === "string" ? c.level : "中度",
      description: typeof c.description === "string" ? c.description : "",
      detailedExplanation:
        typeof c.detailedExplanation === "string" ? c.detailedExplanation : "",
      recommendedProductIds: await filterValidProductIds(c.recommendedProductIds),
    });
  }
  return result;
}

async function sanitizeRoutine(raw: unknown): Promise<SanitizedRoutineStep[]> {
  if (!Array.isArray(raw)) return [];
  const result: SanitizedRoutineStep[] = [];
  for (const s of raw as (RawRoutineStep | string)[]) {
    if (typeof s === "string") {
      if (s) result.push({ step: s, productIds: [] });
      continue;
    }
    const step = typeof s.step === "string" ? s.step : "";
    if (!step) continue;
    const productIds = await filterValidProductIds(s.productIds);
    result.push({ step, productIds });
  }
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const deviceId = (formData.get("deviceId") as string | null) ?? "anon";
    const ip = getClientIp(request);
    const bypassToken = request.headers.get("x-admin-bypass");

    const limitResult = await checkSkinAnalysisLimit(deviceId, ip, bypassToken);
    if (!limitResult.success) {
      const resetIso = new Date(limitResult.reset).toISOString();
      return NextResponse.json(
        {
          error: "今日分析次數已用完，請明日再試",
          quota: { remaining: 0, limit: limitResult.limit, resetAt: resetIso },
        },
        { status: 429 }
      );
    }

    const imageParts: { inlineData: { data: string; mimeType: string } }[] = [];
    for (const key of ["front", "left", "right"] as const) {
      const file = formData.get(key) as File | null;
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        imageParts.push({
          inlineData: { data: base64, mimeType: file.type || "image/jpeg" },
        });
      }
    }

    if (imageParts.length === 0) {
      return NextResponse.json(
        { error: "請至少上傳一張面部照片" },
        { status: 400 }
      );
    }

    const { promptString } = await getProductCatalog();
    const ai = getVertexClient();

    const response = await ai.models.generateContent({
      model: MODEL_PRO,
      contents: [
        {
          role: "user",
          parts: [...imageParts, { text: buildAnalysisPrompt(promptString) }],
        },
      ],
    });

    const text = response.text || "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "AI 分析結果解析失敗，請重試", raw: text.slice(0, 500) },
        { status: 500 }
      );
    }

    const [concerns, morningRoutine, nightRoutine] = await Promise.all([
      sanitizeConcerns(parsed.concerns),
      sanitizeRoutine(parsed.morningRoutine),
      sanitizeRoutine(parsed.nightRoutine),
    ]);

    const sanitized = {
      overallScore:
        typeof parsed.overallScore === "number"
          ? Math.max(0, Math.min(100, parsed.overallScore))
          : 70,
      skinType: typeof parsed.skinType === "string" ? parsed.skinType : "綜合性肌膚",
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      concerns,
      morningRoutine,
      nightRoutine,
      warnings: Array.isArray(parsed.warnings)
        ? parsed.warnings.filter((w): w is string => typeof w === "string")
        : ["AI 分析僅供參考，不構成醫療建議。如有嚴重皮膚問題，請諮詢專業皮膚科醫生。"],
      quota: {
        remaining: limitResult.remaining,
        limit: limitResult.limit,
        resetAt: new Date(limitResult.reset).toISOString(),
        bypassed: limitResult.bypassed === true,
      },
    };

    return NextResponse.json(sanitized);
  } catch (error: unknown) {
    console.error("Skin analysis error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `分析過程中發生錯誤: ${message}` },
      { status: 500 }
    );
  }
}
