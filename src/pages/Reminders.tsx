import { usePageHeader } from "@/components/page-header-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock3 } from "lucide-react";

export default function Reminders() {
  usePageHeader({
    title: "Reminders",
    description: "Manage tasks, deadlines, and study reminders.",
  });

  return (
    <div className="w-full min-w-0 space-y-6">
      <Card className="shadow-xs">
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
            <Clock3 className="size-5" />
          </div>
          <CardTitle className="text-lg font-semibold">Study Tasks & Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This page will display study checklists, exams, and personal events calendars.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
