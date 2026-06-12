import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

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

const COURSE_ACCENTS = [
  "bg-primary",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-orange-500",
];

// Mapper
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
export function CourseCard({ id, title, instructor, progress, accent }: CourseCard) {
  return (
    <Card className="min-w-0 overflow-hidden p-0 py-0 shadow-xs">
      <div className={cn("h-1 w-full", accent)} />
      <div className="flex h-full min-w-0 flex-col gap-4 p-4 sm:gap-5 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground sm:text-base">{title}</h3>
            <p className="text-sm text-muted-foreground">{instructor}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
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
export function CourseCardSkeleton({ count = 2 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="min-w-0 overflow-hidden p-0 py-0 shadow-xs">
          <Skeleton className="h-1 w-full rounded-none" />
          <div className="flex flex-col gap-4 p-4 sm:gap-5 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-14 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-1.5 w-full" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
        </Card>
      ))}
    </>
  );
}