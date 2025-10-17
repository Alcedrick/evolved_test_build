import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "clear-trout-359.convex.cloud", // 👈 your Convex storage domain
      },
    ],
  },
};

export default nextConfig;
