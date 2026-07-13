import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { ReactNode } from "react";

import type { Course } from "@/api/courses";
import { useAddCourse, useUpdateCourse } from "@/hooks/use-courses";
import { ResourceFormDialog } from "@/components/resource-form-dialog";
import { addCourseSchema } from "@/utils/courseSchema";

type CourseFormDialogProps = {
  trigger?: ReactNode;
  course?: Course; // presence switches create -> edit
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function CourseFormDialog({ trigger, course, open, onOpenChange }: CourseFormDialogProps) {
  const addCourse = useAddCourse();
  const updateCourse = useUpdateCourse();
  const navigate = useNavigate();
  const isEdit = !!course;

  return (
    <ResourceFormDialog
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Course" : "Add Course"}
      description={
        isEdit
          ? "Update this course's details."
          : "Create a new course and start building out the class workspace."
      }
      schema={addCourseSchema}
      defaultValues={{
        title: course?.title ?? "",
        term: course?.term ?? "",
        year: course?.year ? String(course.year) : "",
        status: course?.status ?? "active",
      }}
      submitLabel={isEdit ? "Save Changes" : "Create Course"}
      fields={[
        { name: "title", label: "Course title", placeholder: "Mathematics 101", required: true },
        { name: "term", label: "Term", placeholder: "Fall", required: true },
        { name: "year", label: "Year", placeholder: "2024", required: true },
        {
          name: "status",
          label: "Status",
          type: "select",
          required: true,
          options: [
            { value: "active", label: "Active" },
            { value: "completed", label: "Completed" },
            { value: "archived", label: "Archived" },
          ],
        },
      ]}
      onSubmit={async (data) => {
        const input = {
          title: data.title,
          term: data.term || undefined,
          year: data.year ? Number(data.year) : undefined,
          status: data.status,
        };

        if (isEdit) {
          await updateCourse.mutateAsync({ id: course.id, input });
          toast.success("Course updated.");
        } else {
          const created = await addCourse.mutateAsync(input);
          navigate(`/courses/${created.id}`);
        }
      }}
    />
  );
}