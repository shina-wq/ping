import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Check, Clock10, MoreHorizontal, Pencil, Plus, Trash2, Layers } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth-context";
import { useModules, useDeleteModule } from "@/hooks/use-modules";
import type { CourseModule } from "@/api/modules";
import { ModuleFormDialog } from "@/components/module-form-dialog";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function CourseModulesSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="flex flex-row items-center justify-between p-6 shadow-sm">
          <div className="flex items-center gap-6">
            <Skeleton className="size-12 shrink-0 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="size-6 rounded" />
        </Card>
      ))}
    </div>
  );
}

function ModuleStatusIcon({completed, isTeacher}: {completed: boolean; isTeacher: boolean}) {
  if (isTeacher) {
    return (
      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Layers className="size-5" strokeWidth={2.5}/>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-full",
        completed ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
      )}
    >
      {completed ? <Check className="size-5" strokeWidth={2.5} /> : <Clock10 className="size-5" strokeWidth={2.5} />}
    </div>
  )
}

export default function CourseModules() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";
  const navigate = useNavigate();

  const { data: modules, isLoading, error } = useModules(courseId ?? "");
  const deleteModule = useDeleteModule();

  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [deletingModule, setDeletingModule] = useState<CourseModule | null>(null);

  if (isLoading) {
    return (
      <div className="max-w-3xl">
        <CourseModulesSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Failed to load modules. Please try again.
      </p>
    );
  }

  return (
    <div className="max-w-3xl">
      {isTeacher && (
        <div className="mb-6 flex justify-end">
          <ModuleFormDialog
            courseId={courseId ?? ""}
            defaultOrder={(modules?.length ?? 0) + 1}
            trigger={
              <Button>
                <Plus className="size-4" />
                Add Module
              </Button>
            }
          />
        </div>
      )}

      {!modules?.length ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No modules have been added to this course yet.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {modules.map((mod) => {
            const completed = mod.lessonCount > 0 && mod.completedCount === mod.lessonCount;

            return (
              <Card
                key={mod.id}
                onClick={() => navigate(`/courses/${courseId}/modules/${mod.id}`)}
                className="flex cursor-pointer flex-row items-center justify-between p-6 shadow-sm transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-6">
                  <ModuleStatusIcon completed={completed} isTeacher={isTeacher} />

                  <div className="text-left">
                    <h3 className="text-[17px] font-medium">{mod.title}</h3>
                    <p className="text-[13px] text-muted-foreground">
                      {mod.completedCount} / {mod.lessonCount} lessons
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isTeacher && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Actions for ${mod.title}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem onClick={() => setEditingModule(mod)}>
                          <Pencil className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => setDeletingModule(mod)}>
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  <div className="text-primary">
                    <ArrowRight className="size-6" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit dialog — controlled, no visible trigger */}
      <ModuleFormDialog
        courseId={courseId ?? ""}
        module={editingModule ?? undefined}
        open={!!editingModule}
        onOpenChange={(next) => !next && setEditingModule(null)}
      />

      {/* Delete confirm — real hard delete, no soft-delete state exists for modules */}
      <ConfirmDeleteDialog
        open={!!deletingModule}
        onOpenChange={(next) => !next && setDeletingModule(null)}
        title="Delete Module"
        description={`This will permanently delete "${deletingModule?.title}" and all its lessons. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={async () => {
          if (!deletingModule || !courseId) return;
          await deleteModule.mutateAsync({ courseId, moduleId: deletingModule.id });
          toast.success("Module deleted.");
        }}
      />
    </div>
  );
}