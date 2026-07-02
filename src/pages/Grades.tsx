import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePageHeader } from "@/components/page-header-context";
import { useGrades } from "@/hooks/use-grades";
import { SearchInput } from "@/components/ui/search-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/data-table";
import { gradeColumns } from "@/components/grade-columns";
import { getScoreClass } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function Grades() {
  usePageHeader({
    title: "Grades",
    description: "Your full academic performance record.",
  });

  const navigate = useNavigate();
  const { data: grades, isLoading, error } = useGrades();
  const [query, setQuery] = useState("");

  const filteredGrades = useMemo(() => {
    const q = query.toLowerCase();
    return (grades ?? []).filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        (g.courseName ?? "").toLowerCase().includes(q)
    );
  }, [grades, query]);

  const average = useMemo(() => {
    if (!filteredGrades.length) return null;
    const total = filteredGrades.reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0);
    return Math.round(total / filteredGrades.length);
  }, [filteredGrades]);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="p-0 shadow-xs">
        <div className="flex flex-col gap-1 p-5">
          <p className="text-sm text-muted-foreground">Overall Average</p>
          {isLoading ? (
            <Skeleton className="h-9 w-20" />
          ) : (
            <p
              className={cn(
                "text-3xl font-semibold",
                average === null ? "text-muted-foreground" : getScoreClass(average, 100)
              )}
            >
              {average !== null ? `${average}%` : "—"}
            </p>
          )}
        </div>
      </Card>

      {/* Full gradebook */}
      <Card className="p-0 py-0 shadow-xs">
        <CardHeader className="flex flex-row items-center justify-between border-b px-5 py-4 sm:px-6">
          <CardTitle className="text-base font-semibold">All Grades</CardTitle>
          <SearchInput value={query} onChange={setQuery} placeholder="Search grades..." />
        </CardHeader>
        <CardContent className="px-0 py-0">
          <DataTable
            columns={gradeColumns}
            data={filteredGrades}
            getRowId={(g) => g.id}
            isLoading={isLoading}
            skeletonRowCount={6}
            error={error ? "Failed to load grades. Please try again." : null}
            emptyMessage={query ? "No grades match your search." : "No grades recorded yet."}
            onRowClick={(g) => navigate(`/courses/${g.courseId}/grades`)}
          />
        </CardContent>
      </Card>
    </div>
  );
}