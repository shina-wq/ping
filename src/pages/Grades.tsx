import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";

import { usePageHeader } from "@/components/page-header-context";
import { useGrades } from "@/hooks/use-grades";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getScoreClass } from "@/lib/format";
import { cn } from "@/lib/utils";

function GradesSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-20" /></TableCell>
          <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-12" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

export default function Grades() {
  usePageHeader({
    title: "Grades",
    description: "Your full academic performance record.",
  });

  const { data: grades, isLoading, error } = useGrades();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";

  const filteredGrades = (grades || []).filter(g => 
    g.title.toLowerCase().includes(query) || g.courseName?.toLowerCase().includes(query)
  );

  // Compute overall average from all filtered grades.
  const average =
    filteredGrades?.length
      ? Math.round(
          filteredGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) / filteredGrades.length
        )
      : null;

  return (
    <div className="space-y-6">
      {/* ── Summary ── */}
      <Card className="p-0 shadow-xs">
        <div className="flex flex-col gap-1 p-5">
          <p className="text-sm text-muted-foreground">Overall Average</p>
          {isLoading ? (
            <Skeleton className="h-9 w-20" />
          ) : (
            <p className={cn(
              "text-3xl font-semibold",
              average === null
                ? "text-muted-foreground"
                : getScoreClass(average, 100)
            )}>
              {average !== null ? `${average}%` : "—"}
            </p>
          )}
        </div>
      </Card>

      {/* ── Full gradebook ── */}
      <Card className="p-0 py-0 shadow-xs">
        <CardHeader className="border-b px-5 py-5 sm:px-6">
          <CardTitle className="text-base font-semibold">All Grades</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Assessment</TableHead>
                <TableHead>Course</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <GradesSkeleton />
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                    Failed to load grades. Please try again.
                  </TableCell>
                </TableRow>
              ) : !filteredGrades?.length ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                    No grades recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                filteredGrades.map((grade) => {
                  const pct = Math.round((grade.score / grade.maxScore) * 100);
                  const scoreClass = getScoreClass(grade.score, grade.maxScore);
                  return (
                    <TableRow key={grade.id}>
                      <TableCell>
                        <p className="font-medium text-foreground">{grade.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(grade.gradedAt), "MMM d, yyyy")}
                        </p>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{grade.courseName}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {grade.score} / {grade.maxScore}
                      </TableCell>
                      <TableCell className={cn("text-right font-semibold", scoreClass)}>
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