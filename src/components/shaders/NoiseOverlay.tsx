"use client";

import { useEffect, useState } from "react";
import { Shader, FilmGrain } from "shaders/react";

export default function NoiseOverlay() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Shader
      className="fixed inset-0 pointer-events-none z-[2]"
      style={{ width: "100vw", height: "100vh", mixBlendMode: "multiply" }}
    >
      <FilmGrain opacity={0.035} />
    </Shader>
  );
}
