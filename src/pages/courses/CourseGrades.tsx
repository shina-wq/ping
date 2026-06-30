import {format} from "date-fns";
import { useParams } from "react-router-dom";

import { useGrades } from "@/hooks/use-grades";
import { getScoreClass } from "@/lib/format";
import { cn } from "@/lib/utils";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function AverageCardSkeleton() {
  return (
    <Card className="p-0 shadow-xs">
      <div className="flex flex-col gap-1 p-5">
        <Skeleton className="h-3 w-28"/>
        <Skeleton className="h-9 w-16"/>
        <Skeleton className="h-3 w-36 mt-1"/>
      </div>
    </Card>
  )
}

function GradeRowSkeleton({count = 4}: {count?: number}) {
  return (
    <>
    {Array.from({length: count}).map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-40"/>
            <Skeleton className="h-3 w-24"/>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="ml-auto h-4 w-20"/>
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="ml-auto h-4 w-12"/>
        </TableCell>
      </TableRow>
    ))}
    </>
  );
}

export default function CourseGrades() {
  const {courseId} = useParams<{courseId:string}>();
  const {data: courseGrades, isLoading, error} = useGrades({ courseId });

  const grades = courseGrades ?? [];

  const average = grades.length > 0 ? Math.round(
    grades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / grades.length ) : null;

  if (isLoading) {
    return (
      <div className="max-w-3xl space-y-6">
        <AverageCardSkeleton />
        <Card className="p-0 shadow-xs">
          <CardHeader className="border-b px-5 py-5">
            <Skeleton className="h-4 w-24"/>
          </CardHeader>
          <CardContent className="px-0 py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assessment</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Grade</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                <GradeRowSkeleton />
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        Failed to load grades. Please try again.
      </p>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Card className="p-0 shadow-xs">
        <div className="flex flex-col gap-1 p-5">
          <p className="text-sm text-muted-foreground">Course Average</p>
          {average !== null ? (
            <>
            <p className={cn("text-3xl font-semibold", getScoreClass(average, 100))}>
              {average}%
            </p>
            <p className="text-xs text-muted-foreground">
              Based on {grades.length} graded assessment {grades.length !== 1 ? "s" : ""}
            </p>
            </>
          ) : (
            <p className="text-3xl font-semibold text-muted-foreground">-</p>
          )}
        </div>
      </Card>

      <Card className="p-0 shadow-xs">
          <CardHeader className="border-b px-5 py-5 sm:px-6">
            <CardTitle className="text-base font-semibold">All Grades</CardTitle>
          </CardHeader>
          <CardContent className="px-0 py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assessment</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Grade</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {grades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-10 text-center text-sm text-muted-foreground">
                      No grades recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  grades.map((grade) => {
                    const pct = Math.round((grade.score / grade.maxScore) * 100);

                    return (
                      <TableRow key={grade.id}>
                        <TableCell>
                          <p className="font-medium text-foreground">
                            {grade.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(grade.gradedAt), "MMMd, yyyy")}
                          </p>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {grade.score} / {grade.maxScore}
                        </TableCell>
                        <TableCell className={cn(
                          "text-right font-semibold", getScoreClass(grade.score, grade.maxScore)
                        )}>
                          {pct}%
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
      </Card>
    </div>
  );
}