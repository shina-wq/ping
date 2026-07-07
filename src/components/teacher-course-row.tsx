import { BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { Course } from "@/api/courses";
import { Skeleton } from "@/components/ui/skeleton";
import { COURSE_ACCENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";

// View-model type
export type TeacherCourseRow = {
  id: string;
  title: string;
  enrolledCount: number;
  pendingCount: number;
  accent: string;
};

// Mapper
export function mapTeacherCourse(
  course: Course,
  index: number,
  pendingByCourse: Record<string, number>
): TeacherCourseRow {
  return {
    id: course.id,
    title: course.title,
    enrolledCount: course.enrolledCount ?? 0,
    pendingCount: pendingByCourse[course.id] ?? 0,
    accent: COURSE_ACCENTS[index % COURSE_ACCENTS.length],
  };
}

// Component
export function TeacherCourseRow({ id, title, enrolledCount, pendingCount, accent }: TeacherCourseRow) {
  return (
    <Link
      to={`/courses/${id}/assignments`}
      className="flex items-center gap-3 py-2.5 transition-colors hover:bg-muted/50"
    >
      <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg text-white", accent)}>
        <BookOpen className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{enrolledCount} students enrolled</p>
      </div>
      {pendingCount > 0 && (
        <span className="shrink-0 rounded-full bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-500">
          {pendingCount} to grade
        </span>
      )}
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}

// Skeleton
export function TeacherCourseRowSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2.5">
          <Skeleton className="size-9 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </>
  );
}