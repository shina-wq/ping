import { useParams } from "react-router-dom";
import { useAssignments } from "@/hooks/use-assignments";
import { AssignmentList } from "@/components/assignments/assignment-list";
import { AssignmentRowSkeleton } from "@/components/assignments/assignment-row";
import { Card, CardContent } from "@/components/ui/card";

function CourseAssignmentsSkeleton() {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <div className="h-5 w-24 rounded bg-muted animate-pulse" />
        <Card className="shadow-xs border border-border/50 p-0">
          <CardContent className="p-0 divide-y divide-border/50">
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
  const { data, isLoading, error } = useAssignments();

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

  const courseAssignments = (data ?? [])
    .filter((a) => a.courseId === courseId)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="max-w-4xl">
      <AssignmentList
        assignments={courseAssignments}
        emptyMessage="No assignments found for this course."
      />
    </div>
  );
}
