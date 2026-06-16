import {useState} from "react";
import {Link, useParams} from "react-router-dom";
import { 
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Circle,
    FileText,
    Lock,
    Play,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import { MODULES_DATA } from "@/data/course_modules";
import type {
    Lesson,
    LessonStatus,
    LessonType,
    Module,
} from "@/types/course_modules";

// Status & type display config
const STATUS_ICON = {
    completed: {icon: CheckCircle2, className: "text-success"},
    current: {icon: Circle, className: "text-primary"},
    locked: {icon: Lock, className: "text-muted-foreground/40"},
} satisfies Record<LessonStatus, {icon: typeof Play; className: string}>;

const TYPE_LABEL: Record<LessonType, string> = {
    video: "Video",
    reading: "Reading",
    quiz: "Quiz",
};

// component
export default function CourseModuleDetail() {
    const {moduleId, courseId} = useParams<{moduleId: string; courseId: string }>();

    const module = MODULES_DATA[moduleId || "1"];

    if (!module) {
        return <div>Module not found.</div>;
    }

    // Start on the current lesson; fall back to the first
    const defaultLesson = module.lessons.find((l) => l.status === "current") ?? module.lessons[0];

    if (!defaultLesson) {
        return <div>No lessons found.</div>
    }

    const [activeLesson, setActiveLesson] = useState<Lesson>(defaultLesson);

    const completedCount = module.lessons.filter((l) => l.status === "completed").length;
    const progress = Math.round((completedCount / module.lessons.length) * 100);

    const activeIndex = module.lessons.findIndex((l) => l.id === activeLesson.id);
    const prevLesson = activeIndex > 0 ? module.lessons[activeIndex - 1] : null;
    const nextLesson = activeIndex < module.lessons.length - 1 ? module.lessons[activeIndex + 1]: null;
    const isNextLocked = nextLesson?.status === "locked";

    return (
        <div className="flex min-h-0 flex-col gap-6 lg:flex-row lg:gap-10">
            {/* Lesson sidebar */}
            <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-68 lg:self-start">
                {/* Back link */}
                <Link
                    to={`/courses/${courseId}/modules`}
                    className="mb-5 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4"/>
                    Back to Modules
                </Link>

                {/* Progress card */}
                <div className="mb-3 rounded-xl border border-border bg-card p-4 shadow-xs">
                    <p className="mb-0.5 text-sm font-semibold text-foreground">
                        {module.title}
                    </p>
                    <p className="mb-3 text-xs text-muted-foreground">
                        {completedCount} / {module.lessons.length} lessons completed
                    </p>
                    <Progress value={progress} className="h-1.5"/>
                </div>

                {/* Lesson list */}
                <nav className="space-y-0.5">
                    {module.lessons.map((lesson) => {
                        const {icon: StatusIcon, className: iconClass } = STATUS_ICON[lesson.status];
                        const isActive = lesson.id === activeLesson.id;
                        const isLocked = lesson.status === "locked";

                        return (
                            <button
                                key={lesson.id}
                                onClick={() => !isLocked && setActiveLesson(lesson)}
                                disabled={isLocked}
                                className={cn(
                                    "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                                    isActive
                                    ? "bg-primary/10 text-primary"
                                    : isLocked
                                    ? "cursor-not-allowed opacity-50"
                                    : "text-foreground hover:bg-muted"  
                                )}
                            >
                                <StatusIcon className={cn("mt-0.5 size-4 shrink-0", iconClass)}/>
                                <div className="min-w-0">
                                    <p className="truncate font-medium leading-snug">
                                        {lesson.title}
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {TYPE_LABEL[lesson.type]} &bull; {lesson.duration}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main content */}
            <main className="min-w-0 flex-1">
                {/* Media placeholder */}
                {activeLesson.type === "video" ? (
                    <div className="mb-6 flex aspect-video w-full items-center justify-center rounded-2xl bg-muted">
                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Play className="size-7 translate-x-0.5"/>
                            </div>
                            <p className="text-sm font-medium">Video &bull;{activeLesson.duration}</p>
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40">
                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <FileText className="size-10"/>
                            <p className="text-sm font-medium">
                                {TYPE_LABEL[activeLesson.type]} &bull; {activeLesson.duration}
                            </p>
                        </div>
                    </div>
                )}

                {/* Lesson header */}
                <div className="mb-6">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {TYPE_LABEL[activeLesson.type]}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {activeLesson.duration}
                        </span>
                    </div>
                    <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
                        {activeLesson.title}
                    </h1>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        {activeLesson.description}
                    </p>
                </div>

            {/* Lesson overview */}
            <div className="mb-10 rounded-xl border border-border bg-card p-5 shadow-xs">
                <h2 className="mb-2 text-sm font-semibold text-foreground">Lesson Overview</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {activeLesson.overview}
                </p>
            </div>

            {/* Prev / Next */}
            <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
                <Button
                    variant="outline"
                    disabled={!prevLesson}
                    onClick={() => prevLesson && setActiveLesson(prevLesson)}
                >
                    <ArrowLeft className="size-4"/>
                    Previous
                </Button>
                <Button
                    disabled={!nextLesson || isNextLocked}
                    onClick={() => nextLesson && !isNextLocked && setActiveLesson(nextLesson)}
                >
                    Next
                    <ArrowRight className="size-4"/>
                </Button>
            </div>
            </main>
        </div>
    )
}