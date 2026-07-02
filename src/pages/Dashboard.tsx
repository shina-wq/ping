import { BookOpen, FileText, Star, type LucideIcon } from "lucide-react";

import type { StudentDashboardStats } from "@/api/dashboard";

import { useAuth } from "@/contexts/auth-context";

import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useCourses } from "@/hooks/use-courses";
import { useAssignments } from "@/hooks/use-assignments";
import { useGrades } from "@/hooks/use-grades";
import { useReminders } from "@/hooks/use-reminders";

import { usePageHeader } from "@/components/page-header-context";
import { CourseCard, CourseCardSkeleton, mapCourse } from "@/components/course-card";
import { AssignmentRow, AssignmentRowSkeleton, mapAssignment } from "@/components/assignment-row";
import { GradeRow, GradeRowSkeleton, mapGrade } from "@/components/grade-row";
import { ReminderCard, ReminderCardSkeleton, mapReminder } from "@/components/reminder-card";
import { SectionCardHeader } from "@/components/section-card-header";
import { SectionError } from "@/components/section-error";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { formatGreeting } from "@/lib/greeting";
import { cn } from "@/lib/utils";

// Stat tile
type StatCard = {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: string;
};

function mapStats(s: StudentDashboardStats): StatCard[] {
  return [
    { label: "Active Courses", value: String(s.activeCourses), icon: BookOpen, accent: "bg-primary/10 text-primary" },
    { label: "Pending Assignments", value: String(s.pendingAssignments), icon: FileText, accent: "bg-orange-500/10 text-orange-500" },
    { label: "Average Grade", value: `${s.averageGrade}%`, icon: Star, accent: "bg-emerald-500/10 text-emerald-600" },
    { label: "Assignments due this week", value: String(s.assignmentsDueThisWeek), icon: FileText, accent: "bg-rose-500/10 text-rose-500" },
  ];
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

// Page
export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "";
  const isTeacher = user?.role === "teacher";

  usePageHeader({
    title: formatGreeting(firstName),
    description: "Here's what's on your plate today.",
  });

  const { data: statsData, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useCourses({ limit: 2 });
  const { data: assignmentsData, isLoading: assignmentsLoading, error: assignmentsError } = useAssignments({ limit: 10 });
  const { data: gradesData, isLoading: gradesLoading, error: gradesError } = useGrades({ limit: 4 });
  const { data: remindersData, isLoading: remindersLoading, error: remindersError } = useReminders();

  // Teacher dashboard isn't built yet — the stats shape differs
  // (totalStudents, pendingSubmissions, etc) and needs its own view.
  // For now, the student view below renders only when stats match that shape.
  const stats = !isTeacher && statsData ? mapStats(statsData as StudentDashboardStats) : [];
  const mappedCourses = courses ? courses.map(mapCourse) : [];
  const assignments = assignmentsData
    ? assignmentsData
        .filter((a) => a.status === "upcoming" || a.status === "overdue")
        .map(mapAssignment)
    : [];
  const grades = gradesData ? gradesData.map(mapGrade) : [];
  const reminders = remindersData ? remindersData.map(mapReminder) : [];

  if (isTeacher) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Teacher dashboard is coming soon.
      </p>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-6">

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statsLoading ? <StatsSkeleton /> : statsError ? (
          <div className="col-span-2 md:col-span-4"><SectionError /></div>
        ) : (
          stats.map((card) => <StatTile key={card.label} {...card} />)
        )}
      </section>

      {/* Courses + Assignments */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="p-0 py-0 shadow-xs">
          <SectionCardHeader title="My Courses" actionLabel="View all" actionHref="/courses" />
          <CardContent className="grid grid-cols-1 gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
            {coursesLoading ? <CourseCardSkeleton count={2} /> : coursesError ? (
              <div className="col-span-2"><SectionError /></div>
            ) : (
              mappedCourses.slice(0, 2).map((course) => <CourseCard key={course.id} {...course} />)
            )}
          </CardContent>
        </Card>

        <Card className="p-0 py-0 shadow-xs">
          <SectionCardHeader title="Upcoming Assignments" actionLabel="View all" actionHref="/assignments" />
          <CardContent className="divide-y px-5 py-4 sm:px-6">
            {assignmentsLoading ? <AssignmentRowSkeleton count={4} /> : assignmentsError ? (
              <SectionError />
            ) : (
              assignments.slice(0, 4).map((a) => <AssignmentRow key={a.id} {...a} />)
            )}
          </CardContent>
        </Card>
      </section>

      {/* Grades + Reminders */}
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
                {gradesLoading ? <GradeRowSkeleton count={4} /> : gradesError ? (
                  <TableRow>
                    <TableCell colSpan={3}><SectionError /></TableCell>
                  </TableRow>
                ) : (
                  grades.map((grade) => <GradeRow key={grade.id} {...grade} />)
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="p-0 py-0 shadow-xs">
          <SectionCardHeader title="Reminders" actionLabel="See all" actionHref="/reminders" />
          <CardContent className="space-y-3 px-5 py-5 sm:px-6">
            {remindersLoading ? <ReminderCardSkeleton count={3} /> : remindersError ? (
              <SectionError />
            ) : (
              reminders.map((r) => <ReminderCard key={r.id} {...r} />)
            )}
          </CardContent>
        </Card>
      </section>

    </div>
  );
}