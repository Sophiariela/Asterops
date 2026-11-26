import { PLAN_TIERS, type PlanTier } from './plans';

/**
 * Matriz de comparação dos planos.
 *
 * Nada aqui é digitado à mão: a matriz é DERIVADA de PLAN_TIERS, que é a
 * mesma lista do seed do servidor (server/prisma/seed.ts). Os planos são
 * cumulativos — Growth começa com "Tudo do Starter", Business com "Tudo do
 * Growth" e assim por diante — então "incluído" é exatamente isto: o
 * recurso aparece na lista do próprio plano ou na de algum plano anterior.
 *
 * Fazer assim é o que impede inventar disponibilidade de recurso: se um dia
 * o seed mudar, a tabela muda junto, sem ninguém precisar lembrar.
 */

/** Linha "Tudo do X" é referência de herança, não um recurso em si. */
const INHERITANCE_PREFIX = 'Tudo do';

function ownFeatures(tier: PlanTier): string[] {
  return tier.features.filter((f) => !f.startsWith(INHERITANCE_PREFIX));
}

export interface ComparisonRow {
  feature: string;
  /** Plano que introduz o recurso — usado para agrupar a tabela. */
  introducedBy: PlanTier['slug'];
  /** slug do plano -> incluído ou não. */
  included: Record<PlanTier['slug'], boolean>;
}

/**
 * Monta as linhas na ordem em que os recursos aparecem, do plano mais
 * simples para o mais completo.
 */
export function buildComparison(): ComparisonRow[] {
  const rows: ComparisonRow[] = [];
  const seen = new Set<string>();

  PLAN_TIERS.forEach((tier, tierIndex) => {
    for (const feature of ownFeatures(tier)) {
      if (seen.has(feature)) continue;
      seen.add(feature);

      const included = {} as Record<PlanTier['slug'], boolean>;
      PLAN_TIERS.forEach((other, otherIndex) => {
        // Cumulativo: quem vem depois herda tudo de quem veio antes.
        included[other.slug] = otherIndex >= tierIndex;
      });

      rows.push({ feature, introducedBy: tier.slug, included });
    }
  });

  return rows;
}

/**
 * Condições de domínio por plano.
 *
 * `null` = não verificado, e nesse caso a interface não escreve nada.
 *
 * O que dá para afirmar hoje: o Starter lista "Publicação com domínio
 * ASTER" tanto em src/data/plans.ts quanto no seed do servidor, ou seja,
 * subdomínio da ASTER.
 *
 * O que NÃO dá: o schema tem `customDomain` em Site
 * (server/prisma/schema.prisma), então domínio próprio existe como
 * capacidade do produto — mas nenhum plano declara que o libera. Por isso
 * não escrevemos "domínio próprio a partir do Growth": seria inventar
 * benefício. Registro e renovação de domínio também não aparecem em lugar
 * nenhum e ficam fora.
 *
 * TODO(aster): confirmar, para cada plano, (a) se inclui domínio próprio,
 * (b) a partir de qual plano, (c) se o registro do domínio está incluso e
 * (d) quem paga a renovação. Com isso preenchido aqui, a linha aparece
 * sozinha nos cartões e na tabela.
 */
export const DOMAIN_TERMS: Record<PlanTier['slug'], string | null> = {
  starter: 'Publicação em subdomínio ASTER.',
  growth: null,
  business: null,
  scale: null,
};

/** Quantos planos ainda estão sem condição de domínio confirmada. */
export const DOMAIN_TERMS_PENDING = Object.values(DOMAIN_TERMS).filter((v) => v === null).length;
