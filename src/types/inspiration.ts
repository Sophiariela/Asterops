import type { LucideIcon } from "lucide-react";

/**
 * Design Inspirations — visual references that demonstrate the level of design
 * and execution available from Aster. These are not products, not templates,
 * and not for sale: each entry is a design direction that can inform a future,
 * custom-built client project.
 *
 * "live" entries point at a real, browsable experience (`demoUrl` + `image`).
 * "concept" entries describe a direction Aster can execute without yet having
 * a live reference — they render without a "View Experience" action.
 */
export type InspirationStatus = "live" | "concept";

export interface DesignInspiration {
  slug: string;
  name: string;
  category: string;
  description: string;
  status: InspirationStatus;
  /** Used as the card's placeholder mark when there is no `image` yet. */
  icon: LucideIcon;
  /** A representative visual — required in practice once `status` is "live". */
  image?: string;
  /** A real, browsable experience. Only set once `status` is "live". */
  demoUrl?: string;
}

export interface DesignInspirationsContent {
  eyebrow: string;
  title: string;
  description: string;
  liveLabel: string;
  conceptLabel: string;
  /** Sits under the grid — states plainly that these aren't products for sale. */
  disclaimer: string;
}
