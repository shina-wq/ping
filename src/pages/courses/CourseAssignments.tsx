import { useParams } from "react-router-dom";
import { useCourseAssignments } from "@/hooks/use-assignments";
import { AssignmentList } from "@/components/assignment-list";
import { AssignmentRowSkeleton } from "@/components/assignment-row";
import { Card, CardContent } from "@/components/ui/card";

function CourseAssignmentsSkeleton() {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <div className="h-5 w-24 animate-pulse rounded bg-muted" />
        <Card className="border border-border/50 p-0 shadow-xs">
          <CardContent className="divide-y divide-border/50 p-0">
            <div className="p-4 sm:px-6">
              <AssignmentRowSkeleton count={3} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CourseAssignments() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data, isLoading, error } = useCourseAssignments(courseId ?? "");

  if (isLoading) {
    return (
      <div className="max-w-4xl">
        <CourseAssignmentsSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Failed to load assignments. Please try again.
      </p>
    );
  }

  const courseAssignments = [...(data ?? [])].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <div className="max-w-4xl">
      <AssignmentList
        assignments={courseAssignments}
        emptyMessage="No assignments found for this course."
        view="list"
      />
    </div>
  );
}