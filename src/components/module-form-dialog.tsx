import type { ReactNode } from "react";
import { toast } from "sonner";

import type { CourseModule } from "@/api/modules";
import { useAddModule, useUpdateModule } from "@/hooks/use-modules";
import { ResourceFormDialog } from "@/components/resource-form-dialog";
import { moduleSchema } from "@/utils/moduleSchema";

type ModuleFormDialogProps = {
  trigger?: ReactNode;
  courseId: string;
  module?: CourseModule;
  defaultOrder?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ModuleFormDialog({
  trigger,
  courseId,
  module: existingModule,
  defaultOrder = 1,
  open,
  onOpenChange,
}: ModuleFormDialogProps) {
  const addModule = useAddModule();
  const updateModule = useUpdateModule();
  const isEdit = !!existingModule;

  return (
    <ResourceFormDialog
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Edit Module" : "Add Module"}
      description={isEdit ? "Update this module's details." : "Create a new module for this course."}
      schema={moduleSchema}
      defaultValues={{
        title: existingModule?.title ?? "",
        order: String(existingModule?.order ?? defaultOrder),
      }}
      submitLabel={isEdit ? "Save Changes" : "Create Module"}
      fields={[
        { name: "title", label: "Module title", placeholder: "Algebra Fundamentals", required: true },
        { name: "order", label: "Order", placeholder: "1", type: "number", required: true },
      ]}
      onSubmit={async (data) => {
        const input = { title: data.title, order: Number(data.order) };

        if (isEdit) {
          await updateModule.mutateAsync({ courseId, moduleId: existingModule.id, input });
          toast.success("Module updated.");
        } else {
          await addModule.mutateAsync({ courseId, input });
          toast.success("Module created.");
        }
      }}
    />
  );
}