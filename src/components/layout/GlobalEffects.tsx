"use client";

import dynamic from "next/dynamic";

// Lazy load shader effects so they don't block first paint
const NoiseOverlay = dynamic(() => import("@/components/shaders/NoiseOverlay"), {
  ssr: false,
});

const CursorEffect = dynamic(() => import("@/components/shaders/CursorEffect"), {
  ssr: false,
});

export default function GlobalEffects() {
  return (
    <>
      <NoiseOverlay />
      <CursorEffect />
    </>
  );
}
