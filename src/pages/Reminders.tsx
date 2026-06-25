import { Clock3, FileText, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { usePageHeader } from "@/components/page-header-context";
import { useReminders, useDismissReminder } from "@/hooks/use-reminders";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function RemindersSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 rounded-2xl border p-4">
          <Skeleton className="size-10 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      ))}
    </>
  );
}

export default function Reminders() {
  usePageHeader({
    title: "Reminders",
    description: "Stay on top of your upcoming deadlines.",
  });

  const { data: reminders, isLoading, error } = useReminders();
  const dismiss = useDismissReminder();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const filteredReminders = (reminders || []).filter(r =>
    r.title.toLowerCase().includes(query) || r.detail.toLowerCase().includes(query)
  );

  if (isLoading) {
    return <div className="space-y-3"><RemindersSkeleton /></div>;
  }

  if (error) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Failed to load reminders. Please try again.
      </p>
    );
  }

  if (!filteredReminders?.length) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No active reminders — you're on top of everything!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {filteredReminders.map((reminder) => {
        const Icon = reminder.isUrgent ? Clock3 : FileText;
        const accent = reminder.isUrgent
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground";

        return (
          <div
            key={reminder.id}
            className={cn(
              "flex items-start gap-3 rounded-2xl border p-4 transition-colors",
              reminder.isUrgent
                ? "border-primary/10 bg-primary/10"
                : "border-border bg-background hover:bg-muted/50"
            )}
          >
            <div className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl",
              accent
            )}>
              <Icon className="size-4" />
            </div>

            <div className="min-w-0 flex-1">
              <p className={cn(
                "text-sm font-semibold",
                reminder.isUrgent ? "text-primary" : "text-foreground"
              )}>
                {reminder.title}
              </p>
              <p className="text-xs text-muted-foreground">{reminder.detail}</p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={() => dismiss.mutate(reminder.id)}
              disabled={dismiss.isPending}
              aria-label="Dismiss reminder"
            >
              <X className="size-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}