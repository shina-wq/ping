import { Link } from "react-router-dom";
import { CircleCheckBig, FileText, ArrowUpRight } from "lucide-react";
import { differenceInCalendarDays, format } from "date-fns";

import type { Assignment, AssignmentStatus } from "@/api/assignments";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {Card} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Types
export type AssignmentRow = {
  id: string;
  title: string;
  course: string;
  due: string;
  status: string;
  statusClass: string;
  isSubmitted: boolean;
};

type DisplayStatus =
  | "upcoming"
  | "overdue"
  | "submitted"
  | "graded";

const STATUS_CONFIG: Record<DisplayStatus, { label: string; className: string }> = {
  upcoming: { label: "Upcoming", className: "bg-sky-500/10 text-sky-500" },
  overdue: { label: "Overdue", className: "bg-red-600/10 text-red-600" },
  submitted: { label: "Submitted", className: "bg-emerald-500/10 text-emerald-600" },
  graded: { label: "Graded", className: "bg-emerald-500/10 text-emerald-600" },
};

// Helpers
function getDisplayStatus(status: AssignmentStatus, dueDate: string): DisplayStatus {
  // Submitted and graded statuses take precedence over date logic.
  if (status !== "upcoming") return status;

  const daysUntilDue = differenceInCalendarDays(new Date(dueDate), new Date());

  if (daysUntilDue < 0)  return "overdue";
  return "upcoming";
}

// Mapper
export function mapAssignment(a: Assignment): AssignmentRow {
  const displayStatus = getDisplayStatus(a.status, a.dueDate);
  const config = STATUS_CONFIG[displayStatus];

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
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{course}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-xs text-muted-foreground">{due}</span>
        <Badge className={cn("rounded-full px-2.5 py-1 text-xs", statusClass)}>
          {status}
        </Badge>
      </div>
    </div>
  );
}

export function AssignmentCard({id, title, course, due, status, statusClass, isSubmitted}: AssignmentRow) {
  const Icon = isSubmitted ? CircleCheckBig : FileText;

  return (
    <Link to={`/assignments/${id}`} className="block">
    <Card className="min-w-0 overflow-hidden p-0 shadow-xs">
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        {/* Header (icon + status) */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5"/>
          </div>
          <Badge className={cn("rounded-full px-2.5 py-1 text-xs", statusClass)}>
            {status}
          </Badge>
        </div>

        {/* Title + course */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground leading-snug">
            {title}
          </p>
          <p className="text-xs text-muted-foreground">
            {course}
          </p>
        </div>

        {/* Footer: due date */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
              Due <span className="font-medium text-foreground">{due}</span>
          </span>
        </div>
      </div>
    </Card>
    </Link>
  );
}

export function AssignmentCardSkeleton({count = 6}: {count?:number}) {
  return (
    <>
    {Array.from({length: count}).map((_, i) => (
      <Card key={i} className="min-w-0 overflow-hidden p-0 shadow-xs">
        <div className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex items-start justify-between">
            <Skeleton className="size-10 rounded-xl"/>
            <Skeleton className="h-6 w-20 rounded-full"/>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-36"/>
            <Skeleton className="h-3 w-24"/>
          </div>
          <Skeleton  className="h-3 w-20"/>
        </div>
      </Card>
    ))}
      
      </>
  );
}

// Skeleton
export function AssignmentRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
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