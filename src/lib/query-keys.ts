export const queryKeys = {
  auth: {
    session: () => ["auth", "session"] as const,
  },
  users: {
    me: () => ["users", "me"] as const,
    all: (params?: Record<string, unknown>) => ["users", "list", params] as const,
    detail: (id: string) => ["users", id] as const,
  },
  assignments: {
    all: (params?: Record<string, unknown>) => ["assignments", params] as const,
    byCourse: (courseId: string, params?: Record<string, unknown>) =>
      ["assignments", "course", courseId, params] as const,
    detail: (id: string) => [...queryKeys.assignments.all(), id] as const,
  },
  submissions: {
    byAssignment: (assignmentId: string) => ["submissions", assignmentId] as const,
    detail: (assignmentId: string, submissionId: string) =>
      ["submissions", assignmentId, submissionId] as const,
  },
  courses: {
    all: (params?: Record<string, unknown>) => ["courses", params] as const,
    detail: (id: string) => ["courses", id] as const,
    students: (courseId: string, params?: Record<string, unknown>) =>
      ["courses", courseId, "students", params] as const,
  },
  modules: {
    byCourse: (courseId: string, params?: Record<string, unknown>) =>
      ["modules", courseId, params] as const,
  },
  lessons: {
    byModule: (courseId: string, moduleId: string, params?: Record<string, unknown>) =>
      ["lessons", courseId, moduleId, params] as const,
    detail: (lessonId: string) => ["lessons", "detail", lessonId] as const,
  },
  announcements: {
    byCourse: (courseId: string, params?: Record<string, unknown>) =>
      ["announcements", courseId, params] as const,
  },
  dashboard: {
    student: () => ["dashboard", "student"] as const,
    teacher: () => ["dashboard", "teacher"] as const,
  },
  grades: {
    all: (params?: Record<string, unknown>) => ["grades", params] as const,
    detail: (id: string) => ["grades", "detail", id] as const,
  },
  notifications: {
    all: (params?: Record<string, unknown>) => ["notifications", params] as const,
    count: () => [...queryKeys.notifications.all(), "count"] as const,
  },
  reminders: {
    all: (params?: Record<string, unknown>) => ["reminders", params] as const,
  },
};