import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { usePageHeader } from "@/components/page-header-context";
import { useCourses } from "@/hooks/use-courses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { COURSE_ACCENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";



function CourseCardSkeleton() {
  return (
    <Card className="min-w-0 overflow-hidden p-0 py-0 shadow-xs">
      <Skeleton className="h-1 w-full rounded-none" />
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
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
  );
}

export default function Courses() {
  usePageHeader({
    title: "My Courses",
    description: "All your enrolled courses.",
  });

  const { data: courses, isLoading, error } = useCourses();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Failed to load courses. Please try again.
      </p>
    );
  }

  if (!courses?.length) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        You are not enrolled in any courses yet.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course, index) => {
        const accent = COURSE_ACCENTS[index % COURSE_ACCENTS.length];
        const tasks = `${course.taskCount} ${course.taskCount === 1 ? "task" : "tasks"}`;

        return (
          <Card key={course.id} className="min-w-0 overflow-hidden p-0 py-0 shadow-xs">
            <div className={cn("h-1 w-full", accent)} />
            <div className="flex h-full flex-col gap-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground sm:text-base">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{course.instructor}</p>
                </div>
                <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-xs">
                  {tasks}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-1.5" />
              </div>

              <Button
                variant="ghost"
                className="h-auto justify-start gap-1 px-0 text-primary hover:bg-transparent hover:text-primary/80"
                asChild
              >
                <Link to={`/courses/${course.id}`} className="flex items-center gap-1">
                  Open Course
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}