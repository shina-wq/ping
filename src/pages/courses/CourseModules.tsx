import { ArrowRight, Check, Clock10 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { useModules } from "@/hooks/use-modules";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function CourseModules() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: modules, isLoading, error } = useModules(courseId ?? "");

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

  if (!modules?.length) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No modules have been added to this course yet.
      </p>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-col gap-6">
        {modules.map((mod) => {
          const completed = mod.lessonCount > 0 && mod.completedCount === mod.lessonCount;

          return (
            <Link key={mod.id} to={`/courses/${courseId}/modules/${mod.id}`}>
              <Card
                className="flex cursor-pointer flex-row items-center justify-between p-6 shadow-sm transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-6">
                  {/* Icon Circle */}
                  <div
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-full",
                      completed ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                    )}
                  >
                    {completed ? (
                      <Check className="size-6" strokeWidth={3} />
                    ) : (
                      <Clock10 className="size-6" strokeWidth={3} />
                    )}
                  </div>

                  {/* Text content */}
                  <div className="text-left">
                    <h3 className="text-[17px] font-medium">{mod.title}</h3>
                    <p className="text-[13px] text-muted-foreground">
                      {mod.completedCount} / {mod.lessonCount} lessons
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-primary">
                  <ArrowRight className="size-6" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}