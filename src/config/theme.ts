/**
 * Canonical Aster design tokens.
 *
 * This file is the source of truth for brand values used outside CSS
 * (OG image generation, theme-color meta, future design-system exports).
 * The same values are mirrored as HSL CSS variables in `src/app/globals.css`
 * for Tailwind — keep the two in sync when changing the palette.
 */
export const theme = {
  colors: {
    dark: {
      background: "#0A0A0C",
      surface: "#111214",
      border: "#1D1E22",
      foreground: "#F5F6F8",
      mutedForeground: "#9A9CA6",
      accent: "#4F46E5",
      accentForeground: "#FFFFFF",
    },
    light: {
      background: "#FFFFFF",
      surface: "#F7F7F8",
      border: "#E5E5E8",
      foreground: "#0E0E10",
      mutedForeground: "#65656C",
      accent: "#4F46E5",
      accentForeground: "#FFFFFF",
    },
  },
  fonts: {
    sans: "Geist",
    mono: "Geist Mono",
  },
  radius: "0.625rem",
  maxWidth: "1280px",
} as const;

export type Theme = typeof theme;
