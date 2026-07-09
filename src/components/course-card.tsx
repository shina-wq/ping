import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

import type { Course } from "@/api/courses";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// View-model type
export type CourseCard = {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  accent: string;
};

type CourseCardProps = CourseCard & {
  showProgress?: boolean;
  size?: "default" | "sm";
  actions?:ReactNode;
};

const COURSE_ACCENTS = [
  "bg-primary",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-orange-500",
];

export function mapCourse(course: Course, index: number): CourseCard {
  return {
    id: course.id,
    title: course.title,
    instructor: course.instructor ?? "Unknown Instructor",
    progress: course.progress,
    accent: COURSE_ACCENTS[index % COURSE_ACCENTS.length],
  };
}

// Component
export function CourseCard({ id, title, instructor, progress, accent, showProgress = true, size= "default", actions }: CourseCardProps) {
  const isSm = size === "sm";

  return (
    <Card className="min-w-0 overflow-hidden p-0 py-0 shadow-xs">
      <div className={cn("h-1 w-full", accent)} />
      <div className={cn("flex h-full min-w-0 flex-col gap-4 p-4 sm:gap-5 sm:p-5", isSm && "gap-3 p-3.5 sm:gap-3 sm:p-3.5")}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className={cn("font-semibold text-foreground", isSm ? "text-sm" : "text-sm sm:text-base")}>
              {title}
            </h3>
            <p className={cn("text-muted-foreground", isSm ? "text-xs" : "text-sm")}>{instructor}</p>
          </div>
          {actions}
        </div>
        {showProgress ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        ) : null}
        <Button
          variant="link"
          className="h-auto px-0 text-sm font-medium text-primary"
          asChild
        >
          <Link to={`/courses/${id}`} className="flex items-center gap-1">
            Open Course
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

// Skeleton
export function CourseCardSkeleton({ count = 4, size = "default", showProgress = true }: { count?: number; size?: "default" | "sm", showProgress?: boolean }) {
  const isSm = size === "sm";

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="min-w-0 overflow-hidden p-0 py-0 shadow-xs">
          <Skeleton className="h-1 w-full rounded-none" />
          <div className={cn("flex flex-col gap-4 p-4 sm:gap-5 sm:p-5", isSm && "gap-3 p-3.5 sm:gap-3 sm:p-3.5")}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            {showProgress ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-14" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <Skeleton className="h-1.5 w-full" />
                </div>
                {!isSm && <Skeleton className="h-4 w-24" />}
              </>
            ) : null}
            <Skeleton className="h-4 w-24" />
          </div>
        </Card>
      ))}
    </>
  );
}

// List view
export function CourseListItem({id, title, instructor, progress, accent}: CourseCard) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-3.5 shadow-xs transition-colors hover:bg-muted/30">
      {/* Accent dot */}
      <div className={cn("size-2.5 shrink-0 rounded-full", accent)} />
        {/* Title + instructor */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {title}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {instructor}
          </p>
        </div>

        {/* Progress (hidden on mobile) */}
        <div className="hidden w-40 items-center gap-3 sm:flex">
          <Progress value={progress} className="h-1.5 flex-1"/>
          <span className="w-9 text-right text-xs font-medium text-foreground">
            {progress}%
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 gap-1.5 text-primary hover:text-primary"
          asChild
        >
          <Link to={`/courses/${id}`}>
            Open <ArrowUpRight className="size-3.5"/>
          </Link>
        </Button>
      </div>
  );
}

export function CourseListItemSkeleton({count = 6}: {count?: number}) {
  return (
    <>
      {Array.from({length: count}).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl border-border bg-card px-5 py-3.5 shadow-xs"
        >
          <Skeleton className="size-2.5 shrink-0 rounded-full"/>
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-40"/>
            <Skeleton className="h-3 w-24"/>
          </div>
          <Skeleton  className="hidden h-1.5 w-40 sm:block"/>
          <Skeleton className="h-8 w-16 rounded-md"/>
        </div>
      ))}
    </>
  );
}