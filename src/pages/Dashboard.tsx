import {
  ArrowUpRight,
  BookOpen,
  CircleCheckBig,
  Clock3,
  FileText,
  Star,
  type LucideIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

import { useAuth } from "@/contexts/auth-context";
import { usePageHeader } from "@/components/page-header-context";
import { formatGreeting } from "@/lib/greeting";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useCourses } from "@/hooks/use-courses";
import { useAssignments } from "@/hooks/use-assignments";
import { useGrades } from "@/hooks/use-grades";
import { useReminders } from "@/hooks/use-reminders";
import type { DashboardStats } from "@/api/dashboard";
import type { Course } from "@/api/courses";
import type { Assignment, AssignmentStatus } from "@/api/assignments";
import type { Grade } from "@/api/grades";
import type { Reminder } from "@/api/reminders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ─── Presentation types ───────────────────────────────────────────────────────
// These are UI-layer shapes — separate from the raw API response types.
// Mapping functions below transform API types into these.

type StatCard = {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: string;
};

type CourseCard = {
  id: string;
  title: string;
  instructor: string;
  tasks: string;
  progress: number;
  accent: string;
};

type AssignmentCard = {
  id: string;
  title: string;
  course: string;
  due: string;
  status: string;
  statusClass: string;
  icon: LucideIcon;
};

type GradeRow = {
  id: string;
  title: string;
  course: string;
  score: number;
  maxScore: number;
  scoreClass: string;
};

type ReminderCard = {
  id: string;
  title: string;
  detail: string;
  icon: LucideIcon;
  accent: string;
  selected?: boolean;
};

// ─── Mapping constants ────────────────────────────────────────────────────────

// Cycles through accent colours for courses — API doesn't provide colour info.
const COURSE_ACCENTS = [
  "bg-primary",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-orange-500",
];

const STATUS_CONFIG: Record<AssignmentStatus, { label: string; className: string }> = {
  upcoming:     { label: "Upcoming",     className: "bg-sky-500/10 text-sky-500" },
  due_soon:     { label: "Due Soon",     className: "bg-primary/10 text-primary" },
  due_tomorrow: { label: "Due Tomorrow", className: "bg-rose-500/10 text-rose-500" },
  overdue:      { label: "Overdue",      className: "bg-red-600/10 text-red-600" },
  submitted:    { label: "Submitted",    className: "bg-emerald-500/10 text-emerald-600" },
  graded:       { label: "Graded",       className: "bg-emerald-500/10 text-emerald-600" },
};

// ─── Mapping functions ────────────────────────────────────────────────────────

function mapStats(s: DashboardStats): StatCard[] {
  return [
    { label: "Active Courses",          value: String(s.activeCourses),           icon: BookOpen, accent: "bg-primary/10 text-primary" },
    { label: "Pending Assignments",     value: String(s.pendingAssignments),      icon: FileText, accent: "bg-orange-500/10 text-orange-500" },
    { label: "Average Grade",           value: `${s.averageGrade}%`,              icon: Star,     accent: "bg-emerald-500/10 text-emerald-600" },
    { label: "Assignments due this week", value: String(s.assignmentsDueThisWeek), icon: FileText, accent: "bg-rose-500/10 text-rose-500" },
  ];
}

function mapCourse(course: Course, index: number): CourseCard {
  return {
    id: course.id,
    title: course.title,
    instructor: course.instructor,
    tasks: `${course.taskCount} ${course.taskCount === 1 ? "task" : "tasks"}`,
    progress: course.progress,
    accent: COURSE_ACCENTS[index % COURSE_ACCENTS.length],
  };
}

function mapAssignment(a: Assignment): AssignmentCard {
  const config = STATUS_CONFIG[a.status];
  const isSubmitted = a.status === "submitted" || a.status === "graded";
  return {
    id: a.id,
    title: a.title,
    course: a.courseName,
    due: format(new Date(a.dueDate), "MMM d"),
    status: config.label,
    statusClass: config.className,
    icon: isSubmitted ? CircleCheckBig : FileText,
  };
}

