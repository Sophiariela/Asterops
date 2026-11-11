import { ServiceForm } from "@/components/admin/service-form";

export default function NewServicePage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium text-foreground">New service</h1>
        <p className="text-sm text-muted-foreground">This will appear on the public services page once published.</p>
      </div>
      <ServiceForm />
    </div>
  );
}
