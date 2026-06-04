import { usePageHeader } from "@/components/page-header-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export default function Notifications() {
  usePageHeader({
    title: "Notifications",
    description: "View important updates, assignments reminders, and platform alerts.",
  });

  return (
    <div className="w-full min-w-0 space-y-6">
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bell className="size-5" />
          </div>
          <CardTitle className="text-lg font-semibold">Notification Center</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This page will display notifications regarding course announcements, assignment due dates, and grading updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
