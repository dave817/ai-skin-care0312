"use client";

import { cn } from "@/lib/utils";

interface MarqueeBannerProps {
  items: string[];
  className?: string;
  separator?: string;
  speed?: number;
}

export default function MarqueeBanner({
  items,
  className = "",
  separator = "✦",
  speed = 30,
}: MarqueeBannerProps) {
  const content = items.join(` ${separator} `) + ` ${separator} `;

  return (
    <div
      className={cn(
        "overflow-hidden whitespace-nowrap select-none",
        className
      )}
    >
      <div
        className="inline-flex animate-marquee"
        style={
          {
            "--marquee-speed": `${speed}s`,
          } as React.CSSProperties
        }
      >
        <span className="inline-block pr-4">{content}</span>
        <span className="inline-block pr-4">{content}</span>
        <span className="inline-block pr-4">{content}</span>
      </div>
    </div>
  );
}