function mapGrade(g: Grade): GradeRow {
  const pct = (g.score / g.maxScore) * 100;
  const scoreClass =
    pct >= 90 ? "text-emerald-600" :
    pct >= 75 ? "text-primary"     :
    pct >= 60 ? "text-orange-500"  :
                "text-rose-500";
  return {
    id: g.id,
    title: g.title,
    course: `${g.courseName} · ${format(new Date(g.gradedAt), "MMM d")}`,
    score: g.score,
    maxScore: g.maxScore,
    scoreClass,
  };
}

function mapReminder(r: Reminder): ReminderCard {
  return {
    id: r.id,
    title: r.title,
    detail: r.detail,
    icon: r.isUrgent ? Clock3 : FileText,
    accent: r.isUrgent ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
    selected: r.isUrgent,
  };
}

// ─── Skeleton components ──────────────────────────────────────────────────────

function StatsSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="min-w-0 p-0 py-0 shadow-xs">
          <div className="flex h-full flex-col gap-3 p-4 sm:gap-4 sm:p-5">
            <Skeleton className="size-9 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </Card>
      ))}
    </>
  );
}

function CoursesSkeleton() {
  return (
    <>
      {Array.from({ length: 2 }).map((_, i) => (
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

function AssignmentsSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
          <Skeleton className="size-10 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </>
  );
}

function GradesSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-16" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

function RemindersSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 rounded-2xl border p-4">
          <Skeleton className="size-10 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Shared error state ───────────────────────────────────────────────────────

function SectionError() {
  return (
    <p className="py-6 text-center text-sm text-muted-foreground">
      Failed to load. Please try again.
    </p>
  );
}

// ─── Section card header ──────────────────────────────────────────────────────

function SectionCardHeader({
  title,
  actionLabel,
  actionHref,
}: {
  title: string;
  actionLabel: string;
  actionHref?: string;
}) {
  return (
    <CardHeader className="items-center border-b px-5 py-5 sm:px-6">
      <CardTitle className="text-base font-semibold leading-none">{title}</CardTitle>
      {actionHref ? (
        <CardAction className="self-center">
          <Button
            type="button"
            variant="link"
            className="h-auto px-0 text-sm font-medium text-primary"
            asChild
          >
            <Link to={actionHref}>{actionLabel}</Link>
          </Button>
        </CardAction>
      ) : null}
    </CardHeader>
  );
}

// ─── UI sub-components ────────────────────────────────────────────────────────

function StatTile({ label, value, icon: Icon, accent }: StatCard) {
  return (
    <Card className="min-w-0 p-0 py-0 shadow-xs">
      <div className="flex h-full min-w-0 flex-col gap-3 p-4 sm:gap-4 sm:p-5">
        <div className={cn("flex size-9 items-center justify-center rounded-xl", accent)}>
          <Icon className="size-4" />
        </div>
        <div className="space-y-1">
          <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-[2rem]">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  );
}

function CourseTile({ title, instructor, tasks, progress, accent }: CourseCard) {
  return (
    <Card className="min-w-0 overflow-hidden p-0 py-0 shadow-xs">
      <div className={cn("h-1 w-full", accent)} />
      <div className="flex h-full min-w-0 flex-col gap-4 p-4 sm:gap-5 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-foreground sm:text-base">{title}</h3>
            <p className="text-sm text-muted-foreground">{instructor}</p>
          </div>
          <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-xs">{tasks}</Badge>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
        <Button variant="ghost" className="h-auto justify-start gap-1 px-0 text-primary hover:bg-transparent hover:text-primary/80" asChild>
          <Link to="/courses" className="flex items-center gap-1">
            Open Course
            <ArrowUpRight className="size-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

function AssignmentRow({ title, course, due, status, statusClass, icon: Icon }: AssignmentCard) {
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{course}</p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-xs text-muted-foreground">{due}</span>
        <Badge className={cn("rounded-full px-2.5 py-1 text-xs", statusClass)}>{status}</Badge>
      </div>
    </div>
  );
}

function ReminderRow({ title, detail, icon: Icon, accent, selected }: ReminderCard) {
  return (
    <div className={cn(
      "flex items-start gap-3 rounded-2xl border p-4 transition-colors",
      selected ? "border-primary/10 bg-primary/10" : "border-border bg-background hover:bg-muted/50"
    )}>
      <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", accent)}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm font-semibold", selected ? "text-primary" : "text-foreground")}>{title}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "";

  usePageHeader({
    title: formatGreeting(firstName),
    description: "Here's what's on your plate today.",
  });

  const { data: statsData,       isLoading: statsLoading,       error: statsError       } = useDashboardStats();
  const { data: coursesData,     isLoading: coursesLoading,     error: coursesError     } = useCourses();
  const { data: assignmentsData, isLoading: assignmentsLoading, error: assignmentsError } = useAssignments();
  const { data: gradesData,      isLoading: gradesLoading,      error: gradesError      } = useGrades();
  const { data: remindersData,   isLoading: remindersLoading,   error: remindersError   } = useReminders();

  // Map raw API data to presentation shapes.
  const stats       = statsData       ? mapStats(statsData)                           : [];
  const courses     = coursesData     ? coursesData.map(mapCourse)                   : [];
  const assignments = assignmentsData ? assignmentsData.map(mapAssignment)           : [];
  const grades      = gradesData      ? gradesData.map(mapGrade)                     : [];
  const reminders   = remindersData   ? remindersData.map(mapReminder)               : [];

  return (
    <div className="w-full min-w-0 space-y-6">

      {/* ── Stat cards ── */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statsLoading ? <StatsSkeleton /> : statsError ? (
          <div className="col-span-2 md:col-span-4"><SectionError /></div>
        ) : (
          stats.map((card) => <StatTile key={card.label} {...card} />)
        )}
      </section>

      {/* ── Courses + Assignments ── */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="p-0 py-0 shadow-xs">
          <SectionCardHeader title="My Courses" actionLabel="View all" actionHref="/courses" />
          <CardContent className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
            {coursesLoading ? <CoursesSkeleton /> : coursesError ? (
              <div className="col-span-2"><SectionError /></div>
            ) : (
              courses.slice(0, 2).map((course) => <CourseTile key={course.id} {...course} />)
            )}
          </CardContent>
        </Card>

        <Card className="p-0 py-0 shadow-xs">
          <SectionCardHeader title="Upcoming Assignments" actionLabel="View all" actionHref="/assignments" />
          <CardContent className="divide-y px-5 py-4 sm:px-6">
            {assignmentsLoading ? <AssignmentsSkeleton /> : assignmentsError ? (
              <SectionError />
            ) : (
              assignments.map((a) => <AssignmentRow key={a.id} {...a} />)
            )}
          </CardContent>
        </Card>
      </section>

      {/* ── Grades + Reminders ── */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="p-0 py-0 shadow-xs">
          <SectionCardHeader title="Recent Grades" actionLabel="Full gradebook" actionHref="/grades" />
          <CardContent className="px-5 py-4 sm:px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Assessment</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradesLoading ? <GradesSkeleton /> : gradesError ? (
                  <TableRow>
                    <TableCell colSpan={3}><SectionError /></TableCell>
                  </TableRow>
                ) : (
                  grades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell className="font-medium text-foreground">{grade.title}</TableCell>
                      <TableCell className="text-muted-foreground">{grade.course}</TableCell>
                      <TableCell className={cn("text-right font-semibold", grade.scoreClass)}>
                        {grade.score}{" "}
                        <span className="text-muted-foreground">/ {grade.maxScore}</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="p-0 py-0 shadow-xs">
          <SectionCardHeader title="Reminders" actionLabel="See all" actionHref="/reminders" />
          <CardContent className="space-y-3 px-5 py-5 sm:px-6">
            {remindersLoading ? <RemindersSkeleton /> : remindersError ? (
              <SectionError />
            ) : (
              reminders.map((r) => <ReminderRow key={r.id} {...r} />)
            )}
          </CardContent>
        </Card>
      </section>

    </div>
  );
}