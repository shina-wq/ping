import { format } from "date-fns";
import { BarChart3, BookOpen, CalendarCheck, ClipboardList, FileText, Star, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import type { Assignment } from "@/api/assignments";
import type { StudentDashboardStats, TeacherDashboardStats } from "@/api/dashboard";

import { useAuth } from "@/contexts/auth-context";

import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useCourses } from "@/hooks/use-courses";
import { useAssignments } from "@/hooks/use-assignments";
import { useGrades } from "@/hooks/use-grades";
import { useReminders } from "@/hooks/use-reminders";
import { useRecentSubmissions, type RecentSubmissionWithContext } from "@/hooks/use-needs-grading";

import { usePageHeader } from "@/components/page-header-context";

import { StatsGrid, type StatCard } from "@/components/stat-tile";
import { CourseCard, CourseCardSkeleton, mapCourse } from "@/components/course-card";
import { AssignmentRow, AssignmentRowSkeleton, mapAssignment } from "@/components/assignment-row";
import { ReminderCard, ReminderCardSkeleton, ReminderEmptyState, mapReminder } from "@/components/reminder-card";
import { TeacherCourseRow, TeacherCourseRowSkeleton, mapTeacherCourse } from "@/components/teacher-course-row";
import { SectionCardHeader } from "@/components/section-card-header";
import { SectionError } from "@/components/section-error";
import { DataTable } from "@/components/data-table";
import { gradeColumns } from "@/components/grade-columns";
import { useAssignmentColumns } from "@/components/assignment-list";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { getInitials } from "@/lib/format";
import { formatGreeting } from "@/lib/greeting";

const UPCOMING_ASSIGNMENT_STATUSES = new Set(["upcoming", "due_soon", "due_tomorrow", "overdue"]);


function mapStats(s: StudentDashboardStats): StatCard[] {
  return [
    { label: "Active Courses", value: String(s.activeCourses), icon: BookOpen, accent: "bg-primary/10 text-primary" },
    { label: "Pending Assignments", value: String(s.pendingAssignments), icon: FileText, accent: "bg-orange-500/10 text-orange-500" },
    { label: "Average Grade", value: `${s.averageGrade}%`, icon: Star, accent: "bg-emerald-500/10 text-emerald-600" },
    { label: "Assignments due this week", value: String(s.assignmentsDueThisWeek), icon: FileText, accent: "bg-rose-500/10 text-rose-500" },
  ];
}

function mapTeacherStats(s: TeacherDashboardStats): StatCard[] {
  return [
    { label: "Total Students", value: String(s.totalStudents), icon: Users, accent: "bg-primary/10 text-primary" },
    { label: "Pending to Grade", value: String(s.pendingSubmissions), icon: ClipboardList, accent: "bg-orange-500/10 text-orange-500" },
    { label: "Class Average", value: `${s.averageClassGrade}%`, icon: BarChart3, accent: "bg-emerald-500/10 text-emerald-600" },
    { label: "Published This Week", value: String(s.assignmentsPublishedThisWeek), icon: CalendarCheck, accent: "bg-violet-500/10 text-violet-500" },
  ];
}

// Teacher submission row
function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const diffMin = Math.max(1, Math.round((Date.now() - date.getTime()) / 60_000));
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return format(date, "MMM d");
}

function submissionStatusLabel(status: RecentSubmissionWithContext["status"]) {
  if (status === "graded") return "Graded";
  if (status === "returned") return "Returned";
  return "Submitted";
}

function RecentSubmissionRow({ submission }: { submission: RecentSubmissionWithContext }) {
  const name = submission.studentName ?? "Student";
  const isGraded = submission.status === "graded";

  return (
    <div className="flex items-center gap-3 py-3">
      <Avatar className="size-8 shrink-0">
        <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {submission.assignmentTitle} &bull; {submission.courseName}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-xs text-muted-foreground">{timeAgo(submission.submittedAt)}</span>
        <Badge variant={isGraded ? "secondary" : "info"} className="h-5 rounded-full px-2 text-[10px]">
          {submissionStatusLabel(submission.status)}
        </Badge>
      </div>
    </div>
  );
}

function RecentSubmissionSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3">
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </>
  );
}

