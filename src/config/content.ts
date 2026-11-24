import type {
  AboutContent,
  ChannelsContent,
  ContactContent,
  HomeContent,
  ImplementationContent,
} from "@/types";

/**
 * Copy pública do site, em pt-BR.
 *
 * O público de entrada é beleza e estética (salão, studio de unhas, lash,
 * brow, estética, spa). A copy fala dos problemas desse dia a dia em vez de
 * tentar servir todo mercado ao mesmo tempo — a arquitetura (serviços,
 * níveis e projetos vêm do banco) permite abrir outro nicho depois sem
 * reescrever o site.
 *
 * Texto do hero e rótulos de CTA têm versão editável em `SiteSettings`
 * (painel /admin/settings); o que está aqui é o padrão de fábrica.
 */
export const homeContent: HomeContent = {
  hero: {
    eyebrow: "Estúdio de automação e software",
    headline: "Seu negócio agenda, responde e vende. Sem você precisar fazer tudo manualmente.",
    description:
      "Sites profissionais, agendamento online, WhatsApp automatizado e sistemas personalizados. Nós configuramos a tecnologia para você.",
    primaryCta: { label: "Quero automatizar meu negócio", href: "/contato" },
    secondaryCta: { label: "Ver o que podemos fazer", href: "#solucoes" },
    proofCaption: "Projetos da Aster no ar — Good Vibes Va'a e Fulô Crochet.",
  },

  transformation: {
    eyebrow: "Antes e depois",
    title: "O trabalho repetitivo sai do seu colo.",
    description:
      "A maior parte do tempo de um salão ou studio não vai para o atendimento: vai para confirmar horário, repetir preço no WhatsApp e procurar informação perdida na conversa.",
    before: {
      title: "Como costuma ser hoje",
      items: [
        "Responder cada mensagem no WhatsApp na mão, uma por uma.",
        "Perder cliente porque a resposta demorou a chegar.",
        "Confirmar e remarcar horário manualmente, todo dia.",
        "Esquecer o retorno de quem pediu orçamento e sumiu.",
        "Agenda numa planilha, clientes no caderno, histórico na conversa.",
        "Nenhum lugar oficial na internet com serviços, preços e endereço.",
      ],
    },
    after: {
      title: "Como fica com a Aster",
      items: [
        "Quem procura pelo seu nome encontra um site que explica o serviço.",
        "O cliente solicita ou marca o horário sem depender de conversa.",
        "Confirmação e lembrete saem sozinhos, no fluxo configurado.",
        "Ficha de cliente organizada: contato, histórico e observações.",
        "Processos no lugar de improviso — e menos repetição no seu dia.",
        "Você continua no comando: a tecnologia tira o trabalho manual, não a sua decisão.",
      ],
    },
    note:
      "Automação não substitui o atendimento humano e nenhum negócio fica 100% automático. O que a gente tira do caminho é a parte repetitiva.",
  },

  solutions: {
    eyebrow: "O que implementamos",
    title: "Soluções, não ferramentas soltas.",
    description:
      "Você descreve o problema; a gente define, desenvolve e configura o que resolve. Cada item abaixo é entregue implementado e funcionando — não é um software que você precisa aprender a montar.",
  },

  howItWorks: {
    eyebrow: "Como funciona",
    title: "Três passos até a solução no ar.",
    description: "Sem formulário infinito, sem curso de ferramenta, sem configuração no seu colo.",
    steps: [
      {
        step: "01",
        title: "Conte sobre o seu negócio",
        description:
          "A gente entende como você trabalha hoje: agenda, atendimento, equipe, o que trava e onde o tempo vai embora.",
      },
      {
        step: "02",
        title: "Construímos e configuramos",
        description:
          "A Aster desenha, desenvolve, integra e configura a infraestrutura digital necessária — site, agendamento, automações e sistemas.",
      },
      {
        step: "03",
        title: "Entrega e acompanhamento",
        description:
          "Colocamos no ar, mostramos como usar e seguimos com manutenção ou suporte conforme o combinado no contrato.",
      },
    ],
  },

  tiers: {
    eyebrow: "Níveis de solução",
    title: "Três pontos de partida.",
    description:
      "Cada nível é um ponto de partida, não uma caixa fechada: o escopo final sai do diagnóstico. A implementação é cobrada à parte, porque é trabalho de configuração, desenvolvimento e integração.",
    note:
      "Valores são definidos por escopo. Quando um nível ainda não tem preço publicado, o cartão mostra isso em vez de inventar número.",
  },

  portfolioPreview: {
    eyebrow: "Projetos",
    title: "O que já está no ar.",
    description:
      "Projetos reais entregues pelo estúdio. Sem case inventado, sem logo de cliente que não existe — se está aqui, dá para abrir e conferir.",
  },

  faq: {
    eyebrow: "Dúvidas",
    title: "O que perguntam antes de fechar.",
    description: "Se a sua pergunta não estiver aqui, mande no formulário — respondemos a mesma coisa que responderíamos numa reunião.",
  },

  finalCta: {
    title: "Seu negócio não precisa continuar funcionando no improviso.",
    description:
      "Conte o que você precisa. A Aster encontra a solução e cuida da implementação.",
    primaryCta: { label: "Solicitar diagnóstico", href: "/contato" },
    secondaryCta: { label: "Ver projetos", href: "/projetos" },
  },
};

