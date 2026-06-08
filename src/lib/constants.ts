import type { AssignmentStatus } from "@/api/assignments";

/** Accent colours cycled through for course cards — API doesn't provide colour info. */
export const COURSE_ACCENTS = [
  "bg-primary",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-orange-500",
];

/** Badge styling per assignment status, shared by Dashboard and Assignments pages. */
export const STATUS_CONFIG: Record<AssignmentStatus, { label: string; className: string }> = {
  upcoming:     { label: "Upcoming",     className: "bg-sky-500/10 text-sky-500" },
  due_soon:     { label: "Due Soon",     className: "bg-primary/10 text-primary" },
  due_tomorrow: { label: "Due Tomorrow", className: "bg-rose-500/10 text-rose-500" },
  overdue:      { label: "Overdue",      className: "bg-red-600/10 text-red-600" },
  submitted:    { label: "Submitted",    className: "bg-emerald-500/10 text-emerald-600" },
  graded:       { label: "Graded",       className: "bg-emerald-500/10 text-emerald-600" },
};
