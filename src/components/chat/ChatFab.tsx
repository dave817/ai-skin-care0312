"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import dynamic from "next/dynamic";

const ChatDrawer = dynamic(() => import("./ChatDrawer"), { ssr: false });

export default function ChatFab() {
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem("dgb-chat-greeted") === "1") {
      setHasUnread(false);
    }
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setHasUnread(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("dgb-chat-greeted", "1");
    }
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={open ? () => setOpen(false) : handleOpen}
        aria-label={open ? "關閉 AI 美妝顧問" : "打開 AI 美妝顧問"}
        className="fixed bottom-5 right-5 z-[60] w-14 h-14 rounded-full bg-[var(--accent-rose,#C17C6A)] text-white shadow-[0_8px_24px_rgba(193,124,106,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && hasUnread && (
          <motion.span
            className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 ring-2 ring-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          />
        )}
      </motion.button>

      <ChatDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
