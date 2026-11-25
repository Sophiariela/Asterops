/**
 * Verificação funcional e responsiva do site construído.
 *
 * Roda contra o build (`npm run build && npm run preview`), não contra o
 * dev server, para medir o que de fato vai para produção.
 *
 *   node scripts/verify-ui.mjs [baseURL]
 *
 * Checa, em cada viewport do briefing:
 *  - conteúdo crítico do hero visível (o bug do 375px), já passados os ~2s
 *    em que ele sumia;
 *  - overflow horizontal;
 *  - erro de console e request que falhou;
 *  - âncora não parando atrás do header fixo.
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = path.join(process.cwd(), 'artifacts');
const VIEWPORTS = [375, 390, 768, 1024, 1440];

/** Elementos que precisam estar visíveis assim que a home abre. */
const HERO_CHECKS = [
  { name: 'headline (h1)', selector: 'h1' },
  { name: 'descrição', selector: 'section#top p' },
  { name: 'CTA primário', selector: 'section#top button:has-text("Ver planos")' },
];

function visibleEnough(box, opacity) {
  return Boolean(box) && box.width > 0 && box.height > 0 && Number(opacity) > 0.95;
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
await mkdir(OUT, { recursive: true });

let failures = 0;
const report = [];

for (const width of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 1,
    isMobile: width <= 430,
    hasTouch: width <= 430,
  });
  const page = await context.newPage();

  const consoleErrors = [];
  const failedRequests = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160));
  });
  page.on('requestfailed', (r) => failedRequests.push(`${r.url().slice(0, 90)} — ${r.failure()?.errorText}`));

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 60_000 });
  // O bug aparecia por volta de 2s; esperamos além disso de propósito.
  await page.waitForTimeout(2600);

  const lines = [];
  for (const check of HERO_CHECKS) {
    const el = page.locator(check.selector).first();
    const count = await el.count();
    if (!count) {
      lines.push(`    ✗ ${check.name}: não encontrado`);
      failures++;
      continue;
    }
    const box = await el.boundingBox();
    const opacity = await el.evaluate((n) => getComputedStyle(n).opacity);
    const ok = visibleEnough(box, opacity);
    if (!ok) failures++;
    lines.push(`    ${ok ? '✓' : '✗'} ${check.name}: opacity=${opacity} box=${box ? `${Math.round(box.width)}x${Math.round(box.height)}` : 'null'}`);
  }

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  const overflowOk = overflow <= 1;
  if (!overflowOk) failures++;
  lines.push(`    ${overflowOk ? '✓' : '✗'} overflow horizontal: ${overflow}px`);

  const pageHeight = await page.evaluate(() => document.body.scrollHeight);
  lines.push(`    · altura da home: ${pageHeight}px`);

  // Âncora: o topo da seção precisa ficar abaixo do header fixo.
  await page.evaluate(() => { window.location.hash = '#portfolio'; });
  await page.waitForTimeout(900);
  const anchor = await page.evaluate(() => {
    const el = document.getElementById('portfolio');
    const header = document.querySelector('header');
    if (!el || !header) return null;
    return { top: Math.round(el.getBoundingClientRect().top), headerBottom: Math.round(header.getBoundingClientRect().bottom) };
  });
  if (anchor) {
    const ok = anchor.top >= anchor.headerBottom - 2;
    if (!ok) failures++;
    lines.push(`    ${ok ? '✓' : '✗'} âncora #portfolio: topo=${anchor.top}px, header termina em ${anchor.headerBottom}px`);
  }

  if (consoleErrors.length) {
    lines.push(`    ! erros de console (${consoleErrors.length}): ${consoleErrors.slice(0, 2).join(' | ')}`);
  }
  if (failedRequests.length) {
    lines.push(`    ! requests falhos (${failedRequests.length}): ${failedRequests.slice(0, 2).join(' | ')}`);
  }

  report.push(`\n  ${width}px\n${lines.join('\n')}`);

  if (width === 375 || width === 1440) {
    await page.evaluate(() => { window.location.hash = ''; window.scrollTo(0, 0); });
    await page.waitForTimeout(400);
    const file = width === 1440 ? 'aster-home-desktop.png' : 'aster-home-mobile.png';
    await page.screenshot({ path: path.join(OUT, file), fullPage: false });
    report.push(`    → screenshot artifacts/${file}`);
  }

  await context.close();
}

await browser.close();

console.log('=== VERIFICAÇÃO DE UI ===');
console.log('base:', BASE);
console.log(report.join('\n'));
console.log(`\n${failures === 0 ? '✓ tudo passou' : `✗ ${failures} verificação(ões) falharam`}`);
process.exitCode = failures === 0 ? 0 : 1;
