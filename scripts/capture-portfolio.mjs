/**
 * Captura screenshot real dos projetos do portfólio.
 *
 * Roda com `node scripts/capture-portfolio.mjs`. Usa o Chrome instalado na
 * máquina (channel 'chrome') para não precisar baixar um Chromium próprio.
 *
 * Regras que vêm do briefing e que o script respeita:
 *  - 1600x1000, WebP otimizado, em /public/portfolio;
 *  - é a página real, sem moldura de navegador e sem iframe;
 *  - a FULÔ está no plano gratuito do Render e pode levar 30–50s para
 *    acordar, então o timeout é generoso e o script espera conteúdo real
 *    aparecer, não só o HTML chegar;
 *  - se um site não responder, o script NÃO gera imagem falsa nem
 *    substituta: ele falha para aquele item, avisa, e deixa o TODO.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const WIDTH = 1600;
const HEIGHT = 1000;
const OUT_DIR = path.join(process.cwd(), "public", "portfolio");

const TARGETS = [
  {
    name: "Good Vibes Va'a",
    url: "https://goodvibesvaa.vercel.app/",
    file: "good-vibes-vaa.webp",
    // Vercel responde rápido.
    timeout: 60_000,
  },
  {
    name: "FULÔ — Crochê Contemporâneo",
    url: "https://fulo-crochet-site.onrender.com/",
    file: "fulo-croche.webp",
    // Render free tier: cold start de 30–50s é esperado.
    timeout: 150_000,
  },
];

/** Espera a página ter conteúdo de verdade, não só responder. */
async function waitForRealContent(page, timeout) {
  await page.waitForLoadState("domcontentloaded", { timeout });
  // Algum texto significativo precisa existir — descarta tela de loading.
  await page
    .waitForFunction(
      () => {
        const body = document.body;
        if (!body) return false;
        const text = (body.innerText || "").trim();
        const hasHeading = Boolean(document.querySelector("h1, h2"));
        return text.length > 120 && hasHeading;
      },
      { timeout },
    )
    .catch(() => {
      throw new Error("page responded but never rendered meaningful content");
    });

  // Deixa fonte e imagem acima da dobra assentarem.
  await page.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  await page.waitForTimeout(1500);
}

async function capture(browser, target) {
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
    // Alguns hosts variam resposta por idioma; os dois sites são pt-BR.
    locale: "pt-BR",
  });
  const page = await context.newPage();

  const started = Date.now();
  try {
    console.log(`\n→ ${target.name}\n  ${target.url}`);
    const response = await page.goto(target.url, {
      waitUntil: "commit",
      timeout: target.timeout,
    });
    const status = response?.status();
    if (status && status >= 400) {
      throw new Error(`HTTP ${status}`);
    }

    await waitForRealContent(page, target.timeout);

    // Esconde banner de cookie//overlay comum, que estragaria o hero.
    await page
      .addStyleTag({
        content: `[class*="cookie"],[id*="cookie"],[class*="consent"],[id*="consent"]{display:none!important}`,
      })
      .catch(() => {});

    const png = await page.screenshot({ type: "png" }); // viewport, sem fullPage
    await mkdir(OUT_DIR, { recursive: true });
    const outPath = path.join(OUT_DIR, target.file);
    const webp = await sharp(png).resize(WIDTH, HEIGHT, { fit: "cover" }).webp({ quality: 80, effort: 6 }).toBuffer();
    await writeFile(outPath, webp);

    const seconds = ((Date.now() - started) / 1000).toFixed(1);
    console.log(`  ✓ saved public/portfolio/${target.file} — ${(webp.length / 1024).toFixed(0)} kB in ${seconds}s`);
    return { ...target, ok: true, bytes: webp.length };
  } catch (error) {
    const seconds = ((Date.now() - started) / 1000).toFixed(1);
    console.error(`  ✗ FAILED after ${seconds}s: ${error.message}`);
    // Não deixa imagem parcial/antiga passar por nova.
    const outPath = path.join(OUT_DIR, target.file);
    if (existsSync(outPath)) {
      console.error(`    (mantendo o arquivo existente em ${target.file}; confira se está atual)`);
    }
    return { ...target, ok: false, error: error.message };
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
for (const target of TARGETS) {
  results.push(await capture(browser, target));
}
await browser.close();

console.log("\n=== RESUMO ===");
for (const r of results) {
  console.log(r.ok ? `ok    ${r.file}` : `FALHA ${r.file} — ${r.error}`);
}
const failed = results.filter((r) => !r.ok);
if (failed.length) {
  console.log(
    `\n${failed.length} captura(s) falharam. Nenhuma imagem substituta foi gerada — ` +
      "o card correspondente fica sem screenshot e o TODO permanece.",
  );
  process.exitCode = 1;
}
