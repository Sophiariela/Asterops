import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Animação de entrada por scroll, com regras.
 *
 * O problema antes: cada seção trazia `whileInView` com duração de 0.6–0.7s,
 * delay encadeado e viewport padrão, então título e texto ficavam
 * invisíveis por quase um segundo depois de já estarem na tela.
 *
 * As regras aqui:
 *  - duração máxima de 350ms, sem delay acumulado acima de 120ms;
 *  - `margin` generosa, para começar antes de o elemento entrar na tela;
 *  - `amount` baixíssimo, para disparar com qualquer pedaço visível;
 *  - `prefers-reduced-motion` desliga tudo e renderiza no estado final.
 *
 * Conteúdo primário — H2 de seção e o parágrafo de apoio — NÃO usa este
 * componente. Esse texto é o que o visitante veio ler e aparece direto.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Em segundos. Mantido curto de propósito; o máximo aplicado é 0.12s. */
  delay?: number;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.01, margin: '0px 0px 240px 0px' }}
      transition={{ duration: 0.35, delay: Math.min(delay, 0.12), ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
