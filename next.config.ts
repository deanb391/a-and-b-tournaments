import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "psuumxbmqtjuepxvbyeh.supabase.co",
      },
    ],
  },
};

export default nextConfig;
