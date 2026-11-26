/**
 * Configuração central do site.
 *
 * Tudo que é dado de negócio e aparece em mais de um lugar mora aqui, para
 * mudar num ponto só. Valor que ainda não foi verificado fica como `null`
 * com um TODO — o componente que usa precisa tratar o `null` escondendo o
 * elemento, nunca inventando um valor plausível.
 */

/** Domínio canônico, usado em canonical, OG e sitemap. */
// TODO(aster): confirmar o domínio final. Hoje a produção responde em
// asterops-lime.vercel.app; se houver domínio próprio (ex.: asterops.co),
// trocar aqui e refazer o sitemap.
export const SITE_URL = 'https://asterops-lime.vercel.app';

export const SITE_NAME = 'ASTER';

/**
 * Domínio mostrado no mockup do hero.
 *
 * É ilustração de produto, não endpoint. Não confundir com a URL de API.
 */
// TODO(aster): confirmar se o app ficará em app.asterops.co antes de
// divulgar esse endereço em material público.
export const APP_DOMAIN = 'app.asterops.co';

/* -------------------------------------------------------------------------
 * Teste grátis
 * ---------------------------------------------------------------------- */

/**
 * Duração do teste grátis, em dias.
 *
 * `null` = não verificado. Enquanto for `null`, a interface NÃO exibe
 * promessa de teste: nem duração, nem "sem cartão". O botão continua
 * funcionando e leva para os planos.
 */
// TODO(aster): informar a duração real do teste grátis (em dias).
export const TRIAL_DAYS: number | null = null;

/**
 * O teste exige cartão de crédito?
 *
 * `null` = não verificado. Mesma regra: sem confirmação, não se afirma nada.
 */
// TODO(aster): informar se o teste grátis exige cartão de crédito.
export const TRIAL_REQUIRES_CARD: boolean | null = null;

/**
 * Frase do teste grátis, montada a partir da configuração.
 *
 * Devolve `null` quando falta dado — quem chama deve simplesmente não
 * renderizar a linha, em vez de mostrar texto pela metade.
 */
export function trialMessage(): string | null {
  if (TRIAL_DAYS === null || TRIAL_REQUIRES_CARD === null) return null;
  const card = TRIAL_REQUIRES_CARD ? 'cartão necessário' : 'sem cartão';
  return `${TRIAL_DAYS} dias grátis · ${card}`;
}

/* -------------------------------------------------------------------------
 * Contato
 * ---------------------------------------------------------------------- */

/**
 * Link do WhatsApp da equipe (formato https://wa.me/55...).
 *
 * `null` = não verificado. Sem isso, o CTA "Falar com a equipe" cai para o
 * e-mail; se os dois faltarem, o botão não é renderizado — nunca um link
 * quebrado.
 */
// TODO(aster): informar o número de WhatsApp comercial, em formato wa.me.
export const WHATSAPP_URL: string | null = null;

/** E-mail de contato comercial. */
// TODO(aster): confirmar o e-mail comercial público.
export const CONTACT_EMAIL: string | null = null;

/** Destino do CTA de contato: WhatsApp, senão e-mail, senão nada. */
export function contactHref(): string | null {
  if (WHATSAPP_URL) return WHATSAPP_URL;
  if (CONTACT_EMAIL) return `mailto:${CONTACT_EMAIL}`;
  return null;
}

/* -------------------------------------------------------------------------
 * Redes sociais
 * ---------------------------------------------------------------------- */

/** `null` esconde o ícone. Não inventar perfil. */
// TODO(aster): confirmar a URL do Instagram oficial.
export const INSTAGRAM_URL: string | null = null;

// TODO(aster): confirmar a URL do LinkedIn oficial.
export const LINKEDIN_URL: string | null = null;

/**
 * E-mail comercial usado no CTA do plano Scale.
 *
 * Este endereco ja esta em producao hoje (src/pages/Plans.tsx), entao e
 * mantido para nao remover um canal de venda que funciona. Note que o
 * dominio (aster.com.br) diverge do asterops.co usado no resto.
 */
// TODO(aster): confirmar se vendas@aster.com.br continua valendo ou se o
// contato comercial migrou para o dominio asterops.co.
export const SALES_EMAIL = 'vendas@aster.com.br';
