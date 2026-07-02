// src/components/assignments/assignment-list.tsx
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CircleCheckBig, FileText } from "lucide-react";

import { AssignmentCard } from "@/components/assignment-row";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { STATUS_CONFIG } from "@/lib/constants";
import type { Assignment, AssignmentStatus } from "@/api/assignments";

const PENDING_STATUSES: AssignmentStatus[] = [
  "upcoming",
  "due_soon",
  "due_tomorrow",
  "overdue",
];

type AssignmentListProps = {
  assignments: Assignment[];
  emptyMessage?: string;
  view?: "card" | "list";
};

function useAssignmentColumns(): DataTableColumn<Assignment>[] {
  return [
    {
      id: "title",
      header: "Assignment",
      cell: (a) => {
        const isSubmitted = a.status === "submitted" || a.status === "graded";
        const Icon = isSubmitted ? CircleCheckBig : FileText;
        return (
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{a.title}</p>
              <p className="truncate text-xs text-muted-foreground">{a.courseName}</p>
            </div>
          </div>
        );
      },
    },
    {
      id: "due",
      header: "Due",
      hideBelow: "sm",
      cell: (a) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(a.dueDate), "MMM d")}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      align: "right",
      cell: (a) => {
        const config = STATUS_CONFIG[a.status] || STATUS_CONFIG.upcoming;
        return (
          <Badge className={`rounded-full px-2.5 py-1 text-xs ${config.className}`}>
            {config.label}
          </Badge>
        );
      },
    },
  ];
}

export function AssignmentList({ assignments, emptyMessage = "No assignments found.", view = "card" }: AssignmentListProps) {
  const navigate = useNavigate();
  const columns = useAssignmentColumns();

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

        {view === "card" ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.map((a) => {
              const config = STATUS_CONFIG[a.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.upcoming;
              return (
                <AssignmentCard
                  key={a.id}
                  id={a.id}
                  title={a.title}
                  course={a.courseName}
                  due={format(new Date(a.dueDate), "MMM d")}
                  status={config.label}
                  statusClass={config.className}
                  isSubmitted={a.status === "submitted" || a.status === "graded"}
                />
              );
            })}
          </div>
        ) : (
          <Card className="p-0 shadow-xs">
            <CardContent className="px-0 py-0">
              <DataTable
                columns={columns}
                data={group}
                getRowId={(a) => a.id}
                onRowClick={(a) => navigate(`/assignments/${a.id}`)}
              />
            </CardContent>
          </Card>
        )}
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