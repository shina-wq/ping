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

import { usePageHeader } from "@/components/page-header-context";
import { CURRENT_USER } from "@/components/user-menu";
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

type StatCard = {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: string;
};

type CourseCard = {
  title: string;
  instructor: string;
  tasks: string;
  progress: number;
  accent: string;
};

type AssignmentCard = {
  title: string;
  course: string;
  due: string;
  status: string;
  statusClass: string;
  icon: LucideIcon;
};

type GradeRow = {
  title: string;
  course: string;
  score: number;
  scoreClass: string;
};

type ReminderCard = {
  title: string;
  detail: string;
  icon: LucideIcon;
  accent: string;
  selected?: boolean;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const statCards: StatCard[] = [
  { label: "Active Courses", value: "3", icon: BookOpen, accent: "bg-primary/10 text-primary" },
  { label: "Pending Assignments", value: "5", icon: FileText, accent: "bg-orange-500/10 text-orange-500" },
  { label: "Average Grade", value: "79%", icon: Star, accent: "bg-emerald-500/10 text-emerald-600" },
  { label: "Assignments due this week", value: "2", icon: FileText, accent: "bg-rose-500/10 text-rose-500" },
];

const courses: CourseCard[] = [
  { title: "Mathematics 101", instructor: "Dr. Johnson", tasks: "3 tasks", progress: 72, accent: "bg-primary" },
  { title: "English Literature", instructor: "Ms. Carter", tasks: "1 task", progress: 55, accent: "bg-sky-500" },
  { title: "Biology Fundamentals", instructor: "Mr. Osei", tasks: "2 tasks", progress: 88, accent: "bg-emerald-500" },
];

const assignments: AssignmentCard[] = [
  { title: "Problem Set 4", course: "Mathematics 101", due: "Dec 14", status: "Due Tomorrow", statusClass: "bg-rose-500/10 text-rose-500", icon: FileText },
  { title: "Essay Draft", course: "English Literature", due: "Dec 17", status: "Due Soon", statusClass: "bg-primary/10 text-primary", icon: FileText },
  { title: "Lab Report", course: "Biology Fundamentals", due: "Dec 20", status: "Upcoming", statusClass: "bg-sky-500/10 text-sky-500", icon: FileText },
  { title: "Chapter 5 Quiz", course: "Mathematics 101", due: "Nov 30", status: "Submitted", statusClass: "bg-emerald-500/10 text-emerald-600", icon: CircleCheckBig },
];

const grades: GradeRow[] = [
  { title: "Midterm Exam", course: "Mathematics · Nov 28", score: 88, scoreClass: "text-primary" },
  { title: "Short Story Analysis", course: "English Literature · Nov 25", score: 74, scoreClass: "text-orange-500" },
  { title: "Cell Structure Quiz", course: "Biology · Nov 20", score: 92, scoreClass: "text-emerald-600" },
  { title: "Chapter 4 Quiz", course: "Mathematics · Nov 15", score: 65, scoreClass: "text-amber-600" },
];

const reminders: ReminderCard[] = [
  { title: "Problem Set 4 due tomorrow!", detail: "Mathematics 101 · Dec 14 at 11:59 PM", icon: Clock3, accent: "bg-primary text-primary-foreground", selected: true },
  { title: "Essay Draft due in 3 days", detail: "English Literature · Dec 17", icon: FileText, accent: "bg-muted text-muted-foreground" },
  { title: "Lab Report due in 6 days", detail: "Biology Fundamentals · Dec 20", icon: FileText, accent: "bg-muted text-muted-foreground" },
];

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

const dashboardGreetingName = CURRENT_USER.name.split(" ")[0] ?? CURRENT_USER.name;

export default function Dashboard() {
  usePageHeader({
    title: formatGreeting(dashboardGreetingName),
    description: "Here's what's on your plate today.",
  });

  return (
    <div className="w-full min-w-0 space-y-6">
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {statCards.map((card) => <StatTile key={card.label} {...card} />)}
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
              {assignments.map((assignment) => <AssignmentRow key={assignment.title} {...assignment} />)}
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
              {reminders.map((reminder) => <ReminderRow key={reminder.title} {...reminder} />)}
            </CardContent>
          </Card>
        </section>
    </div>
  );
}