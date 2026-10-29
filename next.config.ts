import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home directory makes Next infer the wrong
  // workspace root, which breaks PostCSS/Tailwind resolution. Pin it here.
  turbopack: { root: path.join(__dirname) },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cms.amraj.in" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;
