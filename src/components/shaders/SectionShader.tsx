"use client";

import { useEffect, useState } from "react";
import { Shader, Swirl, FilmGrain } from "shaders/react";

interface SectionShaderProps {
  className?: string;
  variant?: "warm" | "cool" | "gold";
}

const variants = {
  warm: { colorA: "#C17C6A", colorB: "#B8A88A" },
  cool: { colorA: "#7A9E8E", colorB: "#B8A88A" },
  gold: { colorA: "#B8A88A", colorB: "#C17C6A" },
};

export default function SectionShader({
  className = "",
  variant = "warm",
}: SectionShaderProps) {
  const [mounted, setMounted] = useState(false);
  const colors = variants[variant];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Shader className={`pointer-events-none ${className}`} style={{ width: "100%", height: "100%" }}>
      <Swirl
        colorA={colors.colorA}
        colorB={colors.colorB}
        detail={0.4}
        opacity={0.06}
      />
      <FilmGrain opacity={0.04} />
    </Shader>
  );
}
