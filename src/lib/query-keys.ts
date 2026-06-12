export const queryKeys = {
  auth: {
    session: () => ["auth", "session"] as const,
  },
  assignments: {
    all: () => ["assignments"] as const,
    detail: (id: string) => [...queryKeys.assignments.all(), id] as const,
  },
  courses: {
    all: () => ["courses"] as const,
    detail: (id: string) => [...queryKeys.courses.all(), id] as const,
  },
  dashboard: {
    stats: () => ["dashboard", "stats"] as const,
  },
  grades: {
    all: () => ["grades"] as const,
    detail: (id: string) => [...queryKeys.grades.all(), id] as const,
  },
  notifications: {
    all: () => ["notifications"] as const,
    count: () => [...queryKeys.notifications.all(), "count"] as const,
  },
  reminders: {
    all: () => ["reminders"] as const,
  },
};
