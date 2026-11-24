import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Conteúdo de partida do site.
 *
 * Tudo aqui é editável depois pelo painel — o seed existe para o site
 * nascer com o posicionamento certo, não para congelar texto. Usa upsert
 * por slug: rodar de novo atualiza, nunca apaga pedido nem derruba dado
 * de produção.
 */

/** As seis frentes de implementação, na voz do resultado para o negócio. */
const services = [
  {
    title: "Presença digital",
    slug: "presenca-digital",
    description:
      "Site profissional com a sua marca, domínio próprio, versão para celular e estrutura pensada para virar contato — não só para existir.",
    icon: "Globe",
    order: 1,
  },
  {
    title: "Agendamento online",
    slug: "agendamento-online",
    description:
      "Sua cliente escolhe serviço e horário sem passar por conversa. Agenda, disponibilidade, confirmação, lembrete e ficha de cliente no mesmo fluxo.",
    icon: "CalendarCheck",
    order: 2,
  },
  {
    title: "Automação de WhatsApp",
    slug: "automacao-whatsapp",
    description:
      "Atendimento que não depende de você digitar tudo: respostas automáticas, qualificação de interessado, confirmação e lembrete de horário.",
    icon: "MessageCircle",
    order: 3,
  },
  {
    title: "Gestão do negócio",
    slug: "gestao-do-negocio",
    description:
      "Cadastro de clientes, histórico, painel com o que importa e processos internos no lugar de planilha solta e caderno.",
    icon: "LayoutDashboard",
    order: 4,
  },
  {
    title: "Vendas online",
    slug: "vendas-online",
    description:
      "Catálogo de produtos, loja, integração de checkout e o fluxo de venda ligado ao seu atendimento.",
    icon: "ShoppingCart",
    order: 5,
  },
  {
    title: "Software sob medida",
    slug: "software-sob-medida",
    description:
      "Quando nada de prateleira serve: aplicação web, painel próprio, API e integrações desenhadas em cima da sua operação.",
    icon: "Code2",
    order: 6,
  },
];

/** Níveis comerciais. Preço fica como RÓTULO — ver nota no schema. */
const tiers = [
  {
    name: "Presença",
    slug: "presenca",
    audience: "Para quem ainda não tem um lugar próprio na internet e perde cliente por isso.",
    problem:
      "O negócio só existe no Instagram e no WhatsApp. Quem procura pelo nome não acha informação, preço nem endereço — e desiste.",
    outcome: "Seus clientes encontram e conhecem seu negócio.",
    inclusions: [
      "Site profissional com a sua marca",
      "Configuração de domínio próprio",
      "Layout adaptado ao celular",
      "Botão e link de WhatsApp com mensagem pronta",
      "Formulário de contato e de orçamento",
      "Configuração básica de SEO para busca local",
    ],
    customization:
      "Identidade, estrutura de páginas e textos montados em cima dos seus serviços — nada de modelo genérico preenchido com o seu nome.",
    implementation:
      "A Aster desenha, desenvolve, configura o domínio e publica. Você revisa e aprova; a parte técnica é nossa.",
    featured: false,
    order: 1,
  },
  {
    name: "Agenda",
    slug: "agenda",
    audience: "Para quem já tem movimento e perde tempo (e cliente) organizando horário na mão.",
    problem:
      "A agenda vive no WhatsApp: confirmar, remarcar e lembrar consome o dia, e o furo de horário vira prejuízo.",
    outcome: "Seus clientes agendam sem depender de conversas intermináveis.",
    inclusions: [
      "Tudo do nível Presença",
      "Agendamento online com os seus serviços e durações",
      "Gestão de disponibilidade e bloqueios",
      "Confirmação de horário",
      "Fluxo de lembrete antes do atendimento",
      "Ficha de cliente com histórico e observações",
      "Sinal ou pagamento no agendamento, quando o provedor integrado suportar",
    ],
    customization:
      "Regras de agenda do seu negócio: duração por serviço, intervalo, antecedência mínima, política de sinal e quem atende o quê.",
    implementation:
      "Montamos o fluxo de agendamento, integramos o canal de aviso e testamos ponta a ponta antes de entregar.",
    featured: true,
    order: 2,
  },
  {
    name: "Operação",
    slug: "operacao",
    audience: "Para quem tem equipe, volume ou mais de uma frente e precisa de processo, não de improviso.",
    problem:
      "Informação espalhada, retrabalho entre pessoas e nenhuma visão do todo: cada dado mora num lugar diferente.",
    outcome: "Seu negócio trabalha com processos organizados, não com improvisos.",
    inclusions: [
      "Site e fluxo de agendamento ou de venda",
      "Gestão de clientes centralizada",
      "Painel com os números da operação",
      "Automações sob medida para as suas rotinas",
      "Integrações com as ferramentas que você já usa",
      "Funcionalidades específicas conforme o escopo aprovado",
    ],
    customization:
      "Praticamente tudo: o escopo é desenhado a partir da sua operação. É o nível em que entra desenvolvimento sob medida.",
    implementation:
      "Diagnóstico mais longo, escopo por escrito, desenvolvimento em etapas, testes e acompanhamento depois da entrega.",
    featured: false,
    order: 3,
  },
];

