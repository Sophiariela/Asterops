import { AdminNav } from "@/components/admin/admin-nav";
import { Logo } from "@/components/shared/logo";

/**
 * O painel nunca é pré-renderizado.
 *
 * São páginas atrás de sessão que precisam refletir o banco no momento do
 * acesso: lista de pedido, nível, serviço e projeto mudam pelo próprio
 * painel. Gerar estático no build deixaria o administrador olhando dado
 * congelado — e ainda exigiria banco de pé na hora de compilar.
 */
export const dynamic = "force-dynamic";

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 flex-col border-r border-border/60 sm:flex">
        <div className="border-b border-border/60 p-4">
          <Logo />
        </div>
        <AdminNav />
      </aside>
      <main className="flex-1 overflow-x-hidden px-6 py-10 sm:px-10">{children}</main>
    </div>
  );
}
