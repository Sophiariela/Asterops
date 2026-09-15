import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Terminal } from 'lucide-react';

export const SITE_PROMPT = `Você é um desenvolvedor front-end sênior. Crie um clone completo e funcional da homepage da ASTER (https://ASTER.com/) em português brasileiro (pt-BR), usando Vite + React + TypeScript + Tailwind CSS v4 + framer-motion + lucide-react.

IDENTIDADE VISUAL
- Fontes: Sora (display/títulos) + Inter (texto), via Google Fonts.
- Paleta: roxo ASTER (claro #e9e3ff até profundo #2c165f, primário #5b2ee5), verde-limão volt (#d8ff3e / #c2ef1f) para destaques e CTAs em fundo escuro, azul-marinho ink (#150b33 / #0d0722) para seções escuras, fundo creme (#faf8ff) alternado com branco.
- Estilo: cantos bem arredondados (rounded-2xl/3xl, botões pill), sombras suaves roxas, glassmorphism no menu, microanimações com framer-motion (fade/slide on scroll), marquee infinito, cards flutuantes, grid de fundo com máscara radial, dot-grid decorativo.

ESTRUTURA DA PÁGINA (nesta ordem)
1. Navbar fixa (sticky): faixa superior escura "Economize até 50% no frete com Envios da ASTER"; menu glass com logo "ASTER." (roxo + ponto lima), links Produtos (mega-dropdown com 8 produtos e ícones), Soluções (dropdown com 12 links), Agentes de IA (badge NOVO), Planos, Ecossistema; botões Login e "Teste grátis" (abre modal); menu mobile hamburger com drawer.
2. Hero: badge "LIS — Onde IA e a sua operação se conectam"; título gigante "O sistema completo do varejo, movido a IA" (gradiente roxo em "movido a IA"); subtítulo; CTAs "Comece agora" + "Ver a Lis funcionando"; selos (30 dias grátis, sem cartão, suporte); mockup de dashboard em janela de browser com KPIs (Receita, Pedidos, Ticket médio), gráfico de barras animado "Vendas por canal" e painel escuro da Lis com chat e prioridades; cards flutuantes (NF-e emitida, etiqueta -42% frete); marquee "Conectado aos maiores canais de venda" (Mercado Livre, TikTok Shop, Shopee, Amazon, Magalu, Shein, Americanas, Netshoes).
3. Seção Lis (fundo ink escuro): selo "Lis da ASTER", título "Não use seu ERP. Comande."; 4 abas auto-rotativas a cada 6s com barra de progresso e play/pause (Operação, Inteligência, Vendas, Financeiro), cada uma com prompt "Você pede" e resposta "A Lis entrega" + pills de resultado; faixa "Mais de 63 mil clientes confiam na ASTER" com 5 estrelas.
4. Ecossistema: título "Um ecossistema único, com tudo o que o seu negócio precisa"; 2 cards largos (Hub de Integração escuro com +170 integrações; Ecommerce claro com stats); grid com 4 produtos (ERP, PDV com foto, Envios com foto, Financeiras) cada um com ícone, features com check, box "Com a Lis" e CTA; faixa marquee de meios de pagamento (Pix, Boleto, Link de Pagamento, Maquininha no Celular, Multiadquirentes, Pagamento Online).
5. Segmentos: título "Não importa o seu segmento..."; carrossel horizontal com snap + setas (Moda, Cosméticos, Autopeças, Casa e decoração, Celular e acessórios, Construção) com fotos, estrelas e CTA.
6. Cases: card grande com foto, botão play, badge de métrica (+212%, -78%, -46%), citação, nome/cargo, dots para trocar entre 3 depoimentos; painel escuro "Negócios que vão longe não vão sozinhos" com stats (+63 mil clientes, +170 mil vendas/hora, +194 mi NFs) e CTA lima.
7. Planos: toggle Mensal/Anual (-20%), 3 planos (Essencial R$79/63, Crescimento R$149/119 destacado em escuro com badge "MAIS ESCOLHIDO", Empresas R$349/279) com features e CTA.
8. FAQ: acordeão animado com 6 perguntas (teste grátis, Lis, marketplaces, frete, NFs, suporte).
9. CTA final: banner gradiente roxo com foto, card de receita flutuante e depoimento.
10. Footer escuro: logo, descrição, redes sociais, 2 cards de acesso (Sistema / Ecommerce), 5 colunas de links, endereço "Avenida João Gualberto, n° 1.698, Curitiba/PR", copyright 2026.
11. Modal de cadastro "Crie sua conta grátis" (aberto por TODOS os CTAs): campos CNPJ com máscara 00.000.000/0000-00, CEP com máscara, seletor de volume de pedidos/mês, validação com mensagens de erro, tela de sucesso com check animado e mensagem da Lis.

REQUISITOS TÉCNICOS
- Componentes separados em src/components/ (Navbar, Hero, LisSection, Ecosystem, Segments, Cases, Pricing, Faq, FinalCta, Footer, SignupModal) + App.tsx com estado do modal compartilhado via prop onCta.
- Tailwind v4 com @theme (cores ASTER/volt/ink/mint/cream, fontes, keyframes marquee/float/pulse-ring/typing-dot) e utilitários customizados em src/index.css.
- index.html em pt-BR com title "ASTER — O sistema completo do varejo, movido a IA" + favicon.svg próprio (quadrado roxo com "o" branco e ponto lima).
- Totalmente responsivo (mobile-first), sem placeholders, sem TODOs, todo botão funcional; build com "npm run build" sem erros.`;

export default function PromptSection() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="prompt" className="py-16 sm:py-24 bg-cream-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 bg-white border border-ASTER-200 rounded-full px-4 py-1.5 text-sm font-semibold text-ASTER-700 card-shadow-sm">
            <Terminal size={15} /> Prompt completo
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-ink-900 mt-5">
            O prompt que gerou este site
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-4">
            Copie e use em qualquer IA para recriar este clone da ASTER do zero.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 bg-ink-950 rounded-[28px] overflow-hidden card-shadow"
        >
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-xs text-white/50 font-mono hidden sm:block">prompt-ASTER-clone.txt</span>
            </div>
            <button
              onClick={copy}
              className={`flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all ${
                copied ? 'bg-emerald-400 text-ink-950' : 'bg-volt-400 hover:bg-volt-300 text-ink-950'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copiado!' : 'Copiar prompt'}
            </button>
          </div>
          <pre className="text-white/85 text-[13px] sm:text-sm leading-relaxed p-5 sm:p-7 whitespace-pre-wrap font-mono max-h-[520px] overflow-y-auto">
            {SITE_PROMPT}
          </pre>
        </motion.div>
      </div>
    </section>
  );
}
