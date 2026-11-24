import {
  AppWindow,
  BarChart3,
  Bot,
  Boxes,
  CalendarCheck,
  Code2,
  Globe,
  KanbanSquare,
  LayoutDashboard,
  LayoutPanelLeft,
  MessageCircle,
  Plug,
  RefreshCw,
  Rocket,
  ShoppingCart,
  Sparkles,
  Target,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

/**
 * Ícones disponíveis para categoria e solução.
 *
 * O nome é gravado no banco como texto, então o painel só pode escolher
 * entre as chaves daqui — `serviceIconNames` alimenta o select do formulário
 * e `getServiceIcon` cai em `Sparkles` se o nome não existir mais.
 */
const registry: Record<string, LucideIcon> = {
  Globe,
  Target,
  ShoppingCart,
  AppWindow,
  Users,
  CalendarCheck,
  BarChart3,
  KanbanSquare,
  Boxes,
  Workflow,
  MessageCircle,
  Plug,
  Bot,
  Code2,
  Rocket,
  RefreshCw,
  LayoutDashboard,
  LayoutPanelLeft,
  Sparkles,
};

export function getServiceIcon(name: string): LucideIcon {
  return registry[name] ?? Sparkles;
}

export const serviceIconNames = Object.keys(registry);
