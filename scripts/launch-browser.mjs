import { chromium } from 'playwright';

/**
 * Abre um Chromium headless no ambiente que existir.
 *
 * Por que isto e necessario: o prerender roda dentro do `npm run build`, e
 * o build acontece em dois lugares muito diferentes.
 *
 *  - Na maquina de quem desenvolve, o Chrome do sistema ja esta instalado,
 *    entao usar `channel: 'chrome'` evita baixar outro navegador.
 *  - No build da Vercel nao existe Chrome do sistema. La o que existe e o
 *    Chromium que o Playwright baixa (ver o script `build:ci`).
 *
 * Tenta o Chrome do sistema primeiro e cai para o Chromium do Playwright.
 * Se nenhum dos dois abrir, lanca erro em vez de seguir: build que publica
 * HTML vazio e pior que build que falha.
 */
export async function launchBrowser() {
  const attempts = [
    { label: 'Chrome do sistema', options: { channel: 'chrome', headless: true } },
    { label: 'Chromium do Playwright', options: { headless: true } },
  ];

  const errors = [];
  for (const attempt of attempts) {
    try {
      const browser = await chromium.launch(attempt.options);
      console.log(`  navegador: ${attempt.label}`);
      return browser;
    } catch (error) {
      errors.push(`${attempt.label}: ${error.message.split('\n')[0]}`);
    }
  }

  throw new Error(
    'Nenhum navegador disponivel para o prerender.\n  ' +
      errors.join('\n  ') +
      '\n  Em CI, rode `npx playwright install chromium` antes do build.',
  );
}
