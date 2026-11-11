import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/products", destination: "/services", permanent: true },
      { source: "/product/:slug", destination: "/services", permanent: true },
      { source: "/case-studies", destination: "/portfolio", permanent: true },
      { source: "/case-studies/:slug", destination: "/portfolio", permanent: true },
    ];
  },
};

export default nextConfig;
