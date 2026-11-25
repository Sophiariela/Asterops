/**
 * Leitura de variável de ambiente opcional.
 *
 * Existe por causa de um bug real: `.env.local` tinha os valores de exemplo
 * do `.env.example` copiados sem edição (`secret_xxxx…`, `xxxx…`). Como eram
 * strings não vazias, a checagem de "está configurado?" passava, e cada envio
 * do formulário tentava falar com o Notion e tomava 401 — silenciosamente,
 * porque o espelho é best-effort.
 *
 * Um placeholder é a ausência de configuração, e aqui é tratado como tal.
 */

/** Marcas de valor que foi copiado do exemplo e nunca preenchido. */
const PLACEHOLDER_PATTERNS = [
  /^x+$/i,
  /^(secret|re|sk|key|token)_x+$/i,
  /x{8,}/i,
  /^(your|my|change|choose|replace|generate)[-_]/i,
  /^(todo|tbd|placeholder|example)$/i,
];

/**
 * Devolve o valor quando ele é utilizável, ou `undefined` quando a variável
 * está ausente, vazia ou ainda com o texto de exemplo.
 */
export function optionalEnv(name: string): string | undefined {
  const raw = process.env[name]?.trim();
  if (!raw) return undefined;
  if (PLACEHOLDER_PATTERNS.some((pattern) => pattern.test(raw))) {
    console.warn(
      `${name} still holds the example placeholder value — treating it as unset. ` +
        "Put a real value in .env or remove the line.",
    );
    return undefined;
  }
  return raw;
}

/** Verdadeiro só quando todas as variáveis têm valor real. */
export function hasEnv(...names: string[]): boolean {
  return names.every((name) => optionalEnv(name) !== undefined);
}
