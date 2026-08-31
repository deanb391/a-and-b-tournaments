import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "psuumxbmqtjuepxvbyeh.supabase.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
    ],
  },
  allowedDevOrigins: ["3f27-105-116-13-47.ngrok-free.app", "localhost:3000"],
};

export default nextConfig;
