import type { ReactNode } from "react";
import { toast } from "sonner";

import type { Assignment } from "@/api/assignments";
import { useAddAssignment, useUpdateAssignment } from "@/hooks/use-assignments";
import { ResourceFormDialog } from "@/components/resource-form-dialog";
import { assignmentSchema } from "@/utils/assignmentSchema";

const SUBMISSION_TYPE_OPTIONS = [
  { value: "file_upload", label: "File Upload" },
  { value: "text", label: "Text Entry" },
  { value: "link", label: "Link" },
];

type AssignmentFormDialogProps = {
  trigger?: ReactNode;
  courseId: string;
  assignment?: Assignment;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function toLocalInputValue(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function AssignmentFormDialog({
  trigger,
  courseId,
  assignment: existing,
  open,
  onOpenChange,
}: AssignmentFormDialogProps) {
  const addAssignment = useAddAssignment();
  const updateAssignment = useUpdateAssignment();
  const isEdit = !!existing;

  return (
    <ResourceFormDialog
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Assignment" : "Add Assignment"}
      description={
        isEdit ? "Update this assignment's details." : "Create a new assignment for this course."
      }
      schema={assignmentSchema}
      defaultValues={{
        title: existing?.title ?? "",
        description: existing?.description ?? "",
        dueDate: toLocalInputValue(existing?.dueDate),
        points: existing ? String(existing.points) : "",
        submissionType: existing?.submissionType ?? "file_upload",
      }}
      submitLabel={isEdit ? "Save Changes" : "Create Assignment"}
      fields={[
        { name: "title", label: "Assignment title", placeholder: "Problem Set 4", required: true },
        { name: "description", label: "Description", type: "textarea", placeholder: "What should students do?" },
        { name: "dueDate", label: "Due date", type: "date", required: true },
        { name: "points", label: "Points", placeholder: "100", type: "number", required: true },
        {
          name: "submissionType",
          label: "Submission type",
          type: "select",
          options: SUBMISSION_TYPE_OPTIONS,
          required: true,
        },
      ]}
      onSubmit={async (data) => {
        const input = {
          title: data.title,
          description: data.description || undefined,
          dueDate: new Date(data.dueDate).toISOString(),
          points: Number(data.points),
          submissionType: data.submissionType,
        };

        if (isEdit) {
          await updateAssignment.mutateAsync({ id: existing.id, input });
          toast.success("Assignment updated.");
        } else {
          await addAssignment.mutateAsync({ courseId, input });
          toast.success("Assignment created.");
        }
      }}
    />
  );
}