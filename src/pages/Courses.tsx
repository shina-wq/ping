import { useState } from "react";
import { ArrowRight, BookOpen } from "lucide-react";

import { usePageHeader } from "@/components/page-header-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Course = {
  id: string;
  title: string;
  instructor: string;
  tasks: number;
  progress: number;
  colorClass: string;
  status: "in-progress" | "completed" | "not-started";
};

const coursesData: Course[] = [
  {
    id: "math-101",
    title: "Mathematics 101",
    instructor: "Dr. Johnson",
    tasks: 3,
    progress: 72,
    colorClass: "bg-blue-500",
    status: "in-progress",
  },
  {
    id: "eng-lit",
    title: "English Literature",
    instructor: "Ms. Carter",
    tasks: 1,
    progress: 55,
    colorClass: "bg-sky-500",
    status: "in-progress",
  },
  {
    id: "bio-fund",
    title: "Biology Fundamentals",
    instructor: "Mr. Osei",
    tasks: 2,
    progress: 88,
    colorClass: "bg-emerald-500",
    status: "in-progress",
  },
  {
    id: "world-hist",
    title: "World History",
    instructor: "Mrs. Patel",
    tasks: 4,
    progress: 40,
    colorClass: "bg-orange-500",
    status: "in-progress",
  },
  {
    id: "comp-sci",
    title: "Computer Science",
    instructor: "Mr. Lee",
    tasks: 2,
    progress: 63,
    colorClass: "bg-purple-500",
    status: "in-progress",
  },
  {
    id: "art-design",
    title: "Art & Design",
    instructor: "Ms. Dubois",
    tasks: 0,
    progress: 91,
    colorClass: "bg-pink-500",
    status: "completed",
  },
];

export default function Courses() {
  usePageHeader({
    title: "My Courses",
    description: "6 enrolled courses - Fall Semester 2024",
  });

  const [activeTab, setActiveTab] = useState<"all" | "in-progress" | "completed" | "not-started">("all");

  const filteredCourses = coursesData.filter((course) => {
    return activeTab === "all" || course.status === activeTab;
  });

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Filter Tabs Row */}
      <div className="flex flex-wrap gap-2">
        {(["all", "in-progress", "completed", "not-started"] as const).map((tab) => {
          const label = {
            all: "All Courses",
            "in-progress": "In Progress",
            completed: "Completed",
            "not-started": "Not Started",
          }[tab];
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer border",
                isActive
                  ? "bg-primary border-primary text-primary-foreground font-semibold"
                  : "bg-background border-border text-muted-foreground hover:bg-muted/70 hover:text-foreground"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="group min-w-0 overflow-hidden p-0 py-0 shadow-xs hover:shadow-md transition-all duration-300 border border-border bg-card"
            >
              {/* Top accent color stripe */}
              <div className={cn("h-1 w-full", course.colorClass)} />
              
              <CardContent className="flex flex-col justify-between gap-5 p-5">
                {/* Course Title, Instructor & Tasks badge */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="truncate text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {course.instructor}
                    </p>
                  </div>
                  <Badge variant={course.tasks > 0 ? "info" : "secondary"}>
                    {course.tasks} {course.tasks === 1 ? "task" : "tasks"}
                  </Badge>
                </div>

                {/* Progress bar and numeric labels */}
                <div className="space-y-2 select-none">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground font-semibold">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </div>

                {/* Bottom navigation link */}
                <div className="pt-1">
                  <Button variant="link" className="h-auto p-0 font-bold">
                    Open Course
                    <ArrowRight className="size-4 ml-0.5 transition-transform group-hover:translate-x-1 duration-200" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-2xl bg-muted/20">
          <BookOpen className="size-12 text-muted-foreground/60 mb-3" />
          <h3 className="text-base font-semibold text-foreground">No courses found</h3>
          <p className="text-sm text-muted-foreground max-w-xs mt-1">
            We couldn't find any courses matching your selection. Try adjusting your search query or filters.
          </p>
        </div>
      )}
    </div>
  );
}
