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
      // The Fulô build is now presented as a Design Inspirations reference on the
      // homepage, not a standalone client case study page.
      { source: "/case-studies/fulo", destination: "/#design-inspirations", permanent: true },
    ];
  },
};

export default nextConfig;
