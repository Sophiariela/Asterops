/**
 * Pré-renderização das rotas públicas, depois do `vite build`.
 *
 *   node scripts/prerender.mjs
 *
 * Por que existe: o site é uma SPA em Vite, então o HTML que chega ao
 * crawler é só `<div id="root"></div>`. Em vez de trocar o framework — o
 * que o briefing proíbe fazer em silêncio — o build serve o `dist`, abre
 * cada rota pública num Chrome headless, espera o React renderizar e grava
 * o HTML resultante como arquivo estático.
 *
 * Resultado: /portfolio passa a ser dist/portfolio/index.html com o
 * conteúdo já dentro, e a Vercel entrega esse arquivo antes de cair no
 * rewrite para index.html (o filesystem é checado primeiro). O React
 * hidrata por cima normalmente.
 *
 * Limite conhecido, registrado de propósito: isto é snapshot de build, não
 * SSR. Conteúdo que depende de API em tempo de request (preço vindo do
 * backend, por exemplo) aparece no HTML com o estado do momento do build.
 * Para esses trechos o valor correto chega depois da hidratação.
 *
 * Também gera sitemap.xml e robots.txt a partir da mesma lista de rotas,
 * para os três nunca saírem de sincronia.
 */
import { launchBrowser } from './launch-browser.mjs';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { PUBLIC_ROUTES, DISALLOWED_PATHS } from './public-routes.mjs';

const DIST = path.join(process.cwd(), 'dist');
const SITE_URL = process.env.SITE_URL || 'https://asterops-lime.vercel.app';
const PORT = 4178;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

/** Servidor estático mínimo com fallback de SPA, só para o prerender. */
function serveDist() {
  return createServer(async (req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    let file = path.join(DIST, url);
    // Cai para o shell da SPA quando o caminho não existe, termina em "/" ou
    // é um diretório. Esse último caso é real: /portfolio é rota E é a pasta
    // public/portfolio dos screenshots, então sem o teste de diretório o
    // servidor tentaria ler uma pasta e devolveria 404.
    const isDir = existsSync(file) && statSync(file).isDirectory();
    if (!existsSync(file) || isDir || url.endsWith('/')) file = path.join(DIST, 'index.html');
    try {
      const body = await readFile(file);
      res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
      res.end(body);
    } catch {
      res.statusCode = 404;
      res.end('not found');
    }
  });
}

function sitemap(routes) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .map(
      (r) =>
        `  <url>\n    <loc>${SITE_URL}${r.path === '/' ? '/' : r.path}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${r.changefreq}</changefreq>\n` +
        `    <priority>${r.priority}</priority>\n  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function robots() {
  const disallow = DISALLOWED_PATHS.map((p) => `Disallow: ${p}`).join('\n');
  return `User-agent: *\nAllow: /\n${disallow}\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

const server = serveDist();
await new Promise((resolve) => server.listen(PORT, resolve));

const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

let ok = 0;
const failed = [];

for (const route of PUBLIC_ROUTES) {
  try {
    await page.goto(`http://localhost:${PORT}${route.path}`, {
      waitUntil: 'networkidle',
      timeout: 45_000,
    });
    // Espera o React ter montado conteúdo de verdade dentro do #root.
    await page.waitForFunction(
      () => {
        const root = document.getElementById('root');
        return Boolean(root && root.innerText.trim().length > 200);
      },
      { timeout: 20_000 },
    );

    const html = await page.content();

    // Sanidade: HTML sem conteúdo não substitui a página.
    if (!html.includes('<h1') && route.path !== '/') {
      throw new Error('rendered HTML has no <h1>');
    }

    const outDir = route.path === '/' ? DIST : path.join(DIST, route.path);
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, 'index.html'), html, 'utf8');
    const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
    console.log(`  ✓ ${route.path.padEnd(26)} ${kb} kB`);
    ok++;
  } catch (error) {
    console.error(`  ✗ ${route.path} — ${error.message}`);
    failed.push(route.path);
  }
}

await browser.close();
server.close();

await writeFile(path.join(DIST, 'sitemap.xml'), sitemap(PUBLIC_ROUTES), 'utf8');
await writeFile(path.join(DIST, 'robots.txt'), robots(), 'utf8');
console.log(`  ✓ sitemap.xml (${PUBLIC_ROUTES.length} urls) e robots.txt`);

console.log(`\nprerender: ${ok}/${PUBLIC_ROUTES.length} rotas`);
if (failed.length) {
  console.error(`falharam: ${failed.join(', ')}`);
  process.exitCode = 1;
}