export const implementationContent: ImplementationContent = {
  eyebrow: "Implementação",
  title: "Você não precisa aprender a usar uma plataforma.",
  description:
    "Esta é a diferença entre contratar a Aster e assinar uma ferramenta: a configuração é nossa. Você recebe a solução funcionando, com o seu conteúdo, o seu serviço e o seu jeito de atender dentro dela.",
  promise:
    "Você não precisa aprender a usar uma plataforma ou configurar ferramentas. Nós implementamos a solução para o seu negócio.",
  stages: [
    { step: "01", title: "Diagnóstico", description: "Conversa sobre a operação de hoje: agenda, atendimento, equipe e os gargalos reais." },
    { step: "02", title: "Escopo", description: "O que entra, o que fica para depois, o que é customizado e quanto custa — por escrito, antes de começar." },
    { step: "03", title: "Design", description: "Estrutura, conteúdo e identidade aplicados ao seu negócio, não a um modelo genérico." },
    { step: "04", title: "Desenvolvimento", description: "Construção do site, do agendamento, do painel ou do sistema que foi definido." },
    { step: "05", title: "Integrações", description: "Conexão com WhatsApp, pagamento, agenda e as ferramentas que você já usa, quando suportado." },
    { step: "06", title: "Testes", description: "Fluxos testados na prática: o cliente consegue agendar, a mensagem chega, o pedido grava." },
    { step: "07", title: "Publicação", description: "Domínio, hospedagem e a solução no ar, com os ajustes finais feitos por nós." },
    { step: "08", title: "Treinamento e suporte", description: "Orientação de uso quando faz sentido e manutenção conforme o contrato." },
  ],
  disclaimer:
    "O prazo depende do escopo: uma presença digital enxuta e um sistema sob medida não levam o mesmo tempo. O prazo da sua solução sai no diagnóstico, por escrito — a gente não promete um número antes de saber o que vai construir.",
};

export const channelsContent: ChannelsContent = {
  eyebrow: "WhatsApp e Pix",
  title: "Os dois canais que o cliente brasileiro já usa.",
  description:
    "Fazem parte da jornada quando a solução pede. O que é implementação padrão e o que depende de escopo e de aprovação das plataformas está dito abaixo, sem meio-termo.",
  items: [
    {
      title: "Botão e link de WhatsApp",
      description:
        "Contato direto a partir do site, com a mensagem já escrita e o serviço identificado. Implementado em qualquer nível.",
      availability: "Padrão",
    },
    {
      title: "Fluxos de atendimento e lembretes",
      description:
        "Confirmação de horário, lembrete e qualificação de interessado. Depende da API oficial do WhatsApp Business, de aprovação de template e de conta verificada.",
      availability: "Sob escopo",
    },
    {
      title: "Pix no fluxo de pagamento",
      description:
        "Sinal de agendamento, cobrança e confirmação via provedor de pagamento integrado. Implementamos junto com o meio de pagamento escolhido no projeto.",
      availability: "Sob escopo",
    },
  ],
};

export const aboutContent: AboutContent = {
  hero: {
    eyebrow: "Sobre",
    headline: "Um estúdio que implementa, não uma plataforma que você configura.",
    description:
      "A Aster é um estúdio de automação e software. Juntamos estratégia, design e engenharia para montar a infraestrutura digital de negócios que vivem de atendimento — começando por beleza e estética.",
  },
  mission: {
    eyebrow: "Como trabalhamos",
    title: "Você contrata um time, não uma ferramenta.",
    description:
      "Você conta o que precisa e recebe uma proposta. A partir daí, a gente desenha, desenvolve e configura a solução — site, agendamento, automação, painel ou sistema — em volta do seu negócio. Nada de montar sozinho a partir de um modelo pronto.",
  },
  principles: [
    { title: "Resultado antes de ferramenta", description: "O projeto começa pelo problema de operação, não pela tecnologia que vamos usar." },
    { title: "Implementação é o serviço", description: "Configurar, integrar e colocar no ar faz parte da entrega — não é tarefa do cliente." },
    { title: "Sem promessa que não cabe no escopo", description: "Integração que depende de aprovação externa é apresentada como escopo, nunca como recurso pronto." },
    { title: "Feito para rodar", description: "O que entregamos sustenta o dia a dia do negócio, não só o dia do lançamento." },
  ],
  closingCta: {
    title: "Quer saber o que dá para automatizar no seu caso?",
    description: "Conte como o seu negócio funciona hoje. A gente responde com o caminho e o escopo.",
    primaryCta: { label: "Solicitar diagnóstico", href: "/contato" },
    secondaryCta: { label: "Ver projetos", href: "/projetos" },
  },
};

export const contactContent: ContactContent = {
  hero: {
    eyebrow: "Diagnóstico",
    headline: "Conte o que trava o seu dia.",
    description:
      "Quanto mais concreto for o problema — agenda, WhatsApp, cadastro de cliente, venda — mais direto vem o caminho. Respondemos em até um dia útil.",
  },
  info: [
    { label: "Resposta", value: "Em até um dia útil" },
    { label: "Atendimento", value: "Todo o Brasil, remoto" },
    { label: "Primeiro passo", value: "Diagnóstico sem custo" },
  ],
};
