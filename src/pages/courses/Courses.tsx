import { useMemo, useState } from "react";
import { usePageHeader } from "@/components/page-header-context";
import { useCourses } from "@/hooks/use-courses";
import { CourseCard, CourseCardSkeleton, mapCourse } from "@/components/courses/course-card";
import { FilterTabs } from "@/components/ui/filter-tabs";

type CourseFilter = "All Courses" | "In Progress" | "Completed" | "Not Started";
const TABS: CourseFilter[] = ["All Courses", "In Progress", "Completed", "Not Started"];

export default function Courses() {
  usePageHeader({
    title: "My Courses",
    description: "All your enrolled courses.",
  });

  const { data: courses, isLoading, error } = useCourses();
  const [filter, setFilter] = useState<CourseFilter>("All Courses");

  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    return courses.filter((course) => {
      if (filter === "All Courses") return true;
      if (filter === "In Progress") return course.progress > 0 && course.progress < 100;
      if (filter === "Completed") return course.progress === 100;
      if (filter === "Not Started") return course.progress === 0;
      return true;
    });
  }, [courses, filter]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <FilterTabs tabs={TABS} activeTab={filter} onTabChange={() => {}} className="opacity-50 pointer-events-none" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CourseCardSkeleton count={6} />
        </div>
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
    <div className="space-y-6">
      <FilterTabs tabs={TABS} activeTab={filter} onTabChange={setFilter} />

      {!filteredCourses.length ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No courses found for the selected filter.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, index) => (
            <CourseCard key={course.id} {...mapCourse(course, index)} />
          ))}
        </div>
      )}
    </div>
  );
}