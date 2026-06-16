import { ArrowRight, Check, Clock, Clock1, Clock10 } from "lucide-react";
import {Link, useParams} from "react-router-dom";
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
  const {courseId} = useParams<{courseId: string}>();

  return (
    <div className="max-w-3xl">      
      <div className="flex flex-col gap-6">
        {MODULES.map((mod) => (
          <Link key={mod.id} to={`/courses/${courseId}/modules/${mod.id}`}>
            <Card
              className="flex cursor-pointer flex-row items-center justify-between p-6 shadow-sm transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-6">
                {/* Icon Circle */}
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-full",
                    mod.completed ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"
                  )}
                >
                  {mod.completed ? (
                    <Check className="size-6" strokeWidth={3} />
                  ) : (
                    <Clock10 className="size-6" strokeWidth={3} />
                  )}
                </div>
                
                {/* Text content */}
                <div className="text-left">
                  <h3 className="text-[17px] font-medium">{mod.title}</h3>
                  <p className="text-[13px] text-muted-foreground">{mod.lessons} lessons</p>
                </div>
              </div>
              
              {/* Arrow */}
              <div className="text-primary">
                <ArrowRight className="size-6" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
