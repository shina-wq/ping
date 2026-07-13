import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Archive, MoreHorizontal, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import type { Course, CourseStatus } from "@/api/courses";
import { useAuth } from "@/contexts/auth-context";

import { useCourses, useUpdateCourse } from "@/hooks/use-courses";
import { usePageHeader } from "@/components/page-header-context";
import {
  CourseCard,
  CourseCardSkeleton,
  mapCourse,
  type CourseCard as CourseCardModel,
} from "@/components/course-card";
import { CourseFormDialog } from "@/components/course-form-dialog";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { createRowActionsColumn } from "@/components/row-actions-column"; // adjust path if needed
import { DataTable, type DataTableColumn } from "@/components/data-table";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { ViewToggle, type ViewMode } from "@/components/ui/view-toggle";
import { SearchInput } from "@/components/ui/search-input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useDebouncedValue } from "@/hooks/use-debounced-value";

type CourseFilter = "All Courses" | "In Progress" | "Completed" | "Not Started" | "Archived";

const STUDENT_TABS: CourseFilter[] = ["All Courses", "In Progress", "Completed", "Not Started"];
const TEACHER_TABS: CourseFilter[] = [...STUDENT_TABS, "Archived"];

const FILTER_TO_STATUS: Partial<Record<CourseFilter, CourseStatus>> = {
  Completed: "completed",
  Archived: "archived",
};

type CourseColumnsOptions = {
  showProgress: boolean;
  isTeacher: boolean;
  onEdit: (row: CourseCardModel) => void;
  onArchive: (row: CourseCardModel) => void;
};

function getCourseColumns({
  showProgress,
  isTeacher,
  onEdit,
  onArchive,
}: CourseColumnsOptions): DataTableColumn<CourseCardModel>[] {
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

  if (isTeacher) {
    columns.push(
      createRowActionsColumn<CourseCardModel>({
        onEdit,
        onDelete: onArchive,
        deleteLabel: "Archive",
        deleteIcon: Archive,
      })
    );
  }

  return columns;
}

// Card-view actions dropdown (edit/archive). Table view uses createRowActionsColumn instead.
function CourseCardActions({
  course,
  onEdit,
  onArchive,
}: {
  course: Course;
  onEdit: () => void;
  onArchive: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${course.title}`}>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={onArchive}>
          <Archive className="size-4" />
          Archive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Courses() {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";
  const navigate = useNavigate();
  const [filter, setFilter] = useState<CourseFilter>("All Courses");
  const [view, setView] = useState<ViewMode>("card");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  // Edit/archive dialog state — holds the raw Course so the form can prefill
  // and the confirm dialog can reference the title.
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [archivingCourse, setArchivingCourse] = useState<Course | null>(null);
  const updateCourse = useUpdateCourse();

  const showProgress = !isTeacher;
  const tabs = isTeacher ? TEACHER_TABS : STUDENT_TABS;

  const headerActions = useMemo(
    () =>
      isTeacher ? (
        <CourseFormDialog
          trigger={
            <Button>
              <Plus className="size-4"/> Add Course
            </Button>
          }
        />
      ) : undefined,
      [isTeacher]
  );

  usePageHeader({
    title: "My Courses",
    description: "All your enrolled courses.",
    actions: headerActions,
  });

  const { data: courses, isLoading, error } = useCourses({
    search: debouncedQuery || undefined,
    status: FILTER_TO_STATUS[filter],
  });

  const filteredCourses = (courses ?? []).filter((c) => {
    if (filter === "Archived") return c.status === "archived";
    if (c.status === "archived") return false; // hide archived everywhere else
    if (filter === "In Progress") return c.status === "active" && c.progress > 0 && c.progress < 100;
    if (filter === "Not Started") return c.status === "active" && c.progress === 0;
    return true;
  });

  // Lookup for edit/archive handlers: table + card only carry the mapped
  // view-model, so we resolve back to the raw Course by id when needed.
  const courseById = new Map(filteredCourses.map((c) => [c.id, c]));

  function handleEdit(row: { id: string }) {
    const raw = courseById.get(row.id);
    if (raw) setEditingCourse(raw);
  }

  function handleArchiveRequest(row: { id: string }) {
    const raw = courseById.get(row.id);
    if (raw) setArchivingCourse(raw);
  }

  const isEmpty = !isLoading && !error && !courses?.length;
  const isNoMatch = !isLoading && !error && !!courses?.length && !filteredCourses.length;
  const mappedCourses = filteredCourses.map(mapCourse);

  const courseColumns = getCourseColumns({
    showProgress,
    isTeacher,
    onEdit: handleEdit,
    onArchive: handleArchiveRequest,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterTabs
          tabs={tabs}
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
              <CourseCard
                key={c.id}
                {...c}
                showProgress={showProgress}
                actions={
                  isTeacher ? (
                    <CourseCardActions
                      course={courseById.get(c.id)!}
                      onEdit={() => handleEdit(c)}
                      onArchive={() => handleArchiveRequest(c)}
                    />
                  ) : undefined
                }
              />
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

      {/* Edit dialog — controlled, no visible trigger (opened via row/card actions) */}
      <CourseFormDialog
        course={editingCourse ?? undefined}
        open={!!editingCourse}
        onOpenChange={(next) => !next && setEditingCourse(null)}
      />

      {/* Archive confirm dialog */}
      <ConfirmDeleteDialog
        open={!!archivingCourse}
        onOpenChange={(next) => !next && setArchivingCourse(null)}
        title="Archive Course"
        description={`This will hide "${archivingCourse?.title}" from active views. You can restore it later by editing its status.`}
        confirmLabel="Archive"
        onConfirm={async () => {
          if (!archivingCourse) return;
          await updateCourse.mutateAsync({ id: archivingCourse.id, input: { status: "archived" } });
          toast.success("Course archived.");
        }}
      />
    </div>
  );
}