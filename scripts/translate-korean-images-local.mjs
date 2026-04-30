import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import sharp from "sharp";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { GoogleGenAI } from "@google/genai";
import { put } from "@vercel/blob";

const ROOT = process.cwd();
const TASK_FILE = path.join(ROOT, "KOREAN_TRANSLATE_TASK.md");
const SOURCE_DIR = path.join(os.tmpdir(), "dearglow-korean-source");
const OUTPUT_DIR = path.join(os.tmpdir(), "dearglow-translated-local");
const PUBLIC_OUTPUT_DIR = path.join(ROOT, "public", "images", "translated");
const OCR_SCRIPT = path.join(os.tmpdir(), "dearglow-vision-ocr.swift");
const OUTPUT_JSON = path.join(ROOT, "scripts", "korean-translated-output.json");

const HANGUL_RE = /[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/;

function loadDotEnv(file = path.join(ROOT, ".env.local")) {
  if (!fs.existsSync(file)) return;
  for (const rawLine of fs.readFileSync(file, "utf8").split(/\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[match[1]]) process.env[match[1]] = value;
  }
}

function parseSources() {
  const text = fs.readFileSync(TASK_FILE, "utf8");
  let current = null;
  const grouped = {};
  for (const line of text.split(/\n/)) {
    const heading = line.match(/^### (P\d+)/);
    if (heading) {
      current = heading[1];
      grouped[current] = [];
    }
    const url = line.match(/^https:\/\/image\.oliveyoung\.co\.kr\S+/);
    if (url && current) grouped[current].push(url[0]);
  }

  // The task file's first two P001 crop URLs are stale 404s. The same named
  // assets are available from crop0 and keep the requested source order intact.
  grouped.P001[0] = grouped.P001[0].replace("/crop2/", "/crop0/");
  grouped.P001[1] = grouped.P001[1].replace("/crop3/", "/crop0/");

  const items = [];
  for (const [productId, urls] of Object.entries(grouped)) {
    urls.forEach((url, index) => {
      const ext =
        url.match(/\.(png|jpe?g|webp)(?:\?|$)/i)?.[1]?.toLowerCase() ?? "jpg";
      items.push({
        productId,
        index,
        url,
        sourcePath: path.join(
          SOURCE_DIR,
          `${productId}-${index}.${ext === "jpeg" ? "jpg" : ext}`,
        ),
        outputPath: path.join(OUTPUT_DIR, `${productId}-${index}.png`),
      });
    });
  }
  return { grouped, items };
}

async function downloadImage(item) {
  if (fs.existsSync(item.sourcePath) && fs.statSync(item.sourcePath).size > 1000) {
    return;
  }
  const res = await fetch(item.url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/605.1.15",
      referer: "https://www.oliveyoung.co.kr/",
    },
  });
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${item.url}`);
  fs.writeFileSync(item.sourcePath, Buffer.from(await res.arrayBuffer()));
}

async function dimensions(imagePath) {
  const meta = await sharp(imagePath).metadata();
  if (!meta.width || !meta.height) {
    throw new Error(`Could not read dimensions: ${imagePath}`);
  }
  return { width: meta.width, height: meta.height };
}

function ensureVisionScript() {
  fs.writeFileSync(
    OCR_SCRIPT,
    `import Foundation
import Vision
import AppKit

let path = CommandLine.arguments[1]
let url = URL(fileURLWithPath: path)
guard let image = NSImage(contentsOf: url),
      let tiff = image.tiffRepresentation,
      let bitmap = NSBitmapImageRep(data: tiff),
      let cgImage = bitmap.cgImage else {
  fputs("{\\"error\\":\\"image load failed\\"}", stderr)
  exit(2)
}

var rows: [[String: Any]] = []
let request = VNRecognizeTextRequest { request, error in
  if let error = error {
    rows.append(["error": error.localizedDescription])
    return
  }
  let observations = request.results as? [VNRecognizedTextObservation] ?? []
  let width = CGFloat(cgImage.width)
  let height = CGFloat(cgImage.height)
  for obs in observations {
    guard let top = obs.topCandidates(1).first else { continue }
    let b = obs.boundingBox
    rows.append([
      "text": top.string,
      "confidence": top.confidence,
      "x": b.minX * width,
      "y": (1 - b.maxY) * height,
      "width": b.width * width,
      "height": b.height * height
    ])
  }
}
request.recognitionLevel = .accurate
request.usesLanguageCorrection = true
request.recognitionLanguages = ["ko-KR", "en-US"]
let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
try handler.perform([request])
let data = try JSONSerialization.data(withJSONObject: rows, options: [])
FileHandle.standardOutput.write(data)
`,
  );
}

function runVisionOcr(imagePath) {
  ensureVisionScript();
  const result = spawnSync("swift", [OCR_SCRIPT, imagePath], {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(`Vision OCR failed: ${result.stderr || result.stdout}`);
  }
  const rows = JSON.parse(result.stdout);
  return rows
    .filter((r) => r.text && HANGUL_RE.test(r.text))
    .map((r) => ({
      text: String(r.text),
      x: Math.max(0, Number(r.x)),
      y: Math.max(0, Number(r.y)),
      width: Math.max(1, Number(r.width)),
      height: Math.max(1, Number(r.height)),
      confidence: Number(r.confidence ?? 0),
    }))
    .sort((a, b) => a.y - b.y || a.x - b.x);
}

function overlap(a, b) {
  const left = Math.max(a.x, b.x);
  const right = Math.min(a.x + a.width, b.x + b.width);
  return Math.max(0, right - left);
}

function unionBox(lines) {
  const x = Math.min(...lines.map((l) => l.x));
  const y = Math.min(...lines.map((l) => l.y));
  const right = Math.max(...lines.map((l) => l.x + l.width));
  const bottom = Math.max(...lines.map((l) => l.y + l.height));
  return { x, y, width: right - x, height: bottom - y };
}

function groupLines(lines, imageWidth) {
  const groups = [];
  for (const line of lines) {
    const prev = groups.at(-1);
    if (!prev) {
      groups.push([line]);
      continue;
    }
    const box = unionBox(prev);
    const gap = line.y - (box.y + box.height);
    const avgH =
      prev.reduce((sum, item) => sum + item.height, line.height) /
      (prev.length + 1);
    const horizontalOverlap = overlap(box, line);
    const centersNear =
      Math.abs(box.x + box.width / 2 - (line.x + line.width / 2)) <
      imageWidth * 0.28;
    const related =
      gap > -avgH * 0.75 &&
      gap < Math.max(22, avgH * 1.15) &&
      (horizontalOverlap > Math.min(box.width, line.width) * 0.08 ||
        centersNear);
    if (related && prev.length < 5) prev.push(line);
    else groups.push([line]);
  }
  return groups.map((lines, id) => ({ id, source: lines.map((l) => l.text).join("\n"), lines }));
}

function cleanJson(text) {
  return text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
}

function createGeminiClient() {
  const apiKey = process.env.VERTEX_API_KEY ?? process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing VERTEX_API_KEY or GOOGLE_GEMINI_API_KEY");
  return new GoogleGenAI(
    process.env.VERTEX_API_KEY ? { vertexai: true, apiKey } : { apiKey },
  );
}

async function translateGroups(ai, groups) {
  if (groups.length === 0) return new Map();
  const prompt = `Translate Korean beauty e-commerce image text to natural Traditional Chinese for Hong Kong customers.

Return strict JSON only:
{"translations":[{"id":0,"text":"繁體中文"}]}

Rules:
- Use conversational Hong Kong wording for marketing copy.
- Use formal Traditional Chinese for technical/ingredient/clinical claims.
- Preserve Latin brand names, symbols, punctuation, percentages, ml/g/ppm/SPF/PA and all numbers exactly.
- Keep each translation concise enough to fit the original image area.
- Use no Korean characters in the output.
- If the source has multiple lines, return the same number of lines separated with \\n whenever possible, distributing the full meaning across those lines.
- Do not exceed the source line count for each id unless unavoidable.

Source groups:
${JSON.stringify(groups.map((g) => ({ id: g.id, text: g.source })))}`
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL_FLASH ?? "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                attempt === 0
                  ? prompt
                  : `${prompt}\n\nPrevious response was not valid JSON. Return valid minified JSON only.`,
            },
          ],
        },
      ],
      config: { responseMimeType: "application/json" },
    });
    const raw = cleanJson(response.text ?? "{}");
    try {
      const parsed = JSON.parse(raw);
      return new Map(
        (parsed.translations ?? []).map((item) => [
          Number(item.id),
          String(item.text),
        ]),
      );
    } catch {
      if (attempt === 2) {
        throw new Error(`Translation JSON parse failed: ${raw.slice(0, 500)}`);
      }
    }
  }
  return new Map();
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

async function sampleRegion(imagePath, rect) {
  const meta = await sharp(imagePath).metadata();
  const width = meta.width ?? 1;
  const height = meta.height ?? 1;
  const left = clamp(Math.round(rect.x), 0, width - 1);
  const top = clamp(Math.round(rect.y), 0, height - 1);
  const w = clamp(Math.round(rect.width), 1, width - left);
  const h = clamp(Math.round(rect.height), 1, height - top);
  const { data, info } = await sharp(imagePath)
    .extract({ left, top, width: w, height: h })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const border = [];
  const channels = info.channels;
  const push = (px) => {
    const i = px * channels;
    border.push([data[i], data[i + 1], data[i + 2]]);
  };
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (x < 3 || y < 3 || x >= info.width - 3 || y >= info.height - 3) {
        push(y * info.width + x);
      }
    }
  }
  const avg = border.reduce(
    (acc, rgb) => [acc[0] + rgb[0], acc[1] + rgb[1], acc[2] + rgb[2]],
    [0, 0, 0],
  );
  const count = Math.max(1, border.length);
  const rgb = avg.map((v) => Math.round(v / count));
  const lum = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114;
  const spread = Math.max(...rgb) - Math.min(...rgb);
  if (lum > 205 && spread < 38) return [255, 255, 255];
  return rgb;
}

async function estimateColors(imagePath, bbox, coverRect) {
  const bg = await sampleRegion(imagePath, coverRect);
  const meta = await sharp(imagePath).metadata();
  const width = meta.width ?? 1;
  const height = meta.height ?? 1;
  const left = clamp(Math.floor(bbox.x), 0, width - 1);
  const top = clamp(Math.floor(bbox.y), 0, height - 1);
  const w = clamp(Math.ceil(bbox.width), 1, width - left);
  const h = clamp(Math.ceil(bbox.height), 1, height - top);
  const { data, info } = await sharp(imagePath)
    .extract({ left, top, width: w, height: h })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const channels = info.channels;
  const fgPixels = [];
  for (let i = 0; i < data.length; i += channels) {
    const rgb = [data[i], data[i + 1], data[i + 2]];
    const dist = Math.hypot(rgb[0] - bg[0], rgb[1] - bg[1], rgb[2] - bg[2]);
    if (dist > 70) fgPixels.push(rgb);
  }
  let fg;
  if (fgPixels.length) {
    const avg = fgPixels.reduce(
      (acc, rgb) => [acc[0] + rgb[0], acc[1] + rgb[1], acc[2] + rgb[2]],
      [0, 0, 0],
    );
    fg = avg.map((v) => Math.round(v / fgPixels.length));
  } else {
    const lum = bg[0] * 0.299 + bg[1] * 0.587 + bg[2] * 0.114;
    fg = lum < 120 ? [255, 255, 255] : [25, 25, 25];
  }
  return {
    background: `rgb(${bg[0]},${bg[1]},${bg[2]})`,
    color: `rgb(${fg[0]},${fg[1]},${fg[2]})`,
  };
}

function fitText(text, boxWidth, boxHeight, sourceFontSize) {
  let lines = text.split(/\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length === 0) lines = [text.trim()];
  let fontSize = clamp(Math.round(sourceFontSize), 9, 76);
  const lineHeight = 1.22;

  const estimatedLineWidth = (line, size) => {
    let units = 0;
    for (const ch of line) units += /[ -~]/.test(ch) ? 0.55 : 0.98;
    return units * size;
  };

  while (
    fontSize > 8 &&
    (lines.length * fontSize * lineHeight > boxHeight ||
      Math.max(...lines.map((line) => estimatedLineWidth(line, fontSize))) >
        boxWidth)
  ) {
    fontSize -= 1;
  }
  return { text: lines.join("\n"), fontSize };
}

async function renderOverlay(imagePath, dims, translatedGroups, residualLines = []) {
  const regularFont = fs.readFileSync(path.join(ROOT, "public/fonts/NotoSansTC-Regular.otf"));
  // Satori's bundled opentype parser accepts OTF/TTF here; the repo only has
  // a regular OTF locally, so weight is expressed through size/placement.
  const boldFont = regularFont;
  const children = [];

  for (const item of translatedGroups) {
    const bbox = unionBox(item.lines);
    const sourceFontSize =
      item.lines.reduce((sum, line) => sum + line.height, 0) / item.lines.length * 1.05;
    const padX = clamp(sourceFontSize * 0.55, 8, 32);
    const padY = clamp(sourceFontSize * 0.45, 6, 26);
    const cover = {
      x: clamp(bbox.x - padX, 0, dims.width),
      y: clamp(bbox.y - padY, 0, dims.height),
      width: clamp(bbox.width + padX * 2, 1, dims.width - Math.max(0, bbox.x - padX)),
      height: clamp(bbox.height + padY * 2, 1, dims.height - Math.max(0, bbox.y - padY)),
    };
    const colors = await estimateColors(imagePath, bbox, cover);
    const fitted = fitText(item.translation, cover.width - 8, cover.height - 4, sourceFontSize);
    const centerX = cover.x + cover.width / 2;
    const align =
      cover.width > dims.width * 0.22 || Math.abs(centerX - dims.width / 2) < dims.width * 0.2
        ? "center"
        : "left";
    const key = `g${item.id}`;
    children.push({
      key: `${key}-bg`,
      type: "div",
      props: {
        style: {
          position: "absolute",
          left: cover.x,
          top: cover.y,
          width: cover.width,
          height: cover.height,
          backgroundColor: colors.background,
          borderRadius: Math.min(18, Math.round(sourceFontSize * 0.35)),
        },
      },
    });
    children.push({
      key: `${key}-text`,
      type: "div",
      props: {
        style: {
          position: "absolute",
          left: cover.x + 4,
          top: cover.y + 2,
          width: cover.width - 8,
          height: cover.height - 4,
          display: "flex",
          alignItems: "center",
          justifyContent: align === "center" ? "center" : "flex-start",
          textAlign: align,
          color: colors.color,
          fontFamily: "NotoTC",
          fontSize: fitted.fontSize,
          fontWeight: sourceFontSize >= 22 ? 700 : 400,
          lineHeight: 1.22,
          whiteSpace: "pre-wrap",
        },
        children: fitted.text,
      },
    });
  }

  for (const [i, line] of residualLines.entries()) {
    const pad = Math.max(8, line.height * 0.35);
    const cover = {
      x: clamp(line.x - pad, 0, dims.width),
      y: clamp(line.y - pad, 0, dims.height),
      width: clamp(line.width + pad * 2, 1, dims.width - Math.max(0, line.x - pad)),
      height: clamp(line.height + pad * 2, 1, dims.height - Math.max(0, line.y - pad)),
    };
    const bg = (await estimateColors(imagePath, line, cover)).background;
    children.push({
      key: `residual-${i}`,
      type: "div",
      props: {
        style: {
          position: "absolute",
          left: cover.x,
          top: cover.y,
          width: cover.width,
          height: cover.height,
          backgroundColor: bg,
          borderRadius: Math.min(14, Math.round(line.height * 0.35)),
        },
      },
    });
  }

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          position: "relative",
          width: dims.width,
          height: dims.height,
          backgroundColor: "rgba(255,255,255,0)",
        },
        children,
      },
    },
    {
      width: dims.width,
      height: dims.height,
      fonts: [
        { name: "NotoTC", data: regularFont, weight: 400, style: "normal" },
        { name: "NotoTC", data: boldFont, weight: 700, style: "normal" },
      ],
    },
  );
  return new Resvg(svg, { fitTo: { mode: "width", value: dims.width } }).render().asPng();
}

async function composeImage(item, translatedGroups) {
  const dims = await dimensions(item.sourcePath);
  let overlay = await renderOverlay(item.sourcePath, dims, translatedGroups);
  await sharp(item.sourcePath).composite([{ input: overlay, left: 0, top: 0 }]).png().toFile(item.outputPath);

  // OCR verification pass: cover any residual Korean Vision can still see.
  for (let pass = 0; pass < 2; pass += 1) {
    const residual = runVisionOcr(item.outputPath);
    if (residual.length === 0) return { ...dims, residual: 0 };
    overlay = await renderOverlay(item.sourcePath, dims, translatedGroups, residual);
    const nextPath = `${item.outputPath}.tmp-${pass}.png`;
    await sharp(item.outputPath)
      .composite([{ input: overlay, left: 0, top: 0 }])
      .png()
      .toFile(nextPath);
    fs.renameSync(nextPath, item.outputPath);
  }
  return { ...dims, residual: runVisionOcr(item.outputPath).length };
}

async function uploadImage(item) {
  const blob = await put(
    `translated/${item.productId}-${item.index}.png`,
    fs.readFileSync(item.outputPath),
    {
      access: "public",
      contentType: "image/png",
      allowOverwrite: true,
    },
  );
  return blob.url;
}

async function main() {
  loadDotEnv();
  fs.mkdirSync(SOURCE_DIR, { recursive: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const localPublic = process.argv.includes("--local-public");
  const resume = process.argv.includes("--resume");
  const shouldUpload = !process.argv.includes("--no-upload") && !localPublic;
  if (localPublic) fs.mkdirSync(PUBLIC_OUTPUT_DIR, { recursive: true });
  if (shouldUpload && !process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN for Vercel Blob upload");
  }

  const ai = createGeminiClient();
  const { items: allItems } = parseSources();
  const onlyArg = process.argv.find((arg) => arg.startsWith("--only="));
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const only = onlyArg?.slice("--only=".length);
  const limit = limitArg ? Number(limitArg.slice("--limit=".length)) : null;
  const items = allItems
    .filter((item) => !only || `${item.productId}-${item.index}` === only)
    .slice(0, limit ?? undefined);
  const output = {};

  for (const item of items) {
    const label = `${item.productId}-${item.index}`;
    const publicFilename = `${item.productId}-${item.index}.png`;
    const publicPath = path.join(PUBLIC_OUTPUT_DIR, publicFilename);
    if (localPublic && resume && fs.existsSync(publicPath)) {
      if (!output[item.productId]) output[item.productId] = [];
      output[item.productId][item.index] = `/images/translated/${publicFilename}`;
      console.log(`${label}: resume existing`);
      continue;
    }
    await downloadImage(item);
    const dims = await dimensions(item.sourcePath);
    const ocrLines = runVisionOcr(item.sourcePath);
    const groups = groupLines(ocrLines, dims.width);
    const translations = await translateGroups(ai, groups);
    const translatedGroups = groups
      .map((group) => ({
        ...group,
        translation: translations.get(group.id) ?? "",
      }))
      .filter((group) => group.translation && !HANGUL_RE.test(group.translation));

    const result = await composeImage(item, translatedGroups);
    let url;
    if (shouldUpload) {
      url = await uploadImage(item);
    } else if (localPublic) {
      fs.copyFileSync(item.outputPath, publicPath);
      url = `/images/translated/${publicFilename}`;
    } else {
      url = item.outputPath;
    }
    if (!output[item.productId]) output[item.productId] = [];
    output[item.productId][item.index] = url;

    console.log(
      `${label}: ${ocrLines.length} OCR lines, ${translatedGroups.length} translated groups, residual Korean ${result.residual}, ${dims.width}x${dims.height}`,
    );
  }

  fs.writeFileSync(OUTPUT_JSON, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote ${OUTPUT_JSON}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
