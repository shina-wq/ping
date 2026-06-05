import {
  ArrowUpRight,
  BookOpen,
  CircleCheckBig,
  Clock3,
  FileText,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "@/contexts/auth-context";
import { usePageHeader } from "@/components/page-header-context";
import { formatGreeting } from "@/lib/greeting";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
// These are presentation-layer types that map API data to UI props.
// API response types will live in src/api/* and be mapped in Phase 3 hooks.

export type StatCard = {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: string;
};

export type CourseCard = {
  title: string;
  instructor: string;
  tasks: string;
  progress: number;
  accent: string;
};

export type AssignmentCard = {
  title: string;
  course: string;
  due: string;
  status: string;
  statusClass: string;
  icon: LucideIcon;
};

export type GradeRow = {
  title: string;
  course: string;
  score: number;
  scoreClass: string;
};

export type ReminderCard = {
  title: string;
  detail: string;
  icon: LucideIcon;
  accent: string;
  selected?: boolean;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

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

  // Derive first name from the authenticated user for the greeting.
  const firstName = user?.name.split(" ")[0] ?? "";

  usePageHeader({
    title: formatGreeting(firstName),
    description: "Here's what's on your plate today.",
  });

  // ── Phase 3: replace these with real hook calls ────────────────────────────
  // const { data: stats, isLoading: statsLoading }       = useDashboardStats();
  // const { data: courses, isLoading: coursesLoading }   = useCourses();
  // const { data: assignments, isLoading: assignLoading} = useAssignments();
  // const { data: grades, isLoading: gradesLoading }     = useGrades();
  // const { data: reminders, isLoading: remindLoading }  = useReminders();
  const stats: StatCard[]       = [];
  const courses: CourseCard[]   = [];
  const assignments: AssignmentCard[] = [];
  const grades: GradeRow[]      = [];
  const reminders: ReminderCard[] = [];
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full min-w-0 space-y-6">
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((card) => <StatTile key={card.label} {...card} />)}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="p-0 py-0 shadow-xs">
          <SectionCardHeader title="My Courses" actionLabel="View all" actionHref="/courses" />
          <CardContent className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
            {courses.slice(0, 2).map((course) => (
              <CourseTile key={course.title} {...course} />
            ))}
          </CardContent>
        </Card>

        <Card className="p-0 py-0 shadow-xs">
          <SectionCardHeader title="Upcoming Assignments" actionLabel="View all" actionHref="/assignments" />
          <CardContent className="divide-y px-5 py-4 sm:px-6">
            {assignments.map((a) => <AssignmentRow key={a.title} {...a} />)}
          </CardContent>
        </Card>
      </section>

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
                {grades.map((grade) => (
                  <TableRow key={grade.title}>
                    <TableCell className="font-medium text-foreground">{grade.title}</TableCell>
                    <TableCell className="text-muted-foreground">{grade.course}</TableCell>
                    <TableCell className={cn("text-right font-semibold", grade.scoreClass)}>
                      {grade.score} <span className="text-muted-foreground">/ 100</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="p-0 py-0 shadow-xs">
          <SectionCardHeader title="Reminders" actionLabel="See all" actionHref="/reminders" />
          <CardContent className="space-y-3 px-5 py-5 sm:px-6">
            {reminders.map((r) => <ReminderRow key={r.title} {...r} />)}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}