/**
 * Gera a imagem de Open Graph (1200x630) em public/og/aster-cover.png.
 *
 *   node scripts/generate-og.mjs
 *
 * Usa a identidade que já existe no repositório — a marca do favicon.svg,
 * o wordmark "ASTER." em Sora e os hex exatos de src/index.css. Não cria
 * logo novo e não inclui número, prêmio ou métrica: só o nome, a marca e a
 * mesma promessa que o <title> do site já faz.
 */
import { chromium } from 'playwright';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'public', 'og');
const WIDTH = 1200;
const HEIGHT = 630;

// Hex retirados de src/index.css (@theme) — fonte única da marca.
const BRAND = {
  ink950: '#0d0722',
  ink900: '#150b33',
  aster600: '#5b2ee5',
  aster400: '#9370ff',
  volt400: '#d8ff3e',
  cream: '#faf8ff',
};

const mark = await readFile(path.join(process.cwd(), 'public', 'favicon.svg'), 'utf8');

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${WIDTH}px; height: ${HEIGHT}px;
    background: ${BRAND.ink950};
    font-family: 'Sora', sans-serif;
    color: #fff;
    position: relative;
    overflow: hidden;
  }
  /* Mesmo vocabulário visual do site: halo roxo e um toque de lima. */
  .glow-purple {
    position: absolute; top: -220px; left: -120px;
    width: 760px; height: 620px; border-radius: 9999px;
    background: ${BRAND.aster600}; filter: blur(150px); opacity: .55;
  }
  .glow-volt {
    position: absolute; bottom: -260px; right: -140px;
    width: 560px; height: 520px; border-radius: 9999px;
    background: ${BRAND.volt400}; filter: blur(170px); opacity: .22;
  }
  .grid {
    position: absolute; inset: 0; opacity: .14;
    background-image:
      linear-gradient(to right, rgba(255,255,255,.14) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,.14) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(ellipse 80% 70% at 30% 0%, #000, transparent);
  }
  .content { position: relative; height: 100%; padding: 76px 80px; display: flex; flex-direction: column; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 20px; }
  .brand svg { width: 68px; height: 68px; border-radius: 16px; }
  .wordmark { font-size: 54px; font-weight: 800; letter-spacing: -.03em; line-height: 1; }
  .wordmark .dot { color: ${BRAND.volt400}; }
  h1 {
    font-size: 72px; font-weight: 800; line-height: 1.05; letter-spacing: -.035em;
    max-width: 17ch; color: #fff;
  }
  h1 .accent { color: ${BRAND.aster400}; }
  .foot { display: flex; align-items: center; }
  .tag {
    font-family: 'Inter', sans-serif; font-size: 24px; font-weight: 500;
    color: rgba(255,255,255,.72);
  }
</style>
</head>
<body>
  <div class="glow-purple"></div>
  <div class="glow-volt"></div>
  <div class="grid"></div>
  <div class="content">
    <div class="brand">
      ${mark}
      <span class="wordmark">ASTER<span class="dot">.</span></span>
    </div>
    <h1>Crie o site profissional do seu <span class="accent">negócio</span></h1>
    <div class="foot">
      <span class="tag">Sites · Reservas · Catálogo · Luna AI</span>
    </div>
  </div>
</body>
</html>`;

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(600);
await mkdir(OUT_DIR, { recursive: true });
const file = path.join(OUT_DIR, 'aster-cover.png');
await page.screenshot({ path: file });
await browser.close();
console.log(`✓ ${file} (${WIDTH}x${HEIGHT})`);
