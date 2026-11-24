/**
 * Executa uma leitura do banco e cai para um valor padrão se ela falhar.
 *
 * As seções do site público são independentes: se a tabela de níveis ou de
 * dúvidas estiver indisponível (banco fora do ar, migração pendente), a
 * seção some e o resto da página continua servindo normalmente — em vez de
 * a página inteira responder erro por causa de um bloco opcional.
 *
 * Só para leitura de conteúdo público. Escrita e rota de painel devem
 * propagar o erro, porque lá o silêncio esconderia falha real.
 */
export async function safeQuery<T>(label: string, run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    console.error(`Failed to load ${label}; section will be skipped:`, error);
    return fallback;
  }
}
