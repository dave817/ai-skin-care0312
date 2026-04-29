import { NextRequest } from "next/server";
import { getVertexClient, MODEL_FLASH } from "@/lib/ai/vertex-client";
import { getProductCatalog } from "@/lib/ai/product-catalog-prompt";
import { checkChatLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

const SYSTEM_PROMPT_TEMPLATE = `你係 Dear Glow Beauty（網店：日韓化妝品護膚品專門店）嘅 AI 美妝顧問助手，名叫 Glow。
請用繁體中文 + 廣東話語氣（自然、親切、唔太正式）回答客人查詢。

## 你可以幫客人：
- 推薦適合佢哋膚質/煩惱嘅韓國護膚同彩妝產品
- 解答產品成分、用法、配搭問題
- 解釋護膚程序（早晚 routine）
- 介紹品牌或熱賣商品
- 處理訂單/送貨/退換政策查詢（簡單回答，複雜嘅叫客人聯絡客服）

## 推薦產品方法（重要）：
- 推薦產品時，**必須**用呢個格式喺句子中嵌入產品 ID：[[P001]]、[[P012]] 等等
- 系統會自動將 [[P001]] 換成靚嘅產品卡片畀客人睇
- 一次最多推薦 3 件產品
- 只可以揀以下產品清單入面嘅 ID，不可以憑空創造

## 風格要求：
- 答覆要簡短精煉（一般 1-3 段，每段 2-4 句）
- 唔好用 markdown 格式（無 ##, **, - 等）
- 要 friendly 同親切，可以用 emoji（適量）
- 唔識答嘅就坦白話唔識，叫客人聯絡客服

## 可用產品清單（只能揀以下 ID 推薦）：
{{CATALOG}}
`;

async function getSystemPrompt(): Promise<string> {
  const { promptString } = await getProductCatalog();
  return SYSTEM_PROMPT_TEMPLATE.replace("{{CATALOG}}", promptString);
}

function isValidMessage(m: unknown): m is ChatMessage {
  if (typeof m !== "object" || m === null) return false;
  const obj = m as Record<string, unknown>;
  return (
    (obj.role === "user" || obj.role === "assistant") &&
    typeof obj.content === "string" &&
    obj.content.length > 0 &&
    obj.content.length <= 4000
  );
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = await checkChatLimit(ip);
    if (!limit.success) {
      return new Response(
        JSON.stringify({ error: "聊天次數過多，請稍後再試" }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    const body = await request.json().catch(() => null);
    const rawMessages = body?.messages;
    if (!Array.isArray(rawMessages)) {
      return new Response(JSON.stringify({ error: "Missing messages array" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const messages = rawMessages.filter(isValidMessage).slice(-20);
    if (messages.length === 0) {
      return new Response(JSON.stringify({ error: "No valid messages" }), {
        status: 400,
      });
    }

    const ai = getVertexClient();

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const systemInstruction = await getSystemPrompt();
    const result = await ai.models.generateContentStream({
      model: MODEL_FLASH,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result) {
            const text = chunk.text ?? "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          console.error("Chat stream error:", err);
          controller.enqueue(
            encoder.encode("\n\n（不好意思，AI 暫時忙緊，請稍後再試）")
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
