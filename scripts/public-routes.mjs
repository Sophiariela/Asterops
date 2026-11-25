/**
 * Rotas públicas do site — fonte única para prerender, sitemap e robots.
 *
 * Só entra aqui rota que qualquer visitante pode abrir. Rota de conta,
 * checkout, painel e app ficam de fora de propósito: não devem ser
 * indexadas nem pré-renderizadas.
 *
 * Os slugs vêm de src/data/products.ts e src/data/solutions.ts. Se um
 * produto ou solução for adicionado lá, acrescente aqui também — é uma
 * lista curta e explícita justamente para não publicar rota por engano.
 *
 * Título e descrição NÃO vivem aqui: quem define é src/config/route-meta.ts,
 * e o prerender captura o resultado já aplicado no HTML. Assim não há duas
 * cópias do mesmo texto para sair de sincronia.
 */

export const PUBLIC_ROUTES = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'weekly',
  },
  {
    path: '/portfolio',
    priority: '0.9',
    changefreq: 'monthly',
  },
  {
    path: '/plans',
    priority: '0.9',
    changefreq: 'monthly',
  },
  {
    path: '/ecosystem',
    priority: '0.7',
    changefreq: 'monthly',
  },

  /* Produtos — slugs de src/data/products.ts */
  {
    path: '/products/webos',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/products/commerceos',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/products/luna-ai',
    priority: '0.8',
    changefreq: 'monthly',
  },
  {
    path: '/products/launchos',
    priority: '0.5',
    changefreq: 'monthly',
  },
  {
    path: '/products/growthos',
    priority: '0.5',
    changefreq: 'monthly',
  },

  /* Soluções — slugs de src/data/solutions.ts */
  {
    path: '/solutions/website',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/solutions/ecommerce',
    priority: '0.7',
    changefreq: 'monthly',
  },
  {
    path: '/solutions/ai-content',
    priority: '0.7',
    changefreq: 'monthly',
  },
];

/**
 * Rotas que NUNCA devem ser indexadas nem pré-renderizadas.
 *
 * Conta, checkout, onboarding, painel administrativo, app de comércio e
 * site público gerado por cliente (/site/*, que tem SEO próprio e não é
 * conteúdo da ASTER).
 */
export const DISALLOWED_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/checkout',
  '/onboarding',
  '/dashboard',
  '/admin',
  '/commerce',
  '/webos',
  '/site/',
];
