import { useParams } from "react-router-dom";

import { useGrades } from "@/hooks/use-grades";
import { getScoreClass } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/data-table";
import { courseScopedGradeColumns } from "@/components/grade-columns";

function AverageCardSkeleton() {
  return (
    <Card className="p-0 shadow-xs">
      <div className="flex flex-col gap-1 p-5">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-9 w-16" />
        <Skeleton className="mt-1 h-3 w-36" />
      </div>
    </Card>
  );
}

export default function CourseGrades() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: courseGrades, isLoading, error } = useGrades({ courseId });

  const grades = courseGrades ?? [];

  const average =
    grades.length > 0
      ? Math.round(
          grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length
        )
      : null;

  return (
    <div className="max-w-3xl space-y-6">
      {isLoading ? (
        <AverageCardSkeleton />
      ) : (
        <Card className="p-0 shadow-xs">
          <div className="flex flex-col gap-1 p-5">
            <p className="text-sm text-muted-foreground">Course Average</p>
            {average !== null ? (
              <>
                <p className={cn("text-3xl font-semibold", getScoreClass(average, 100))}>
                  {average}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Based on {grades.length} graded assessment{grades.length !== 1 ? "s" : ""}
                </p>
              </>
            ) : (
              <p className="text-3xl font-semibold text-muted-foreground">-</p>
            )}
          </div>
        </Card>
      )}

      <Card className="p-0 py-0 shadow-xs">
        <CardHeader className="border-b px-5 py-5 sm:px-6">
          <CardTitle className="text-base font-semibold">All Grades</CardTitle>
        </CardHeader>
        <DataTable
          columns={courseScopedGradeColumns}
          data={grades}
          getRowId={(g) => g.id}
          isLoading={isLoading}
          skeletonRowCount={4}
          error={error ? "Failed to load grades. Please try again." : null}
          emptyMessage="No grades recorded yet."
        />
      </Card>
    </div>
  );
}