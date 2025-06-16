import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "github.githubassets.com",
      "assets.vercel.com",
      "supabase.com"
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
