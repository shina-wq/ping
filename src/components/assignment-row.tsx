import { CircleCheckBig, FileText } from "lucide-react";
import { format } from "date-fns";

import type { Assignment, AssignmentStatus } from "@/api/assignments";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// View-model type

export type AssignmentRow = {
  id: string;
  title: string;
  course: string;
  due: string;
  status: string;
  statusClass: string;
  isSubmitted: boolean;
};

const STATUS_CONFIG: Record<AssignmentStatus, { label: string; className: string }> = {
  upcoming: { label: "Upcoming", className: "bg-sky-500/10 text-sky-500" },
  due_soon: { label: "Due Soon", className: "bg-primary/10 text-primary" },
  due_tomorrow: { label: "Due Tomorrow", className: "bg-rose-500/10 text-rose-500" },
  overdue: { label: "Overdue", className: "bg-red-600/10 text-red-600" },
  submitted: { label: "Submitted", className: "bg-emerald-500/10 text-emerald-600" },
  graded: { label: "Graded", className: "bg-emerald-500/10 text-emerald-600" },
};

// Mapper

export function mapAssignment(a: Assignment): AssignmentRow {
  const config = STATUS_CONFIG[a.status];
  return {
    id: a.id,
    title: a.title,
    course: a.courseName,
    due: format(new Date(a.dueDate), "MMM d"),
    status: config.label,
    statusClass: config.className,
    isSubmitted: a.status === "submitted" || a.status === "graded",
  };
}

// Component

export function AssignmentRow({ title, course, due, status, statusClass, isSubmitted }: AssignmentRow) {
  const Icon = isSubmitted ? CircleCheckBig : FileText;

  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{course}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-xs text-muted-foreground">{due}</span>
        <Badge className={cn("rounded-full px-2.5 py-1 text-xs", statusClass)}>{status}</Badge>
      </div>
    </div>
  );
}

// Skeleton

export function AssignmentRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <Skeleton className="size-10 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
}