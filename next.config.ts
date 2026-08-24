import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Aster now sells five operating systems instead of the three bundled
      // products (Foundation/Automation/Intelligence). Old bundled slugs
      // redirect forward to their closest new-model equivalent, shipped in
      // the same deploy as the products.ts expansion so nothing 404s.
      { source: "/product/aster-foundation", destination: "/products", permanent: true },
      { source: "/product/aster-automation", destination: "/product/operations-os", permanent: true },
      { source: "/product/aster-intelligence", destination: "/product/growth-os", permanent: true },
      // The Fulô build is now presented as the CommerceOS showcase on the
      // homepage, not a standalone client case study page.
      { source: "/case-studies/fulo", destination: "/#showcase", permanent: true },
    ];
  },
};

export default nextConfig;
