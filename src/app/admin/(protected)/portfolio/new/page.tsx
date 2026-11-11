import { PortfolioForm } from "@/components/admin/portfolio-form";

export default function NewPortfolioProjectPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium text-foreground">New project</h1>
        <p className="text-sm text-muted-foreground">This will appear on the public work page once published.</p>
      </div>
      <PortfolioForm />
    </div>
  );
}
