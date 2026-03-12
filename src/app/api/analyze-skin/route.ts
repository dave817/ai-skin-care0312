import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY! });

const ANALYSIS_PROMPT = `你是一位專業的皮膚科顧問。請分析以下面部照片，提供詳細的膚質分析報告。

請用繁體中文回覆，嚴格按照以下JSON格式輸出（不要加任何markdown標記，直接輸出JSON）：

{
  "overallScore": 75,
  "skinType": "混合性肌膚",
  "concerns": [
    {
      "name": "毛孔",
      "score": 65,
      "level": "中度",
      "description": "T字位毛孔較明顯，需要定期清潔和收斂護理"
    },
    {
      "name": "水潤度",
      "score": 55,
      "level": "偏低",
      "description": "肌膚略顯乾燥，需要加強保濕"
    },
    {
      "name": "膚色均勻度",
      "score": 70,
      "level": "良好",
      "description": "整體膚色尚算均勻，局部有輕微色素沉著"
    },
    {
      "name": "細紋",
      "score": 80,
      "level": "良好",
      "description": "皮膚彈性不錯，暫無明顯細紋"
    },
    {
      "name": "敏感度",
      "score": 70,
      "level": "中度",
      "description": "局部有輕微泛紅，需注意舒緩護理"
    },
    {
      "name": "油脂分泌",
      "score": 60,
      "level": "偏高",
      "description": "T字位油脂分泌較旺盛"
    },
    {
      "name": "痘痘/粉刺",
      "score": 75,
      "level": "輕度",
      "description": "少量粉刺，注意清潔即可"
    },
    {
      "name": "黑眼圈",
      "score": 65,
      "level": "中度",
      "description": "眼周略顯暗沉"
    }
  ],
  "summary": "您的肌膚整體狀況良好，屬於混合性肌膚。主要需要注意T字位控油和全面保濕。建議早晚使用溫和潔面產品，配合保濕精華和面霜。",
  "morningRoutine": [
    "溫和潔面乳清潔",
    "保濕化妝水",
    "維他命C精華液",
    "清爽保濕乳液",
    "防曬霜 SPF50+"
  ],
  "nightRoutine": [
    "卸妝油/卸妝乳",
    "溫和潔面乳",
    "去角質（每週2次）",
    "保濕精華液",
    "修護面霜",
    "眼霜"
  ],
  "recommendedProductIds": ["P001", "P005", "P008", "P006", "P013"],
  "warnings": ["AI 分析僅供參考，不構成醫療建議。如有嚴重皮膚問題，請諮詢專業皮膚科醫生。"]
}

注意事項：
- overallScore 是0-100的整體評分
- 每個concern的score也是0-100，分數越高代表狀態越好
- level 用「良好」「中度」「偏低」「偏高」「輕度」「嚴重」來形容
- recommendedProductIds 必須從以下ID中選擇：P001-P032
- 根據實際照片情況給出真實評估，不要太過樂觀或悲觀
- summary 要簡短精準，2-3句話
- morningRoutine 和 nightRoutine 各列出4-6個步驟`;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Collect all uploaded images
    const imageParts: { inlineData: { data: string; mimeType: string } }[] = [];

    for (const key of ["front", "left", "right"]) {
      const file = formData.get(key) as File | null;
      if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        imageParts.push({
          inlineData: {
            data: base64,
            mimeType: file.type || "image/jpeg",
          },
        });
      }
    }

    if (imageParts.length === 0) {
      return NextResponse.json(
        { error: "請至少上傳一張面部照片" },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        {
          role: "user",
          parts: [
            ...imageParts,
            { text: ANALYSIS_PROMPT },
          ],
        },
      ],
    });

    const text = response.text || "";

    // Try to parse the JSON from the response
    let analysisResult;
    try {
      // Remove any markdown code block markers if present
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      analysisResult = JSON.parse(cleaned);
    } catch {
      // If parsing fails, return a structured error
      return NextResponse.json(
        { error: "AI 分析結果解析失敗，請重試", raw: text },
        { status: 500 }
      );
    }

    return NextResponse.json(analysisResult);
  } catch (error: unknown) {
    console.error("Skin analysis error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `分析過程中發生錯誤: ${message}` },
      { status: 500 }
    );
  }
}
