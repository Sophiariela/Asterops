import { SettingsForm } from "@/components/admin/settings-form";
import { getSiteSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-medium text-foreground">Site settings</h1>
        <p className="text-sm text-muted-foreground">Changes here reflect immediately on the public website.</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
