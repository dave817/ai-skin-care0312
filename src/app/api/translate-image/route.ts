import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { put } from "@vercel/blob";
import { getVertexClient, MODEL_FLASH } from "@/lib/ai/vertex-client";
import { verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/admin-auth";
import { checkTranslateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 60;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

interface TextBlock {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  align?: "left" | "center" | "right";
  color?: string;
  bold?: boolean;
}

interface TranslatedLayout {
  width: number;
  height: number;
  blocks: TextBlock[];
}

const TRANSLATE_PROMPT = `你係一位專業嘅圖像 OCR 同翻譯助手。請仔細分析呢張圖片（通常係韓國美妝產品嘅長圖描述），完成以下任務：

1. 識別圖中所有韓文/英文文字區塊
2. 將每個區塊嘅文字翻譯成**繁體中文**（用香港用語，自然流暢，符合美妝行銷語感）
3. 為每個文字區塊估計座標（x, y）同尺寸（width, height），單位 px
4. 估計合適嘅字體大小同對齊方式

請嚴格輸出純 JSON（不要 markdown 標記）：

{
  "width": 1080,
  "height": 1500,
  "blocks": [
    {
      "text": "翻譯後嘅繁體中文文字",
      "x": 100,
      "y": 80,
      "width": 880,
      "height": 60,
      "fontSize": 42,
      "align": "center",
      "color": "#222222",
      "bold": true
    }
  ]
}

要求：
- width/height 用圖片實際比例（如原圖係 1080x1500，就用呢個尺寸）
- 文字 fontSize 範圍 18-72，根據原文視覺重要性決定
- align: "left" / "center" / "right"
- color: 用 hex 格式，根據原文顏色估計
- bold: 標題/重點文字 true，正文 false
- blocks 順序由上至下、由左至右
- 翻譯要保留原文嘅標點、emoji、特殊符號（例如 ♥ ★）
- 唔好亂加原文冇嘅內容
- 如果某段文字翻譯後太長，可以斷行用 \\n
`;

let cachedFont: Buffer | null = null;

async function loadFont(): Promise<Buffer> {
  if (cachedFont) return cachedFont;
  const fontPath = path.join(process.cwd(), "public", "fonts", "NotoSansTC-Regular.otf");
  const data = await readFile(fontPath);
  cachedFont = data;
  return data;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function sanitizeBlock(b: unknown, maxW: number, maxH: number): TextBlock | null {
  if (typeof b !== "object" || b === null) return null;
  const obj = b as Record<string, unknown>;
  const text = typeof obj.text === "string" ? obj.text : "";
  if (!text.trim()) return null;
  return {
    text,
    x: clamp(typeof obj.x === "number" ? obj.x : 0, 0, maxW),
    y: clamp(typeof obj.y === "number" ? obj.y : 0, 0, maxH),
    width: clamp(typeof obj.width === "number" ? obj.width : 200, 50, maxW),
    height: clamp(typeof obj.height === "number" ? obj.height : 40, 20, maxH),
    fontSize: clamp(typeof obj.fontSize === "number" ? obj.fontSize : 28, 14, 96),
    align:
      obj.align === "center" || obj.align === "right" ? obj.align : "left",
    color: typeof obj.color === "string" && /^#[0-9A-Fa-f]{6}$/.test(obj.color)
      ? obj.color
      : "#222222",
    bold: obj.bold === true,
  };
}

function parseLayout(raw: unknown): TranslatedLayout | null {
  if (typeof raw !== "object" || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  const width = clamp(typeof obj.width === "number" ? obj.width : 1080, 320, 2048);
  const height = clamp(typeof obj.height === "number" ? obj.height : 1500, 320, 8000);
  if (!Array.isArray(obj.blocks)) return null;
  const blocks = obj.blocks
    .map((b) => sanitizeBlock(b, width, height))
    .filter((b): b is TextBlock => b !== null)
    .slice(0, 60);
  if (blocks.length === 0) return null;
  return { width, height, blocks };
}

async function renderLayout(layout: TranslatedLayout): Promise<Buffer> {
  const fontData = await loadFont();
  /* Satori accepts plain element objects but its TS types expect React.ReactNode.
     Cast through unknown to satisfy the satori parameter typing. */
  const tree = {
    type: "div",
    props: {
      style: {
        display: "flex",
        width: layout.width,
        height: layout.height,
        backgroundColor: "#FFFFFF",
        position: "relative",
        fontFamily: "NotoTC",
      },
      children: layout.blocks.map((b, i) => ({
        key: i,
        type: "div",
        props: {
          style: {
            position: "absolute",
            left: b.x,
            top: b.y,
            width: b.width,
            height: b.height,
            fontSize: b.fontSize,
            color: b.color ?? "#222222",
            fontWeight: b.bold ? 700 : 400,
            textAlign: b.align ?? "left",
            lineHeight: 1.4,
            display: "flex",
            alignItems: "flex-start",
            justifyContent:
              b.align === "center"
                ? "center"
                : b.align === "right"
                ? "flex-end"
                : "flex-start",
            whiteSpace: "pre-wrap",
          },
          children: b.text,
        },
      })),
    },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const svg = await satori(tree as any, {
    width: layout.width,
    height: layout.height,
    fonts: [
      {
        name: "NotoTC",
        data: fontData,
        weight: 400,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: layout.width } });
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function POST(request: NextRequest) {
  try {
    /* Admin auth required (defence against AI cost abuse) */
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!(await verifyAuthToken(token))) {
      return NextResponse.json({ error: "未登入" }, { status: 401 });
    }

    /* Rate limit (additional belt-and-braces) */
    const ip = getClientIp(request);
    const limit = await checkTranslateLimit(ip);
    if (!limit.success) {
      return NextResponse.json(
        { error: "翻譯次數過多（每小時上限），請稍後再試" },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    if (!file || file.size === 0) {
      return NextResponse.json({ error: "請上傳一張圖片" }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "圖片大小不可超過 10MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const ai = getVertexClient();
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: base64,
                mimeType: file.type || "image/jpeg",
              },
            },
            { text: TRANSLATE_PROMPT },
          ],
        },
      ],
    });

    const text = response.text || "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "AI 解析失敗，請重試", raw: text.slice(0, 500) },
        { status: 500 }
      );
    }

    const layout = parseLayout(parsed);
    if (!layout) {
      return NextResponse.json(
        { error: "圖片中未識別到可翻譯文字" },
        { status: 422 }
      );
    }

    const png = await renderLayout(layout);

    /* Optional: upload to Vercel Blob if token configured */
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const filename = `translated/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
        const blob = await put(filename, png, {
          access: "public",
          contentType: "image/png",
        });
        return NextResponse.json({
          url: blob.url,
          mode: "blob",
          width: layout.width,
          height: layout.height,
          blockCount: layout.blocks.length,
        });
      } catch (err) {
        console.warn("Blob upload failed, falling back to base64:", err);
      }
    }

    /* Fallback: return inline base64 (works without Blob token) */
    const dataUrl = `data:image/png;base64,${png.toString("base64")}`;
    return NextResponse.json({
      url: dataUrl,
      mode: "inline",
      width: layout.width,
      height: layout.height,
      blockCount: layout.blocks.length,
    });
  } catch (error: unknown) {
    console.error("Translate image error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `翻譯過程中發生錯誤: ${message}` },
      { status: 500 }
    );
  }
}
