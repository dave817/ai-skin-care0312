"use client";

import { useEffect, useState } from "react";
import { Shader, CursorTrail } from "shaders/react";

export default function CursorEffect() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  // No cursor trail on mobile
  if (!mounted || isMobile) return null;

  return (
    <Shader
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ width: "100vw", height: "100vh" }}
    >
      <CursorTrail opacity={0.12} />
    </Shader>
  );
}
