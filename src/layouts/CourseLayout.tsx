import { Outlet, useParams, Link, useLocation } from "react-router-dom";
import { ChevronRight, BookOpen, FileText, Clock } from "lucide-react";

import { useCourse } from "@/hooks/use-courses";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Modules", path: "modules" },
  { label: "Assignments", path: "assignments" },
  { label: "Grades", path: "grades" },
  { label: "Announcements", path: "announcements" },
];

export default function CourseLayout() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: course, isLoading } = useCourse(courseId || "");
  const location = useLocation();

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading course...</div>;
  }

  if (!course) {
    return <div className="p-8 text-center text-muted-foreground">Course not found.</div>;
  }

  // Active tab derived from location pathname
  const currentPath = location.pathname.split("/").pop() || "modules";

  return (
    <div className="-mx-4 -mt-6 flex flex-col lg:-mx-8">
      {/* Indigo Header Section */}
      <div className="bg-primary px-6 py-8 text-primary-foreground sm:px-10 lg:px-12">
        <div className="mb-4 mt-4 flex items-center text-sm font-medium text-primary-foreground/80">
          <Link to="/courses" className="hover:text-primary-foreground">
            My Courses
          </Link>
          <ChevronRight className="mx-1 size-4" />
          <span className="text-primary-foreground">{course.title}</span>
        </div>

        <h1 className="mb-2 text-3xl font-bold tracking-tight">{course.title}</h1>
        <p className="mb-6 text-lg font-medium text-primary-foreground/90">
          {course.instructor || "Unknown Instructor"}
        </p>

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

      {/* Tabs Section */}
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

      {/* Content Section */}
      <div className="flex-1 overflow-auto bg-background p-6 sm:p-10 lg:px-12">
        <Outlet />
      </div>
    </div>
  );
}
