"use client";

import { useEffect, useState } from "react";
import { Shader, Aurora, FilmGrain, Swirl } from "shaders/react";

export default function HeroShader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // CSS fallback while shader loads — prevents layout shift
    return (
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 70% at 25% 60%, rgba(193,124,106,0.18) 0%, transparent 55%),
            radial-gradient(ellipse 70% 80% at 75% 25%, rgba(184,168,138,0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 60% at 55% 80%, rgba(122,158,142,0.12) 0%, transparent 45%),
            linear-gradient(155deg, #F5F0EB 0%, #EDE7DF 50%, #F0EBE4 100%)
          `,
        }}
      />
    );
  }

  return (
    <Shader
      className="absolute inset-0"
      style={{ width: "100%", height: "100%" }}
    >
      <Aurora
        colorA="#C17C6A"
        colorB="#B8A88A"
        colorC="#7A9E8E"
        speed={1.5}
        intensity={60}
        waviness={40}
        rayDensity={15}
        height={140}
        curtainCount={3}
        center={{ x: 0.5, y: 0.3 }}
        opacity={0.35}
      />
      <FilmGrain opacity={0.08} />
    </Shader>
  );
}
