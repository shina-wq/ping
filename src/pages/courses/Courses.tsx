import { useMemo, useState } from "react";

import { useCourses } from "@/hooks/use-courses";
import { usePageHeader } from "@/components/page-header-context";
import {
  CourseCard,
  CourseCardSkeleton,
  CourseListItem,
  CourseListItemSkeleton,
  mapCourse,
} from "@/components/courses/course-card";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { ViewToggle, type ViewMode } from "@/components/ui/view-toggle";
import { SearchInput } from "@/components/ui/search-input";

type CourseFilter = "All Courses" | "In Progress" | "Completed" | "Not Started";
const TABS: CourseFilter[] = ["All Courses", "In Progress", "Completed", "Not Started"];

export default function Courses() {
  usePageHeader({ title: "My Courses", description: "All your enrolled courses." });

  const { data: courses, isLoading, error } = useCourses();
  const [filter, setFilter] = useState<CourseFilter>("All Courses");
  const [view, setView] = useState<ViewMode>("card");
  const [query, setQuery] = useState("");

  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    const q = query.toLowerCase();

    return courses.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(q) ||
        (c.instructor ?? "").toLowerCase().includes(q);
      if (!matchesSearch) return false;

      if (filter === "In Progress") return c.progress > 0 && c.progress < 100;
      if (filter === "Completed") return c.progress === 100;
      if (filter === "Not Started") return c.progress === 0;
      return true; // "All Courses"
    });
  }, [courses, filter, query]);

  const isEmpty = !isLoading && !error && !courses?.length;
  const isNoMatch = !isLoading && !error && !!courses?.length && !filteredCourses.length;

  return (
    <div className="space-y-6">
      {/* Controls row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterTabs
          tabs={TABS}
          activeTab={filter}
          onTabChange={setFilter}
          className={isLoading ? "pointer-events-none opacity-50" : undefined}
        />
        <div className="flex items-center gap-3">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search courses..."
          />
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        view === "card" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CourseCardSkeleton count={6} />
          </div>
        ) : (
          <div className="space-y-2">
            <CourseListItemSkeleton count={6} />
          </div>
        )
      ) : error ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Failed to load courses. Please try again.
        </p>
      ) : isEmpty ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          You are not enrolled in any courses yet.
        </p>
      ) : isNoMatch ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No courses match your search.
        </p>
      ) : view === "card" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((c, i) => (
            <CourseCard key={c.id} {...mapCourse(c, i)} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredCourses.map((c, i) => (
            <CourseListItem key={c.id} {...mapCourse(c, i)} />
          ))}
        </div>
      )}
    </div>
  );
}