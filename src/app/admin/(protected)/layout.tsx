import { AdminNav } from "@/components/admin/admin-nav";
import { Logo } from "@/components/shared/logo";

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
