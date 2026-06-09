import { Clock3, FileText } from "lucide-react";

import type { Reminder } from "@/api/reminders";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// View-model type
export type ReminderCard = {
  id: string;
  title: string;
  detail: string;
  isUrgent: boolean;
};

// Mapper
export function mapReminder(r: Reminder): ReminderCard {
  return {
    id: r.id,
    title: r.title,
    detail: r.detail,
    isUrgent: r.isUrgent,
  };
}

// Component
export function ReminderCard({ title, detail, isUrgent }: ReminderCard) {
  const Icon = isUrgent ? Clock3 : FileText;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-4 transition-colors",
        isUrgent
          ? "border-primary/10 bg-primary/10"
          : "border-border bg-background hover:bg-muted/50"
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          isUrgent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-semibold", isUrgent ? "text-primary" : "text-foreground")}>
          {title}
        </p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

// Skeleton
export function ReminderCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 rounded-2xl border p-4">
          <Skeleton className="size-10 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      ))}
    </>
  );
}