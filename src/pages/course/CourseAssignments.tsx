import { FileText, CheckCircle2, Calendar, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ASSIGNMENTS = [
  {
    id: 1,
    title: "Problem Set 4",
    description: "Complete exercises 4.1–4.6 from the textbook. Show all working.",
    date: "Dec 14",
    points: 20,
    status: "Due Tomorrow",
    statusVariant: "danger",
    action: "Submit",
    iconVariant: "danger",
  },
  {
    id: 2,
    title: "Chapter 6 Reading",
    description: "Read Chapter 6 and submit a one-page summary of key concepts.",
    date: "Dec 18",
    points: 10,
    status: "Upcoming",
    statusVariant: "info",
    action: "Submit",
    iconVariant: "info",
  },
  {
    id: 3,
    title: "Problem Set 3",
    description: "Quadratic equations and factoring practice.",
    date: "Dec 5",
    points: 20,
    status: "Submitted",
    statusVariant: "success",
    iconVariant: "success",
  },
  {
    id: 4,
    title: "Midterm Exam",
    description: "Covers modules 1 and 2. Closed book.",
    date: "Nov 28",
    points: 100,
    status: "Graded",
    statusVariant: "success",
    score: "88/100",
    scoreClass: "text-emerald-600",
    iconVariant: "success",
  },
  {
    id: 5,
    title: "Chapter 5 Quiz",
    description: "Short quiz on linear functions and graphing.",
    date: "Nov 30",
    points: 100,
    status: "Graded",
    statusVariant: "success",
    score: "65/100",
    scoreClass: "text-blue-600",
    iconVariant: "success",
  },
];

const VARIANTS = {
  danger: {
    iconBg: "bg-red-50 text-red-500",
    badge: "bg-red-50 text-red-500 hover:bg-red-50",
  },
  info: {
    iconBg: "bg-blue-50 text-blue-500",
    badge: "bg-blue-50 text-blue-500 hover:bg-blue-50",
  },
  success: {
    iconBg: "bg-emerald-50 text-emerald-500",
    badge: "bg-emerald-50 text-emerald-500 hover:bg-emerald-50",
  },
};

export default function CourseAssignments() {
  return (
    <div className="max-w-4xl">
      <div className="flex flex-col gap-4">
        {ASSIGNMENTS.map((assignment) => {
          const v = VARIANTS[assignment.iconVariant as keyof typeof VARIANTS];
          const sv = VARIANTS[assignment.statusVariant as keyof typeof VARIANTS];
          
          return (
            <Card
              key={assignment.id}
              className="flex flex-col gap-2 p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Icon Container */}
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    v.iconBg
                  )}
                >
                  {assignment.iconVariant === "success" ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <FileText className="size-4" />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col">
                  <h3 className="text-[15px] font-semibold text-foreground sm:text-base leading-none">
                    {assignment.title}
                  </h3>
                  <p className="mt-1 text-[13px] text-muted-foreground leading-tight">
                    {assignment.description}
                  </p>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3" />
                      <span>{assignment.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="size-3" />
                      <span>{assignment.points} pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex shrink-0 items-center justify-end gap-3 self-end sm:self-center">
                {assignment.score && (
                  <span className={cn("text-sm font-bold", assignment.scoreClass)}>
                    {assignment.score}
                  </span>
                )}
                <Badge variant="secondary" className={cn("rounded-full px-2 py-0 text-[10px] font-medium border-0", sv.badge)}>
                  {assignment.status}
                </Badge>
                {assignment.action && (
                  <Button size="sm" className="h-7 rounded-full px-3 text-xs">
                    {assignment.action}
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
