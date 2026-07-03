// src/pages/courses/Courses.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Plus } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/contexts/auth-context";

import { useAddCourse, useCourses } from "@/hooks/use-courses";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { ApiError } from "@/lib/api-error";
import type { CourseStatus } from "@/api/courses";

type CourseFilter = "All Courses" | "In Progress" | "Completed" | "Not Started";
const TABS: CourseFilter[] = ["All Courses", "In Progress", "Completed", "Not Started"];

const FILTER_TO_STATUS: Partial<Record<CourseFilter, CourseStatus>> = {
  Completed: "completed",
};

function getCourseColumns(showProgress: boolean): DataTableColumn<CourseCardModel>[] {
  const columns: DataTableColumn<CourseCardModel>[] = [
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
  ];

  if (showProgress) {
    columns.push({
      id: "progress",
      header: "Progress",
      hideBelow: "sm",
      cell: (c) => (
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-32 rounded-full bg-muted">
            <div className="h-1.5 rounded-full bg-primary" style={{ width: `${c.progress}%` }} />
          </div>
          <span className="w-9 text-right text-xs font-medium text-foreground">{c.progress}%</span>
        </div>
      ),
    });
  }

  columns.push({
    id: "action",
    header: "",
    align: "right",
    cell: () => (
      <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary">
        Open <ArrowUpRight className="size-3.5" />
      </Button>
    ),
  });

  return columns;
}

function AddCourseDialog() {
  const addCourse = useAddCourse();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [term, setTerm] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState<CourseStatus>("active");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      toast.error("Please enter a course title.");
      return;
    }

    try {
      const course = await addCourse.mutateAsync({
        title: trimmedTitle,
        term: term.trim() || undefined,
        year: year ? Number(year) : undefined,
        status,
      });

      toast.success("Course created.");
      setOpen(false);
      setTitle("");
      setTerm("");
      setYear("");
      setStatus("active");
      window.location.assign(`/courses/${course.id}`);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Failed to create course.";
      toast.error(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Course</DialogTitle>
            <DialogDescription>Create a new course and start building out the class workspace.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course-title">Course title</Label>
              <Input id="course-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Mathematics 101" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-term">Term</Label>
              <Input id="course-term" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Fall" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="course-year">Year</Label>
                <Input id="course-year" inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-status">Status</Label>
                <select
                  id="course-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CourseStatus)}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={addCourse.isPending}>
              Create Course
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Courses() {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";
  const navigate = useNavigate();
  const [filter, setFilter] = useState<CourseFilter>("All Courses");
  const [view, setView] = useState<ViewMode>("card");
  const [query, setQuery] = useState("");

  const showProgress = !isTeacher;
  const courseColumns = useMemo(() => getCourseColumns(showProgress), [showProgress]);
  const headerActions = useMemo(() => (isTeacher ? <AddCourseDialog /> : undefined), [isTeacher]);

  usePageHeader({
    title: "My Courses",
    description: "All your enrolled courses.",
    actions: headerActions,
  });

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
            <CourseCardSkeleton count={6} showProgress={showProgress} />
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
              <CourseCard key={c.id} {...c} showProgress={showProgress} />
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