/** FAQ: as objeções reais de quem está decidindo. */
const faq = [
  {
    question: "Quanto custa desenvolver uma solução?",
    answer:
      "Depende do escopo — e por isso não publicamos tabela fechada. Um site institucional e um sistema com agendamento, pagamento e painel são trabalhos de tamanhos muito diferentes. No diagnóstico a gente entende o que você precisa e manda a proposta com o valor da implementação e o que entra em cada etapa, por escrito.",
    order: 1,
  },
  {
    question: "Preciso ter conhecimento técnico?",
    answer:
      "Não. Essa é justamente a diferença: a configuração é nossa. Você não precisa aprender a usar uma plataforma, conectar integração ou mexer em domínio. O que pedimos de você é contexto sobre o negócio e as decisões — preço, serviço, regra de agenda.",
    order: 2,
  },
  {
    question: "Vocês desenvolvem um site do zero?",
    answer:
      "Sim. O site é construído para o seu negócio, com a sua marca, os seus serviços e a estrutura que faz sentido para quem vai te contratar. Não vendemos template para você preencher.",
    order: 3,
  },
  {
    question: "Posso integrar meu WhatsApp?",
    answer:
      "Botão e link com mensagem pronta entram em qualquer projeto. Fluxos automáticos — confirmação, lembrete, qualificação — dependem da API oficial do WhatsApp Business, com conta verificada e templates aprovados pela Meta. Isso é escopo de projeto: avaliamos o seu caso e dizemos o que dá para fazer antes de prometer.",
    order: 4,
  },
  {
    question: "É possível automatizar meus agendamentos?",
    answer:
      "Sim, é o nível Agenda. A cliente escolhe serviço e horário pelo site, recebe confirmação e lembrete, e a sua agenda fica organizada num lugar só. Cobrança de sinal entra quando o meio de pagamento escolhido no projeto suportar.",
    order: 5,
  },
  {
    question: "Vocês atendem empresas pequenas?",
    answer:
      "Sim — é o nosso público principal. Profissional autônomo, studio de uma pessoa, salão com equipe pequena. O nível Presença existe exatamente para começar enxuto e crescer depois.",
    order: 6,
  },
  {
    question: "Quanto tempo leva para implementar?",
    answer:
      "Varia com o escopo e com a velocidade das aprovações e do material que você envia. Não trabalhamos com promessa de prazo fixo em site: o prazo da sua solução sai no diagnóstico, junto da proposta, e é o que vale no contrato.",
    order: 7,
  },
  {
    question: "Existe manutenção depois da entrega?",
    answer:
      "Existe quando contratada. Pode ser manutenção, suporte, evolução do sistema ou nada disso — depende do que ficar acordado. O que não fazemos é entregar e sumir sem combinar o que acontece depois.",
    order: 8,
  },
  {
    question: "Posso solicitar funcionalidades personalizadas?",
    answer:
      "Pode, e é o que mais fazemos no nível Operação. Painel específico, relatório, integração com um sistema que você já usa, automação de uma rotina interna. A gente avalia a viabilidade e coloca no escopo com prazo e valor.",
    order: 9,
  },
];

