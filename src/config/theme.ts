/**
 * Tokens canônicos da Aster.
 *
 * Fonte de verdade dos valores de marca usados fora do CSS (geração da
 * imagem de Open Graph, meta theme-color, ícone). Os mesmos valores estão
 * espelhados como variáveis HSL em `src/app/globals.css` para o Tailwind —
 * mudou um lado, muda o outro.
 *
 * `accentInk` é o acento em TEXTO; `accent` é o acento em SUPERFÍCIE. Ver
 * a nota de contraste em globals.css antes de trocar um pelo outro.
 */
export const theme = {
  colors: {
    dark: {
      background: "#0A0A0C",
      surface: "#111113",
      border: "#242428",
      foreground: "#F0EFEB",
      mutedForeground: "#A1A1A9",
      accent: "#C9813A",
      accentInk: "#D9994F",
      accentForeground: "#17130C",
    },
    light: {
      background: "#FFFFFF",
      surface: "#FAF9F7",
      border: "#E5E2DC",
      foreground: "#141416",
      mutedForeground: "#6A6A72",
      accent: "#9F6C2D",
      accentInk: "#80501D",
      accentForeground: "#FFFFFF",
    },
  },
  fonts: {
    sans: "Geist",
    mono: "Geist Mono",
  },
  radius: "0.5rem",
  maxWidth: "1280px",
} as const;

export type Theme = typeof theme;
