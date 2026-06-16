import { Outlet, useParams, Link, useLocation } from "react-router-dom";
import { ChevronRight, BookOpen, FileText, Clock } from "lucide-react";

import { useCourse } from "@/hooks/use-courses";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Modules", path: "modules" },
  { label: "Assignments", path: "assignments" },
  { label: "Grades", path: "grades" },
  { label: "Announcements", path: "announcements" },
];

function CourseLayoutSkeleton() {
  return (
    <div className="-mx-4 -mt-6 flex flex-col lg:-mx-8">
        {/* Blue header skeleton */}
        <div className="bg-primary px-6 py-8 sm:px-10 lg:px-12">
          {/* Breadcrumb */}
          <div className="mb-4 mt-4 flex items-center gap-2">
            <Skeleton className="h-4 w-20 bg-primary-foreground/20" />
            <ChevronRight className="size-4 text-primary-foreground/40 "/>
            <Skeleton className="h-4 w-32 bg-primary-foreground/20 "/>
          </div>

          {/* Title */}
          <Skeleton className="mb-2 h-9 w-72 bg-primary-foreground/20"/>
          {/* Instructor + Semester */}
          <div className="flex">
              <Skeleton className="mb-6 h-6 w-48 bg-primary-foreground/20"/>
              <Skeleton className="mb-6 h-6 w-48 bg-primary-foreground/20"/>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-6">
            <Skeleton className="h-4 w-36 bg-primary-foreground/20 "/>
            <Skeleton className="h-4 w-28 bg-primary-foreground/20 "/>
            <Skeleton className="h-4 w-36 bg-primary-foreground/20 "/>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="border-b border-border bg-background px-6 sm:px-10 lg:px-12">
          <div className="flex gap-8 py-4">
            {TABS.map((tab) => (
              <Skeleton key={tab.path} className="h-4 w-20" />
            ))}
          </div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 bg-background p-6 sm:p-10 lg:px-12">
            <div className="max-w-3xl space-y-4">
              {Array.from({length: 4}).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl"/>
              ))}
            </div>
        </div>
        <div>

      </div>
    </div>
  )
}

export default function CourseLayout() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: course, isLoading } = useCourse(courseId || "");
  const location = useLocation();

  if (isLoading)return <CourseLayoutSkeleton />;

  if (!course) {
    return <p className="p-8 text-center text-muted-foreground">Course not found.</p>;
  }

  // Active tab derived from location pathname
  const currentPath = location.pathname.split("/").pop() || "modules";

  return (
    <div className="-mx-4 -mt-6 flex flex-col lg:-mx-8">
      {/* Header */}
      <div className="bg-primary px-6 py-8 text-primary-foreground sm:px-10 lg:px-12">
        <div className="mb-4 mt-4 flex items-center text-sm font-medium text-primary-foreground/80">
          <Link to="/courses" className="hover:text-primary-foreground">
            My Courses
          </Link>
          <ChevronRight className="mx-1 size-4" />
          <span className="text-primary-foreground">{course.title}</span>
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">{course.title}</h1>

        <div className="flex">
          <p className="mb-6 text-base font-medium text-primary-foreground/90">
            {course.instructor || "Unknown Instructor"}
          </p>
          <p className="px-2">&bull;</p>
          <p className="mb-6 text-base font-medium text-primary-foreground/90">
            Fall Semester 2024
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-primary-foreground/90 sm:gap-6">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4" />
            <span>4 Modules - 19 lessons</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="size-4" />
            <span>{course.taskCount || 4} Assignments</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span>Dec 14 - next deadline</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-background px-6 sm:px-10 lg:px-12">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {TABS.map((tab) => {
            const isActive = currentPath === tab.path;
            return (
              <Link
                key={tab.path}
                to={`/courses/${course.id}/${tab.path}`}
                className={cn(
                  "whitespace-nowrap border-b-2 px-1 py-4 text-[14.5px] font-medium transition-colors",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-background p-6 sm:p-10 lg:px-12">
        <Outlet />
      </div>
    </div>
  );
}
