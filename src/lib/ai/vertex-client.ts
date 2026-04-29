import { GoogleGenAI } from "@google/genai";

let cachedClient: GoogleGenAI | null = null;

export function getVertexClient(): GoogleGenAI {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.VERTEX_API_KEY ?? process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing VERTEX_API_KEY (or GOOGLE_GEMINI_API_KEY fallback) — set it in .env.local"
    );
  }

  const isVertex = (process.env.VERTEX_API_KEY ?? "").length > 0;

  cachedClient = new GoogleGenAI(
    isVertex
      ? { vertexai: true, apiKey }
      : { apiKey }
  );

  return cachedClient;
}

export const MODEL_PRO = process.env.GEMINI_MODEL_PRO ?? "gemini-2.5-pro";
export const MODEL_FLASH = process.env.GEMINI_MODEL_FLASH ?? "gemini-2.5-flash";
