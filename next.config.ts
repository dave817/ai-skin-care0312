import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Native binaries that should not be bundled by webpack */
  serverExternalPackages: ["@resvg/resvg-js", "satori"],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "www.ohmyglow.co" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "image.oliveyoung.co.kr" },
      { protocol: "https", hostname: "static.oliveyoung.co.kr" },
      { protocol: "https", hostname: "img1.oliveyoung.co.kr" },
    ],
  },
};

export default nextConfig;