/** Projetos reais do estúdio — com captura de tela própria em /public. */
const portfolioProjects = [
  {
    name: "Good Vibes Va'a",
    slug: "good-vibes-vaa",
    category: "Site e agendamento",
    shortDescription:
      "Site e fluxo de reserva para um clube de canoa havaiana em Salvador.",
    fullDescription:
      "Clube de canoa havaiana que recebia toda solicitação de experiência pelo WhatsApp, sem lugar próprio para explicar as modalidades. Entregamos o site bilíngue (pt/en) com as experiências, os planos de treino e as saídas privadas, e uma rota dedicada de reserva: a pessoa escolhe a experiência num carrossel e segue um fluxo de quatro passos — configurar, data, dados, confirmar — que chega pronto no WhatsApp do clube. Inclui calendário próprio, catálogo de produtos e páginas institucionais.",
    coverImage: "/projects/good-vibes-vaa-agendar.webp",
    gallery: ["/projects/good-vibes-vaa-home.webp", "/projects/good-vibes-vaa-mobile.webp"],
    projectUrl: "https://goodvibesvaa.vercel.app",
    technologies: ["Python", "HTML/CSS/JS", "Vercel"],
    classification: "CLIENT_PROJECT" as const,
    status: "LIVE" as const,
    published: true,
    order: 1,
  },
  {
    name: "Fulô Crochet",
    slug: "fulo-crochet",
    category: "Loja e presença digital",
    shortDescription: "Presença digital e loja para uma marca de moda em crochê artesanal.",
    fullDescription:
      "A Fulô Crochet vivia no Instagram e no WhatsApp, sem um endereço próprio e sem caminho estruturado entre descobrir a peça e comprar. Reconstruímos a presença digital da marca: arquitetura de site, estrutura voltada para conversão e uma base operacional que a marca continua usando para crescer.",
    coverImage: "/projects/fulo-crochet-home.webp",
    gallery: ["/projects/fulo-crochet-mobile.webp"],
    projectUrl: "https://fulo-crochet-site.onrender.com",
    technologies: ["Python", "Flask", "Tailwind CSS"],
    classification: "CLIENT_PROJECT" as const,
    status: "LIVE" as const,
    published: true,
    order: 2,
  },
  {
    name: "Ready Set",
    slug: "ready-set",
    category: "Auditoria de UX e conversão",
    shortDescription: "Auditoria de UX, conversão e acessibilidade para uma marca de bebida funcional.",
    fullDescription:
      "Auditoria completa do drinkreadyset.com: experiência, texto, sinais de confiança, hierarquia visual e todo o fluxo de compra, comparado com a execução de marcas premium do setor. A entrega foi um roteiro priorizado — ganhos rápidos, correções de esforço médio e mudanças de maior impacto em conversão — e não uma lista genérica de boas práticas. Este projeto foi diagnóstico e recomendação; a implementação ficou com o time da marca.",
    coverImage: "/projects/ready-set-home.webp",
    gallery: [],
    projectUrl: "https://drinkreadyset.com",
    technologies: [],
    classification: "CLIENT_PROJECT" as const,
    status: "DELIVERED" as const,
    published: true,
    order: 3,
  },
];

/**
 * Produtos internos saem do site público no reposicionamento (nomes de
 * linha interna não são a arquitetura de serviço que o cliente compra),
 * mas as linhas ficam no banco: `published: false`, nada apagado.
 */
const unpublishedInternalProducts = ["webos", "commerceos"];

/** Serviços da posição antiga que não existem mais na vitrine pública. */
const retiredServiceSlugs = [
  "website-development",
  "ecommerce-development",
  "custom-software",
  "web-applications",
  "dashboards-admin-systems",
  "automation-ai",
];

async function main() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: { ...service, active: true },
      create: service,
    });
  }

  // Desativa (sem apagar) o que era da posição antiga.
  await prisma.service.updateMany({
    where: { slug: { in: retiredServiceSlugs } },
    data: { active: false },
  });

  for (const tier of tiers) {
    await prisma.solutionTier.upsert({
      where: { slug: tier.slug },
      update: tier,
      create: tier,
    });
  }

  for (const entry of faq) {
    const existing = await prisma.faqEntry.findFirst({ where: { question: entry.question } });
    if (existing) {
      await prisma.faqEntry.update({ where: { id: existing.id }, data: entry });
    } else {
      await prisma.faqEntry.create({ data: entry });
    }
  }

  for (const project of portfolioProjects) {
    await prisma.portfolioProject.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  await prisma.portfolioProject.updateMany({
    where: { slug: { in: unpublishedInternalProducts } },
    data: { published: false },
  });

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      studioName: "Aster",
      contactEmail: "contato@aster.studio",
      whatsapp: null,
      instagramUrl: "https://instagram.com/aster.ops",
      ctaLabel: "Solicitar diagnóstico",
      ctaHref: "/contato",
      footerNote: "Tecnologia implementada para o seu negócio agendar, responder e vender.",
    },
  });

  const seedEmail = process.env.ADMIN_SEED_EMAIL;
  const seedPassword = process.env.ADMIN_SEED_PASSWORD;
  if (seedEmail && seedPassword) {
    const passwordHash = await bcrypt.hash(seedPassword, 12);
    await prisma.adminUser.upsert({
      where: { email: seedEmail },
      update: { passwordHash },
      create: { email: seedEmail, passwordHash },
    });
    console.log(`Admin user ready: ${seedEmail}`);
  } else {
    console.warn("ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD not set — skipped admin user seed.");
  }

  console.log(
    `Seed: ${services.length} serviços, ${tiers.length} níveis, ${faq.length} perguntas, ${portfolioProjects.length} projetos.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
