import type { NextConfig } from "next";

/**
 * Os redirects cobrem três gerações de URL:
 *   - rotas em pt-BR (/solucoes, /projetos, /sobre, /contato, /como-funciona),
 *     que saíram no reposicionamento para estúdio de produtos digitais;
 *   - rotas antigas em inglês (/services, /portfolio);
 *   - rotas ainda mais antigas (/products, /case-studies).
 * Mantê-los evita quebrar link já indexado ou compartilhado.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Geração pt-BR.
      { source: "/solucoes", destination: "/solutions", permanent: true },
      { source: "/projetos", destination: "/projects", permanent: true },
      { source: "/projetos/:slug", destination: "/projects/:slug", permanent: true },
      { source: "/sobre", destination: "/about", permanent: true },
      { source: "/contato", destination: "/contact", permanent: true },
      { source: "/como-funciona", destination: "/#process", permanent: true },
      // Primeira geração em inglês.
      { source: "/services", destination: "/solutions", permanent: true },
      { source: "/portfolio", destination: "/projects", permanent: true },
      { source: "/portfolio/:slug", destination: "/projects/:slug", permanent: true },
      // Gerações anteriores.
      { source: "/products", destination: "/solutions", permanent: true },
      { source: "/product/:slug", destination: "/solutions", permanent: true },
      { source: "/case-studies", destination: "/projects", permanent: true },
      { source: "/case-studies/:slug", destination: "/projects", permanent: true },
    ];
  },
};

export default nextConfig;
