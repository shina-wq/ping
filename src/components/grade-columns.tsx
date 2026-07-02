import { format } from "date-fns";

import type { Grade } from "@/api/grades";
import type { DataTableColumn } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { getScoreClass } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Full column set: assessment, course, score, grade. Used on the global Grades page. */
export const gradeColumns: DataTableColumn<Grade>[] = [
  {
    id: "assessment",
    header: "Assessment",
    cell: (g) => (
      <div>
        <p className="font-medium text-foreground">{g.title}</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(g.gradedAt), "MMM d, yyyy")}
        </p>
      </div>
    ),
    skeleton: (
      <div className="space-y-1.5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
    ),
  },
  {
    id: "course",
    header: "Course",
    cell: (g) => <span className="text-muted-foreground">{g.courseName}</span>,
  },
  {
    id: "score",
    header: "Score",
    align: "right",
    cell: (g) => (
      <span className="text-muted-foreground">
        {g.score} / {g.maxScore}
      </span>
    ),
  },
  {
    id: "grade",
    header: "Grade",
    align: "right",
    cell: (g) => {
      const pct = Math.round((g.score / g.maxScore) * 100);
      return (
        <span className={cn("font-semibold", getScoreClass(g.score, g.maxScore))}>
          {pct}%
        </span>
      );
    },
  },
];

/** Course-scoped column set, no "Course" column since it's implied by the page. */
export const courseScopedGradeColumns: DataTableColumn<Grade>[] = gradeColumns.filter(
  (col) => col.id !== "course"
);