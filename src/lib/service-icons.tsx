import {
  Bot,
  CalendarCheck,
  Code2,
  Globe,
  LayoutDashboard,
  LayoutPanelLeft,
  MessageCircle,
  Plug,
  ShoppingCart,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";

const registry: Record<string, LucideIcon> = {
  Globe,
  CalendarCheck,
  MessageCircle,
  LayoutDashboard,
  ShoppingCart,
  Code2,
  Users,
  Plug,
  LayoutPanelLeft,
  Bot,
  Sparkles,
};

export function getServiceIcon(name: string): LucideIcon {
  return registry[name] ?? Sparkles;
}

export const serviceIconNames = Object.keys(registry);