// Page
export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "";
  const isTeacher = user?.role === "teacher";
  const navigate = useNavigate();

  usePageHeader({
    title: formatGreeting(firstName),
    description: isTeacher
      ? "Here's what's happening across your courses today."
      : "Here's what's on your plate today.",
  });

  const { data: statsData, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: courses, isLoading: coursesLoading, error: coursesError } = useCourses({ limit: 4 });
  const { data: assignmentsData, isLoading: assignmentsLoading, error: assignmentsError } = useAssignments({ limit: 10 });
  const { data: gradesData, isLoading: gradesLoading, error: gradesError } = useGrades({ limit: 4 });
  const { data: remindersData, isLoading: remindersLoading, error: remindersError } = useReminders();
  const {
    data: recentSubmissions,
    pendingByCourse,
    isLoading: recentSubmissionsLoading,
    error: recentSubmissionsError,
  } = useRecentSubmissions({ enabled: isTeacher });

  if (isTeacher) {
    const teacherStats = statsData ? mapTeacherStats(statsData as TeacherDashboardStats) : [];
    const teacherCourses = courses
      ? courses.map((c, i) => mapTeacherCourse(c, i, pendingByCourse))
      : [];
    const upcomingAssignments = assignmentsData
      ? assignmentsData
          .filter((assignment) => UPCOMING_ASSIGNMENT_STATUSES.has(assignment.status))
          .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
          .map(mapAssignment)
      : [];

    return (
      <div className="w-full min-w-0 space-y-6">
        {/* Teacher */}
        {/* Stat cards */}
        <StatsGrid stats={teacherStats} isLoading={statsLoading} error={statsError} />

        {/* My Courses + Upcoming Assignments */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Card className="p-0 py-0 shadow-xs">
            <SectionCardHeader title="My Courses" actionLabel="View all" actionHref="/courses" />
            <CardContent className="divide-y px-5 py-2 sm:px-6">
              {coursesLoading ? (
                <TeacherCourseRowSkeleton count={3} />
              ) : coursesError ? (
                <SectionError />
              ) : teacherCourses.length ? (
                teacherCourses.slice(0, 4).map((c) => <TeacherCourseRow key={c.id} {...c} />)
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  You aren't teaching any courses yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="p-0 py-0 shadow-xs">
            <SectionCardHeader title="Upcoming Assignments" actionLabel="View all" actionHref="/assignments" />
            <CardContent className="divide-y px-5 py-2 sm:px-6">
              {assignmentsLoading ? (
                <AssignmentRowSkeleton count={4} />
              ) : assignmentsError ? (
                <SectionError />
              ) : upcomingAssignments.length ? (
                upcomingAssignments.slice(0, 4).map((assignment) => <AssignmentRow key={assignment.id} {...assignment} />)
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">No upcoming assignments right now.</p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Recent Submissions + Reminders */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Card className="p-0 py-0 shadow-xs">
            <SectionCardHeader title="Recent Submissions" actionLabel="View all" actionHref="/assignments" />
            <CardContent className="divide-y px-5 py-2 sm:px-6">
              {recentSubmissionsLoading ? (
                <RecentSubmissionSkeleton count={4} />
              ) : recentSubmissionsError ? (
                <SectionError />
              ) : recentSubmissions?.length ? (
                recentSubmissions.map((submission) => (
                  <RecentSubmissionRow key={submission.id} submission={submission} />
                ))
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">No recent submissions yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="p-0 py-0 shadow-xs">
            <SectionCardHeader title="Reminders" actionLabel="See all" actionHref="/reminders" />
            <CardContent className="space-y-3 px-5 py-5 sm:px-6">
              {remindersLoading ? <ReminderCardSkeleton count={3} /> : remindersError ? (
                <SectionError />
              ) : remindersData?.length ? (
                remindersData.map((reminder) => <ReminderCard key={reminder.id} {...mapReminder(reminder)} />)
              ) : (
                <ReminderEmptyState />
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  const stats = statsData ? mapStats(statsData as StudentDashboardStats) : [];
  const dashboardCourses = courses ? courses.map(mapCourse).slice(0, 2) : [];
  const dashboardAssignments: Assignment[] = assignmentsData
    ? assignmentsData
        .filter((a) => a.status === "upcoming" || a.status === "overdue")
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 4)
    : [];
  const grades = gradesData ?? [];
  const reminders = remindersData ? remindersData.map(mapReminder) : [];
  const assignmentColumns = useAssignmentColumns();

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Student */}
      {/* Stat cards */}
      <StatsGrid stats={stats} isLoading={statsLoading} error={statsError} />

      {/* Courses + Assignments */}
      <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-foreground">My Courses</h2>
            <Link to="/courses" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          {coursesLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <CourseCardSkeleton count={2} />
            </div>
          ) : coursesError ? (
            <SectionError />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {dashboardCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-foreground">Upcoming Assignments</h2>
            <Link to="/assignments" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <DataTable
            columns={assignmentColumns}
            data={dashboardAssignments}
            getRowId={(assignment) => assignment.id}
            isLoading={assignmentsLoading}
            skeletonRowCount={4}
            rowClassName={() => undefined}
            error={assignmentsError ? <SectionError /> : null}
            emptyMessage="No upcoming assignments right now."
            onRowClick={(assignment) => navigate(`/assignments/${assignment.id}`)}
            className="rounded-2xl border border-border bg-card shadow-xs"
          />
        </div>
      </section>

      {/* Grades + Reminders */}
      <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-foreground">Recent Grades</h2>
            <Link to="/grades" className="text-sm font-medium text-primary hover:underline">
              Full gradebook
            </Link>
          </div>
          <DataTable
            columns={gradeColumns}
            data={grades}
            getRowId={(grade) => grade.id}
            isLoading={gradesLoading}
            skeletonRowCount={4}
            error={gradesError ? <SectionError /> : null}
            emptyMessage="No recent grades yet."
            className="rounded-2xl border border-border bg-card shadow-xs"
          />
        </div>

        <Card className="p-0 py-0 shadow-xs">
          <SectionCardHeader title="Reminders" actionLabel="See all" actionHref="/reminders" />
          <CardContent className="space-y-3 px-5 py-5 sm:px-6">
            {remindersLoading ? <ReminderCardSkeleton count={3} /> : remindersError ? (
              <SectionError />
            ) : reminders.length ? (
              reminders.map((r) => <ReminderCard key={r.id} {...r} />)
            ) : (
              <ReminderEmptyState />
            )}
          </CardContent>
        </Card>
      </section>

    </div>
  );
}