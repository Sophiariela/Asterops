import { FaqForm } from "@/components/admin/faq-form";

export default function NewFaqPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium text-foreground">New FAQ entry</h1>
        <p className="text-sm text-muted-foreground">Shown on the home and how-it-works pages.</p>
      </div>
      <FaqForm />
    </div>
  );
}
