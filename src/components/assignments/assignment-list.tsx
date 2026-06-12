import { format } from "date-fns";

import { AssignmentRow } from "@/components/assignments/assignment-row";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG } from "@/lib/constants";
import type { Assignment, AssignmentStatus } from "@/api/assignments";

const PENDING_STATUSES: AssignmentStatus[] = [
  "upcoming",
];

type AssignmentListProps = {
  assignments: Assignment[];
  emptyMessage?: string;
};

export function AssignmentList({ assignments, emptyMessage = "No assignments found." }: AssignmentListProps) {
  if (!assignments.length) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  const pending = assignments.filter((a) => PENDING_STATUSES.includes(a.status));
  const submitted = assignments.filter((a) => !PENDING_STATUSES.includes(a.status));

  const renderGroup = (title: string, group: Assignment[], badgeClass: string) => {
    if (!group.length) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <Badge variant="secondary" className={`rounded-full px-1.5 py-0 text-[10px] font-medium border-0 ${badgeClass}`}>
            {group.length}
          </Badge>
        </div>
        <Card className="shadow-xs border border-border/50 p-0">
          <CardContent className="p-0 divide-y divide-border/50">
            {group.map((a) => {
              const config = STATUS_CONFIG[a.status];

              return (
                <div key={a.id} className="p-4 sm:px-6">
                  <AssignmentRow
                    id={a.id}
                    title={a.title}
                    course={a.courseName}
                    due={format(new Date(a.dueDate), "MMM d")}
                    status={config.label}
                    statusClass={config.className}
                    isSubmitted={a.status === "submitted" || a.status === "graded"}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {renderGroup("Pending", pending, "bg-rose-500/10 text-rose-500")}
      {renderGroup("Submitted & Graded", submitted, "bg-emerald-500/10 text-emerald-500")}
    </div>
  );
}
