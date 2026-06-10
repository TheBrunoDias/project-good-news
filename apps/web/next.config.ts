import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  transpilePackages: ["@daily-good-news/db"],
  cacheComponents: true
};

export default nextConfig;
