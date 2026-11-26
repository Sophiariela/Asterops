import { chromium } from 'playwright';

/**
 * Abre um Chromium headless no ambiente que existir.
 *
 * O prerender roda dentro do `npm run build`, e o build acontece em dois
 * lugares muito diferentes:
 *
 *  - Na maquina de quem desenvolve existe o Chrome do sistema, entao
 *    `channel: 'chrome'` evita baixar outro navegador.
 *  - No build da Vercel nao existe Chrome, e o Chromium que o Playwright
 *    baixa tambem nao abre: a imagem e Amazon Linux e faltam as
 *    bibliotecas de sistema. `playwright install --with-deps` nao ajuda,
 *    porque ele usa apt e so cobre Debian/Ubuntu. Para esse caso existe
 *    o @sparticuz/chromium, que e um Chromium compilado justamente para
 *    ambiente serverless Amazon Linux.
 *
 * A ordem tenta o mais barato primeiro. Se nada abrir, lanca erro em vez
 * de seguir: build que publica HTML vazio e pior que build que falha.
 */

/** Chromium serverless — importado sob demanda, so quando for preciso. */
async function serverlessChromium() {
  const mod = await import('@sparticuz/chromium');
  const sparticuz = mod.default ?? mod;
  return {
    executablePath: await sparticuz.executablePath(),
    args: sparticuz.args,
    headless: true,
  };
}

export async function launchBrowser() {
  const attempts = [
    {
      label: 'Chrome do sistema',
      build: async () => ({ channel: 'chrome', headless: true }),
    },
    {
      label: 'Chromium do Playwright',
      build: async () => ({ headless: true }),
    },
    {
      label: 'Chromium serverless (@sparticuz/chromium)',
      build: serverlessChromium,
    },
  ];

  const errors = [];
  for (const attempt of attempts) {
    try {
      const options = await attempt.build();
      const browser = await chromium.launch(options);
      console.log(`  navegador: ${attempt.label}`);
      return browser;
    } catch (error) {
      errors.push(`${attempt.label}: ${String(error.message).split('\n')[0]}`);
    }
  }

  throw new Error(
    'Nenhum navegador disponivel para o prerender.\n  ' + errors.join('\n  '),
  );
}
