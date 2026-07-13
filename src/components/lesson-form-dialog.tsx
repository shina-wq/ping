import type { ReactNode } from "react";
import { toast } from "sonner";

import type { Lesson } from "@/api/modules";
import { useAddLesson, useUpdateLesson } from "@/hooks/use-modules";
import { ResourceFormDialog } from "@/components/resource-form-dialog";
import { lessonSchema } from "@/utils/lessonSchema";

const TYPE_OPTIONS = [
  { value: "video", label: "Video" },
  { value: "reading", label: "Reading" },
  { value: "quiz", label: "Quiz" },
];

type LessonFormDialogProps = {
  trigger?: ReactNode;
  courseId: string;
  moduleId: string;
  lesson?: Lesson;
  defaultOrder?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function LessonFormDialog({
  trigger,
  courseId,
  moduleId,
  lesson: existingLesson,
  defaultOrder = 1,
  open,
  onOpenChange,
}: LessonFormDialogProps) {
  const addLesson = useAddLesson();
  const updateLesson = useUpdateLesson();
  const isEdit = !!existingLesson;

  return (
    <ResourceFormDialog
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Lesson" : "Add Lesson"}
      description={
        isEdit
          ? "Update this lesson's details."
          : "Create a new lesson for this module."
      }
      schema={lessonSchema}
      defaultValues={{
        title:       existingLesson?.title       ?? "",
        type:        existingLesson?.type        ?? "video",
        duration:    existingLesson?.duration    ?? "",
        order:       String(existingLesson?.order ?? defaultOrder),
        description: existingLesson?.description ?? "",
        overview:    existingLesson?.overview    ?? "",
      }}
      submitLabel={isEdit ? "Save Changes" : "Create Lesson"}
      fields={[
        {
          name: "title",
          label: "Lesson title",
          placeholder: "Introduction to Variables",
          required: true,
        },
        {
          name: "type",
          label: "Type",
          type: "select",
          placeholder: "Select a type",
          options: TYPE_OPTIONS,
          required: true,
        },
        {
          name: "duration",
          label: "Duration",
          placeholder: "8 min",
          required: true,
        },
        {
          name: "order",
          label: "Order",
          placeholder: "1",
          type: "number",
          required: true,
        },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          placeholder: "Brief description shown to students.",
          required: true,
        },
        {
          name: "overview",
          label: "Overview",
          type: "textarea",
          placeholder: "Detailed overview of what this lesson covers.",
          required: true,
        },
      ]}
      onSubmit={async (data) => {
        const input = {
          title:       data.title,
          type:        data.type,
          duration:    data.duration,
          order:       Number(data.order),
          description: data.description,
          overview:    data.overview,
        };

        if (isEdit) {
          await updateLesson.mutateAsync({ lessonId: existingLesson.id, input });
          toast.success("Lesson updated.");
        } else {
          await addLesson.mutateAsync({ courseId, moduleId, input });
          toast.success("Lesson created.");
        }
      }}
    />
  );
}
