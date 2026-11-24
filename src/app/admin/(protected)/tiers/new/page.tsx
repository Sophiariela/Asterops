import { TierForm } from "@/components/admin/tier-form";

export default function NewTierPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium text-foreground">New tier</h1>
        <p className="text-sm text-muted-foreground">
          Appears on the public site as soon as it is published.
        </p>
      </div>
      <TierForm />
    </div>
  );
}
