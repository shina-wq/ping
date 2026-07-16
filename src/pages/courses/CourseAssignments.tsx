import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { CircleCheckBig, FileText, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useIsTeacher } from "@/hooks/use-is-teacher";
import { useCourseAssignments, useDeleteAssignment } from "@/hooks/use-assignments";
import type { Assignment } from "@/api/assignments";
import { AssignmentFormDialog } from "@/components/assignment-form-dialog";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { STATUS_CONFIG } from "@/lib/constants";

export default function CourseAssignments() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const isTeacher = useIsTeacher();

  const { data: assignments, isLoading, error } = useCourseAssignments(courseId ?? "");
  const deleteAssignment = useDeleteAssignment();

  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [deletingAssignment, setDeletingAssignment] = useState<Assignment | null>(null);

  const columns: DataTableColumn<Assignment>[] = [
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
              {/* {a.description && (
                <p className="truncate text-xs text-muted-foreground">{a.description}</p>
              )} */}
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
          {format(new Date(a.dueDate), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      id: "points",
      header: "Points",
      align: "right",
      hideBelow: "sm",
      cell: (a) => <span className="text-sm text-muted-foreground">{a.points} pts</span>,
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

  // Row actions are teacher-only; append conditionally so students never see them.
  if (isTeacher) {
    columns.push({
      id: "actions",
      header: "",
      align: "right",
      cell: (a) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Actions for ${a.title}`}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => setEditingAssignment(a)}>
              <Pencil className="size-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => setDeletingAssignment(a)}>
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    });
  }

  return (
    <div className="max-w-4xl space-y-6">
      {isTeacher && (
        <div className="flex justify-end">
          <AssignmentFormDialog
            courseId={courseId ?? ""}
            trigger={
              <Button>
                <Plus className="size-4" />
                Add Assignment
              </Button>
            }
          />
        </div>
      )}

      <Card className="p-0 shadow-xs">
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={assignments ?? []}
            getRowId={(a) => a.id}
            onRowClick={(a) => navigate(`/assignments/${a.id}`)}
            isLoading={isLoading}
            skeletonRowCount={4}
            error={error ? "Failed to load assignments. Please try again." : null}
            emptyMessage="No assignments have been added to this course yet."
          />
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <AssignmentFormDialog
        courseId={courseId ?? ""}
        assignment={editingAssignment ?? undefined}
        open={!!editingAssignment}
        onOpenChange={(next) => !next && setEditingAssignment(null)}
      />

      {/* Delete confirm */}
      <ConfirmDeleteDialog
        open={!!deletingAssignment}
        onOpenChange={(next) => !next && setDeletingAssignment(null)}
        title="Delete Assignment"
        description={`This will permanently delete "${deletingAssignment?.title}" and all its submissions. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!deletingAssignment) return;
          await deleteAssignment.mutateAsync(deletingAssignment.id);
          toast.success("Assignment deleted.");
        }}
      />
    </div>
  );
}