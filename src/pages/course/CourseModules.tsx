import { ArrowRight, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const MODULES = [
  {
    id: 1,
    title: "Algebra Fundamentals",
    lessons: 4,
    completed: true,
  },
  {
    id: 2,
    title: "Linear Equations",
    lessons: 5,
    completed: true,
  },
  {
    id: 3,
    title: "Quadratic Functions",
    lessons: 6,
    completed: false,
  },
  {
    id: 4,
    title: "Trigonometry Basics",
    lessons: 4,
    completed: false,
  },
];

export default function CourseModules() {
  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-6 text-xl font-bold">Course Modules</h2>
      
      <div className="flex flex-col gap-4">
        {MODULES.map((mod) => (
          <Card
            key={mod.id}
            className="flex cursor-pointer items-center justify-between p-4 shadow-sm transition-colors hover:bg-muted/50 sm:p-6"
          >
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Icon Circle */}
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full sm:size-12",
                  mod.completed ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                )}
              >
                {mod.completed ? (
                  <Check className="size-5 sm:size-6" strokeWidth={3} />
                ) : (
                  <span className="text-lg font-bold sm:text-xl">{mod.id}</span>
                )}
              </div>
              
              {/* Text content */}
              <div>
                <h3 className="text-base font-semibold sm:text-lg">{mod.title}</h3>
                <p className="text-sm text-muted-foreground">{mod.lessons} lessons</p>
              </div>
            </div>
            
            {/* Arrow */}
            <div className="text-primary">
              <ArrowRight className="size-5 sm:size-6" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
