import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/product/website-os", destination: "/product/aster-foundation", permanent: true },
      { source: "/product/commerce-os", destination: "/product/aster-foundation", permanent: true },
      { source: "/product/launch-os", destination: "/product/aster-foundation", permanent: true },
      { source: "/product/growth-os", destination: "/product/aster-automation", permanent: true },
      { source: "/product/operations-os", destination: "/product/aster-automation", permanent: true },
    ];
  },
};

export default nextConfig;
