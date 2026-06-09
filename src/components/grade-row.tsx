import { format } from "date-fns";

import type { Grade } from "@/api/grades";
import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

// View-model type
export type GradeRow = {
  id: string;
  title: string;
  course: string;
  score: number;
  maxScore: number;
  scoreClass: string;
};

// Mapper
export function mapGrade(g: Grade): GradeRow {
  const pct = (g.score / g.maxScore) * 100;
  const scoreClass =
    pct >= 90 ? "text-emerald-600" :
    pct >= 75 ? "text-primary"     :
    pct >= 60 ? "text-orange-500"  :
                "text-rose-500";

  return {
    id: g.id,
    title: g.title,
    course: `${g.courseName} · ${format(new Date(g.gradedAt), "MMM d")}`,
    score: g.score,
    maxScore: g.maxScore,
    scoreClass,
  };
}

// Component
export function GradeRow({ title, course, score, maxScore, scoreClass }: GradeRow) {
  return (
    <TableRow>
      <TableCell className="font-medium text-foreground">{title}</TableCell>
      <TableCell className="text-muted-foreground">{course}</TableCell>
      <TableCell className={cn("text-right font-semibold", scoreClass)}>
        {score}{" "}
        <span className="text-muted-foreground">/ {maxScore}</span>
      </TableCell>
    </TableRow>
  );
}

// Skeleton
export function GradeRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-16" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}