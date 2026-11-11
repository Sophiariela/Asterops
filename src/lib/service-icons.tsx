import {
  Bot,
  Code2,
  Globe,
  LayoutDashboard,
  LayoutPanelLeft,
  ShoppingCart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const registry: Record<string, LucideIcon> = {
  Globe,
  ShoppingCart,
  Code2,
  LayoutPanelLeft,
  LayoutDashboard,
  Bot,
  Sparkles,
};

export function getServiceIcon(name: string): LucideIcon {
  return registry[name] ?? Sparkles;
}

export const serviceIconNames = Object.keys(registry);
