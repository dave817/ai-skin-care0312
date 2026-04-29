"use client";

import { useState, useEffect, useRef, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Send, Sparkles, ShoppingBag, Trash2, RotateCcw, X } from "lucide-react";
import { allProducts, type Product } from "@/data/products";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const STORAGE_KEY = "dgb-chat-history";
const MAX_HISTORY = 30;

const GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "你好呀！我係 Dear Glow Beauty 嘅 AI 美妝顧問 Glow ✨\n\n有咩護膚或彩妝煩惱想傾偈？例如「我係油性肌想搵控油精華」、「想揀返一支保濕乳液」、「黑眼圈好嚴重點算」⋯⋯ 我可以幫你揀返啱嘅產品！",
  timestamp: Date.now(),
};

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

function loadHistory(): ChatMessage[] {
  if (typeof window === "undefined") return [GREETING];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [GREETING];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [GREETING];
    return parsed.slice(-MAX_HISTORY);
  } catch {
    return [GREETING];
  }
}

function saveHistory(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(messages.slice(-MAX_HISTORY))
    );
  } catch {
    /* quota — silently drop */
  }
}

function findProduct(id: string): Product | null {
  const p = allProducts.find((p) => p.id === id);
  return p && p.active ? p : null;
}

function ProductChip({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="rounded-xl border border-border bg-white p-2.5 flex gap-2.5 items-center">
      <Link
        href={`/store/${product.slug}`}
        className="relative w-14 h-14 rounded-lg overflow-hidden bg-bg-secondary flex-shrink-0"
      >
        <Image
          src={product.imageUrl}
          alt={product.imageAlt}
          fill
          className="object-cover"
          sizes="56px"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-text-muted uppercase tracking-wider">
          {product.brand}
        </p>
        <Link
          href={`/store/${product.slug}`}
          className="block text-xs font-medium text-text-primary line-clamp-2 hover:text-accent-blue"
        >
          {product.nameZh}
        </Link>
        <div className="flex items-center justify-between mt-1">
          <span className="font-mono text-xs font-bold text-text-primary">
            {formatPrice(product.priceSale ?? product.priceOriginal)}
          </span>
          <button
            onClick={handleAdd}
            className={`text-[10px] px-2 py-1 rounded-full font-semibold transition-colors ${
              added
                ? "bg-green-500 text-white"
                : "bg-[var(--accent-blue,#4A9FE5)] text-white hover:opacity-90"
            }`}
          >
            {added ? "已加入" : "加入購物車"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  /* Per-call regex to avoid module-level state across React renders */
  const productTokenRegex = /\[\[(P\d{3,})\]\]/g;
  const segments: { type: "text" | "product"; value: string }[] = [];
  let lastIndex = 0;
  for (const match of content.matchAll(productTokenRegex)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      segments.push({ type: "text", value: content.slice(lastIndex, start) });
    }
    segments.push({ type: "product", value: match[1] });
    lastIndex = start + match[0].length;
  }
  if (lastIndex < content.length) {
    segments.push({ type: "text", value: content.slice(lastIndex) });
  }

  const products: Product[] = [];
  const seen = new Set<string>();
  for (const seg of segments) {
    if (seg.type === "product" && !seen.has(seg.value)) {
      const p = findProduct(seg.value);
      if (p) {
        products.push(p);
        seen.add(seg.value);
      }
    }
  }

  const cleanText = segments
    .filter((s) => s.type === "text")
    .map((s) => s.value)
    .join("")
    .trim();

  return (
    <div className="space-y-2.5">
      {cleanText && (
        <p className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
          {cleanText}
        </p>
      )}
      {products.length > 0 && (
        <div className="space-y-2">
          {products.map((p) => (
            <ProductChip key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChatDrawer({ open, onClose }: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const headingId = useId();

  useEffect(() => {
    setMessages(loadHistory());
  }, []);

  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [open, messages.length]);

  /* Focus management: when drawer opens, save current focus, move into drawer.
     When it closes, restore previous focus. Esc closes. */
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    /* Defer focus to next frame so the drawer is mounted */
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  const handleClear = useCallback(() => {
    if (abortRef.current) abortRef.current.abort();
    setMessages([GREETING]);
    setStreaming(false);
  }, []);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || streaming) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };
    const assistantMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg, assistantMsg];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    const apiMessages = newMessages
      .filter((m) => m.id !== "greeting")
      .filter((m, i, arr) => !(m.role === "assistant" && i === arr.length - 1))
      .map((m) => ({ role: m.role, content: m.content }));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id ? { ...m, content: accumulated } : m
          )
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const errorMessage =
        err instanceof Error ? err.message : "AI 暫時無法回應";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, content: `⚠️ 出錯：${errorMessage}` }
            : m
        )
      );
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [input, streaming, messages]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-[55]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-[58] w-full md:w-[420px] bg-white shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border flex items-center gap-3 bg-gradient-to-br from-[#FDF6F1] to-white">
              <div className="w-10 h-10 rounded-full bg-[var(--accent-rose,#C17C6A)] flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 id={headingId} className="text-base font-bold text-text-primary">
                  Glow · AI 美妝顧問
                </h2>
                <p className="text-[11px] text-text-muted">
                  即時推薦適合你嘅韓國美妝
                </p>
              </div>
              <button
                onClick={handleClear}
                className="text-text-muted hover:text-text-primary p-2 rounded-lg hover:bg-bg-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-rose"
                aria-label="清空對話"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                ref={closeBtnRef}
                onClick={onClose}
                className="text-text-muted hover:text-text-primary p-2 rounded-lg hover:bg-bg-secondary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-rose"
                aria-label="關閉對話視窗"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions text"
              aria-label="對話內容"
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-bg-secondary/30"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 ${
                      msg.role === "user"
                        ? "bg-[var(--accent-blue,#4A9FE5)] text-white rounded-br-sm"
                        : "bg-white border border-border rounded-bl-sm"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {msg.content}
                      </p>
                    ) : msg.content === "" && streaming ? (
                      <div className="flex items-center gap-1 py-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-text-muted"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <MessageContent content={msg.content} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Suggestions (when only greeting) */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {[
                  "我係油性肌，想搵控油精華",
                  "想揀保濕面霜",
                  "黑眼圈好嚴重點算？",
                  "推薦韓國熱賣",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="text-[11px] px-3 py-1.5 rounded-full bg-white border border-border text-text-secondary hover:border-accent-blue hover:text-accent-blue transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="px-4 py-3 border-t border-border bg-white"
            >
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="想知咩護膚煩惱？同 Glow 講啦…"
                  rows={1}
                  disabled={streaming}
                  className="flex-1 resize-none rounded-xl border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--accent-blue,#4A9FE5)] bg-bg-secondary/40 max-h-[120px]"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || streaming}
                  aria-label="發送訊息"
                  className="w-10 h-10 rounded-full bg-[var(--accent-blue,#4A9FE5)] text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  {streaming ? (
                    <RotateCcw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-text-muted mt-1.5 text-center">
                <ShoppingBag className="w-3 h-3 inline mr-1" />
                AI 推薦只供參考，購買前請先了解產品成分
              </p>
            </form>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
