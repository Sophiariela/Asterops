import type { NextConfig } from "next";

/**
 * Os redirects cobrem duas gerações de URL:
 *   - rotas antigas em inglês (/services, /portfolio, /about, /contact),
 *     que saíram no reposicionamento para pt-BR;
 *   - rotas ainda mais antigas (/products, /case-studies).
 * Mantê-los evita quebrar link já indexado ou compartilhado.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/services", destination: "/solucoes", permanent: true },
      { source: "/portfolio", destination: "/projetos", permanent: true },
      { source: "/portfolio/:slug", destination: "/projetos/:slug", permanent: true },
      { source: "/about", destination: "/sobre", permanent: true },
      { source: "/contact", destination: "/contato", permanent: true },
      { source: "/products", destination: "/solucoes", permanent: true },
      { source: "/product/:slug", destination: "/solucoes", permanent: true },
      { source: "/case-studies", destination: "/projetos", permanent: true },
      { source: "/case-studies/:slug", destination: "/projetos", permanent: true },
    ];
  },
};

export default nextConfig;
