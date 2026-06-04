import { usePageHeader } from "@/components/page-header-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  usePageHeader({
    title: "Settings",
    description: "Customize your user profile, preferences, and theme choices.",
  });

  return (
    <div className="w-full min-w-0 space-y-6">
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gray-500/10 text-gray-600">
            <SettingsIcon className="size-5" />
          </div>
          <CardTitle className="text-lg font-semibold">User Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This page will display settings for customizing notifications, themes (Light / Dark mode), and user profile values.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
