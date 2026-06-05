import { CircleCheckBig, FileText } from "lucide-react";
import { format } from "date-fns";

import { usePageHeader } from "@/components/page-header-context";
import { useAssignments } from "@/hooks/use-assignments";
import type { AssignmentStatus } from "@/api/assignments";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// ─── Status config ────────────────────────────────────────────────────────────
// TODO (Phase 5): consolidate with Dashboard's copy into a shared constant.

const STATUS_CONFIG: Record<AssignmentStatus, { label: string; className: string }> = {
  upcoming:     { label: "Upcoming",     className: "bg-sky-500/10 text-sky-500" },
  due_soon:     { label: "Due Soon",     className: "bg-primary/10 text-primary" },
  due_tomorrow: { label: "Due Tomorrow", className: "bg-rose-500/10 text-rose-500" },
  overdue:      { label: "Overdue",      className: "bg-red-600/10 text-red-600" },
  submitted:    { label: "Submitted",    className: "bg-emerald-500/10 text-emerald-600" },
  graded:       { label: "Graded",       className: "bg-emerald-500/10 text-emerald-600" },
};

const PENDING_STATUSES: AssignmentStatus[] = [
  "upcoming",
  "due_soon",
  "due_tomorrow",
  "overdue",
];

// ─── Skeletons ────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
          <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

// ─── Assignment table ─────────────────────────────────────────────────────────

type AssignmentTableProps = {
  assignments: NonNullable<ReturnType<typeof useAssignments>["data"]>;
  emptyMessage: string;
};

function AssignmentTable({ assignments, emptyMessage }: AssignmentTableProps) {
  if (!assignments.length) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">{emptyMessage}</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Assignment</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((a) => {
          const config = STATUS_CONFIG[a.status];
          const isSubmitted = a.status === "submitted" || a.status === "graded";
          const Icon = isSubmitted ? CircleCheckBig : FileText;

          return (
            <TableRow key={a.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.courseName}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(a.dueDate), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <Badge className={cn("rounded-full px-2.5 py-1 text-xs", config.className)}>
                  {config.label}
                </Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Assignments() {
  usePageHeader({
    title: "Assignments",
    description: "Track and manage your upcoming work.",
  });

  const { data, isLoading, error } = useAssignments();

  // Sort by due date ascending (most urgent first).
  const sorted = [...(data ?? [])].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  const pending   = sorted.filter((a) => PENDING_STATUSES.includes(a.status));
  const submitted = sorted.filter((a) => !PENDING_STATUSES.includes(a.status));

  return (
    <Tabs defaultValue="all">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">
          Pending
          {pending.length > 0 && (
            <Badge className="ml-1.5 rounded-full px-1.5 py-0 text-[10px] bg-rose-500/10 text-rose-500">
              {pending.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="submitted">Submitted</TabsTrigger>
      </TabsList>

      <Card className="p-0 py-0 shadow-xs">
        <CardContent className="px-0 py-0">
          {isLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody><TableSkeleton /></TableBody>
            </Table>
          ) : error ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Failed to load assignments. Please try again.
            </p>
          ) : (
            <>
              <TabsContent value="all" className="mt-0">
                <AssignmentTable assignments={sorted} emptyMessage="No assignments found." />
              </TabsContent>
              <TabsContent value="pending" className="mt-0">
                <AssignmentTable assignments={pending} emptyMessage="No pending assignments." />
              </TabsContent>
              <TabsContent value="submitted" className="mt-0">
                <AssignmentTable assignments={submitted} emptyMessage="No submitted assignments yet." />
              </TabsContent>
            </>
          )}
        </CardContent>
      </Card>
    </Tabs>
  );
}