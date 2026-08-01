import { ImageResponse } from "next/og";

import { theme } from "@/config/theme";
import { siteConfig } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: theme.colors.dark.background,
          backgroundImage: `linear-gradient(135deg, ${theme.colors.dark.accent}22 0%, transparent 55%)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              display: "flex",
              width: 40,
              height: 40,
              borderRadius: 8,
              background: `${theme.colors.dark.accent}22`,
              color: theme.colors.dark.accent,
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            *
          </div>
          <div style={{ display: "flex", color: theme.colors.dark.mutedForeground, fontSize: 22, letterSpacing: 4 }}>
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", color: theme.colors.dark.foreground, fontSize: 60, fontWeight: 600, lineHeight: 1.1 }}>
            {siteConfig.tagline}
          </div>
          <div style={{ display: "flex", color: theme.colors.dark.mutedForeground, fontSize: 26, maxWidth: 820 }}>
            {siteConfig.description}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
