import {
  ArrowUpRight,
  Bell,
  BookOpen,
  CircleCheckBig,
  Clock3,
  FileText,
  LogOut,
  Search,
  Settings,
  Star,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
  { label: "Due This Week", value: "2", icon: Clock3, accent: "bg-rose-500/10 text-rose-500" },
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

function StatTile({ label, value, icon: Icon, accent }: StatCard) {
  return (
    <Card className="p-0 py-0 shadow-xs">
      <div className="flex h-full flex-col gap-4 p-5 sm:p-6">
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
    <Card className="overflow-hidden p-0 py-0 shadow-xs">
      <div className={cn("h-1 w-full", accent)} />
      <div className="flex h-full flex-col gap-5 p-5 sm:p-6">
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
        <Button variant="ghost" className="h-auto justify-start gap-1 px-0 text-primary hover:bg-transparent hover:text-primary/80">
          Open Course
          <ArrowUpRight className="size-4" />
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
  return (
    <div className="min-h-dvh bg-linear-to-br from-background via-background to-muted/30">
      <header className="mb-6 flex flex-col gap-4 px-4 pt-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8 lg:pt-6">
        <div className="flex items-start gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
              Good morning, Aiko 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">
              Here&apos;s what&apos;s on your plate today.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="h-10 w-56 rounded-full border-border/70 bg-background/90 pl-10 pr-4 shadow-xs"
            />
          </div>

          <Button variant="outline" size="icon" className="relative">
            <Bell className="size-4" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 gap-3 rounded-full border border-border/70 bg-background/80 px-2.5 shadow-xs">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">AT</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium text-foreground sm:inline">Aiko Tanaka</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-medium text-foreground">Aiko Tanaka</p>
                <p className="text-xs text-muted-foreground">Student</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><UserRound className="size-4" /> Profile</DropdownMenuItem>
              <DropdownMenuItem><Settings className="size-4" /> Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="size-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="space-y-6 px-4 pb-6 sm:px-6 lg:px-8">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => <StatTile key={card.label} {...card} />)}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <Card className="p-0 py-0 shadow-xs">
            <CardHeader className="flex-row items-center justify-between gap-3 border-b px-5 py-5 sm:px-6">
              <CardTitle>My Courses</CardTitle>
              <button type="button" className="text-sm font-medium text-primary transition-colors hover:text-primary/80">View all</button>
            </CardHeader>
            <CardContent className="grid gap-4 px-5 py-5 sm:px-6 md:grid-cols-2 xl:grid-cols-3">
              {courses.map((course) => <CourseTile key={course.title} {...course} />)}
            </CardContent>
          </Card>

          <Card className="p-0 py-0 shadow-xs">
            <CardHeader className="flex-row items-center justify-between gap-3 border-b px-5 py-5 sm:px-6">
              <CardTitle>Upcoming Assignments</CardTitle>
              <button type="button" className="text-sm font-medium text-primary transition-colors hover:text-primary/80">View all</button>
            </CardHeader>
            <CardContent className="divide-y px-5 py-4 sm:px-6">
              {assignments.map((assignment) => <AssignmentRow key={assignment.title} {...assignment} />)}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
          <Card className="p-0 py-0 shadow-xs">
            <CardHeader className="flex-row items-center justify-between gap-3 border-b px-5 py-5 sm:px-6">
              <CardTitle>Recent Grades</CardTitle>
              <button type="button" className="text-sm font-medium text-primary transition-colors hover:text-primary/80">Full gradebook</button>
            </CardHeader>
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
            <CardHeader className="flex-row items-center justify-between gap-3 border-b px-5 py-5 sm:px-6">
              <CardTitle>Reminders</CardTitle>
              <button type="button" className="text-sm font-medium text-primary transition-colors hover:text-primary/80">See all</button>
            </CardHeader>
            <CardContent className="space-y-3 px-5 py-5 sm:px-6">
              {reminders.map((reminder) => <ReminderRow key={reminder.title} {...reminder} />)}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}