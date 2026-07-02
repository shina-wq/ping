// src/pages/courses/Courses.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { useCourses } from "@/hooks/use-courses";
import { usePageHeader } from "@/components/page-header-context";
import {
  CourseCard,
  CourseCardSkeleton,
  mapCourse,
  type CourseCard as CourseCardModel,
} from "@/components/course-card";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { ViewToggle, type ViewMode } from "@/components/ui/view-toggle";
import { SearchInput } from "@/components/ui/search-input";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import type { CourseStatus } from "@/api/courses";

type CourseFilter = "All Courses" | "In Progress" | "Completed" | "Not Started";
const TABS: CourseFilter[] = ["All Courses", "In Progress", "Completed", "Not Started"];

const FILTER_TO_STATUS: Partial<Record<CourseFilter, CourseStatus>> = {
  Completed: "completed",
};

const courseColumns: DataTableColumn<CourseCardModel>[] = [
  {
    id: "course",
    header: "Course",
    cell: (c) => (
      <div className="flex items-center gap-3">
        <span className={`size-2.5 shrink-0 rounded-full ${c.accent}`} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{c.title}</p>
          <p className="truncate text-xs text-muted-foreground">{c.instructor}</p>
        </div>
      </div>
    ),
  },
  {
    id: "progress",
    header: "Progress",
    hideBelow: "sm",
    cell: (c) => (
      <div className="flex items-center gap-3">
        <Progress value={c.progress} className="h-1.5 w-32" />
        <span className="w-9 text-right text-xs font-medium text-foreground">{c.progress}%</span>
      </div>
    ),
  },
  {
    id: "action",
    header: "",
    align: "right",
    cell: (c) => (
      <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary">
        Open <ArrowUpRight className="size-3.5" />
      </Button>
    ),
  },
];

export default function Courses() {
  usePageHeader({ title: "My Courses", description: "All your enrolled courses." });

  const navigate = useNavigate();
  const [filter, setFilter] = useState<CourseFilter>("All Courses");
  const [view, setView] = useState<ViewMode>("card");
  const [query, setQuery] = useState("");

  const { data: courses, isLoading, error } = useCourses({
    search: query || undefined,
    status: FILTER_TO_STATUS[filter],
  });

  const filteredCourses = (courses ?? []).filter((c) => {
    if (filter === "In Progress") return c.status === "active" && c.progress > 0 && c.progress < 100;
    if (filter === "Not Started") return c.status === "active" && c.progress === 0;
    return true;
  });

  const isEmpty = !isLoading && !error && !courses?.length;
  const isNoMatch = !isLoading && !error && !!courses?.length && !filteredCourses.length;
  const mappedCourses = filteredCourses.map(mapCourse);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterTabs
          tabs={TABS}
          activeTab={filter}
          onTabChange={setFilter}
          className={isLoading ? "pointer-events-none opacity-50" : undefined}
        />
        <div className="flex items-center gap-3">
          <SearchInput value={query} onChange={setQuery} placeholder="Search courses..." />
          <ViewToggle view={view} onChange={setView} />
        </div>
      </div>

      {view === "card" ? (
        isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CourseCardSkeleton count={6} />
          </div>
        ) : error ? (
          <p className="py-12 text-center text-sm text-muted-foreground">Failed to load courses. Please try again.</p>
        ) : isEmpty ? (
          <p className="py-12 text-center text-sm text-muted-foreground">You are not enrolled in any courses yet.</p>
        ) : isNoMatch ? (
          <p className="py-12 text-center text-sm text-muted-foreground">No courses match your search.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mappedCourses.map((c) => (
              <CourseCard key={c.id} {...c} />
            ))}
          </div>
        )
      ) : (
        <Card className="p-0 shadow-xs">
          <DataTable
            columns={courseColumns}
            data={mappedCourses}
            getRowId={(c) => c.id}
            isLoading={isLoading}
            skeletonRowCount={6}
            error={error ? "Failed to load courses. Please try again." : null}
            emptyMessage={isEmpty ? "You are not enrolled in any courses yet." : "No courses match your search."}
            onRowClick={(c) => navigate(`/courses/${c.id}`)}
          />
        </Card>
      )}
    </div>
  );
}