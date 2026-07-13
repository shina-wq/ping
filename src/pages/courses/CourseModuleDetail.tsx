import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Circle,
    FileText,
    Lock,
    MoreHorizontal,
    Pencil,
    Play,
    Plus,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { useAuth } from "@/contexts/auth-context";
import { useModules } from "@/hooks/use-modules";
import { useLessons, useCompleteLesson, useDeleteLesson } from "@/hooks/use-modules";
import { LessonFormDialog } from "@/components/lesson-form-dialog";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import type { Lesson, LessonStatus, LessonType } from "@/api/modules";

// Status & type display config
const STATUS_ICON = {
    completed: { icon: CheckCircle2, className: "text-success" },
    current:   { icon: Circle,       className: "text-primary" },
    locked:    { icon: Lock,         className: "text-muted-foreground/40" },
} satisfies Record<LessonStatus, { icon: typeof Play; className: string }>;

const TYPE_LABEL: Record<LessonType, string> = {
    video:   "Video",
    reading: "Reading",
    quiz:    "Quiz",
};

function getStatusIconConfig(status: LessonStatus, lessonId: string) {
    const config = STATUS_ICON[status];
    if (!config) {
        console.warn(
            `Unknown lesson status "${status}" for lesson ${lessonId}. Falling back to "locked".`
        );
        return STATUS_ICON.locked;
    }
    return config;
}

function ModuleDetailSkeleton() {
    return (
        <div className="flex min-h-0 flex-col gap-6 lg:flex-row lg:gap-10">
            <aside className="w-full shrink-0 lg:w-68">
                <Skeleton className="mb-3 h-24 w-full rounded-xl" />
                <div className="space-y-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full rounded-lg" />
                    ))}
                </div>
            </aside>
            <main className="min-w-0 flex-1 space-y-6">
                <Skeleton className="aspect-video w-full rounded-2xl" />
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-20 w-full rounded-xl" />
            </main>
        </div>
    );
}

// component
export default function CourseModuleDetail() {
    const { moduleId, courseId } = useParams<{ moduleId: string; courseId: string }>();
    const { user } = useAuth();
    const isTeacher = user?.role === "teacher";

    const { data: modules } = useModules(courseId ?? "");
    const moduleMeta = modules?.find((m) => m.id === moduleId);

    const { data: lessons, isLoading, error } = useLessons(courseId ?? "", moduleId ?? "");
    const completeLesson = useCompleteLesson();
    const deleteLesson   = useDeleteLesson();

    const [activeLesson,   setActiveLesson]   = useState<Lesson | null>(null);
    const [editingLesson,  setEditingLesson]  = useState<Lesson | null>(null);
    const [deletingLesson, setDeletingLesson] = useState<Lesson | null>(null);

    // Default to the current lesson, falling back to the first, whenever
    // the lesson list loads or changes.
    useEffect(() => {
        if (!lessons?.length) return;
        const defaultLesson = lessons.find((l) => l.status === "current") ?? lessons[0];
        setActiveLesson((prev) => prev ?? defaultLesson);
    }, [lessons]);

    if (isLoading) return <ModuleDetailSkeleton />;

    if (error) {
        return (
            <p className="py-12 text-center text-sm text-muted-foreground">
                Failed to load this module. Please try again.
            </p>
        );
    }

    if (!lessons?.length || !activeLesson) {
        return (
            <div className="flex min-h-0 flex-col gap-6 lg:flex-row lg:gap-10">
                {/* Sidebar — still show Add button even when no lessons yet */}
                {isTeacher && (
                    <aside className="w-full shrink-0 lg:w-68">
                        <p className="mb-4 text-sm text-muted-foreground">No lessons yet.</p>
                        <LessonFormDialog
                            courseId={courseId ?? ""}
                            moduleId={moduleId ?? ""}
                            defaultOrder={1}
                            trigger={
                                <Button variant="outline" className="w-full">
                                    <Plus className="size-4" />
                                    Add Lesson
                                </Button>
                            }
                        />
                    </aside>
                )}
                {!isTeacher && (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        No lessons found.
                    </p>
                )}
            </div>
        );
    }

    const completedCount = lessons.filter((l) => l.status === "completed").length;
    const progress = Math.round((completedCount / lessons.length) * 100);

    const activeIndex  = lessons.findIndex((l) => l.id === activeLesson.id);
    const prevLesson   = activeIndex > 0 ? lessons[activeIndex - 1] : null;
    const nextLesson   = activeIndex < lessons.length - 1 ? lessons[activeIndex + 1] : null;
    const isNextLocked = nextLesson?.status === "locked";

    function handleNext() {
        if (!nextLesson || isNextLocked || !activeLesson) return;
        // Mark the lesson we're leaving as complete, then advance.
        completeLesson.mutate(activeLesson.id);
        setActiveLesson(nextLesson);
    }

    return (
        <div className="flex min-h-0 flex-col gap-6 lg:flex-row lg:gap-10">
            {/* Lesson sidebar */}
            <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-68 lg:self-start">
                {/* Progress card */}
                <div className="mb-3 rounded-xl border border-border bg-card p-4 shadow-xs">
                    <p className="mb-0.5 text-sm font-semibold text-foreground">
                        {moduleMeta?.title ?? "Module"}
                    </p>
                    <p className="mb-3 text-xs text-muted-foreground">
                        {completedCount} / {lessons.length} lessons completed
                    </p>
                    <Progress value={progress} className="h-1.5" />
                </div>

                {/* Lesson list */}
                <nav className="space-y-0.5">
                    {lessons.map((lesson) => {
                        const { icon: StatusIcon, className: iconClass } = getStatusIconConfig(lesson.status, lesson.id);
                        const isActive = lesson.id === activeLesson.id;
                        const isLocked = lesson.status === "locked";

                        return (
                            <div key={lesson.id} className="group relative flex items-start">
                                <button
                                    onClick={() => !isLocked && setActiveLesson(lesson)}
                                    disabled={isLocked}
                                    className={cn(
                                        "flex min-w-0 flex-1 items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : isLocked
                                            ? "cursor-not-allowed opacity-50"
                                            : "text-foreground hover:bg-muted"
                                    )}
                                >
                                    <StatusIcon className={cn("mt-0.5 size-4 shrink-0", iconClass)} />
                                    <div className="min-w-0">
                                        <p className="truncate font-medium leading-snug">
                                            {lesson.title}
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            {TYPE_LABEL[lesson.type]} &bull; {lesson.duration}
                                        </p>
                                    </div>
                                </button>

                                {/* Teacher-only per-lesson actions */}
                                {isTeacher && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                aria-label={`Actions for ${lesson.title}`}
                                                className="mr-1 mt-1.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                                            >
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setEditingLesson(lesson)}>
                                                <Pencil className="size-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                variant="destructive"
                                                onClick={() => setDeletingLesson(lesson)}
                                            >
                                                <Trash2 className="size-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Teacher-only: Add lesson */}
                {isTeacher && (
                    <div className="mt-3">
                        <LessonFormDialog
                            courseId={courseId ?? ""}
                            moduleId={moduleId ?? ""}
                            defaultOrder={lessons.length + 1}
                            trigger={
                                <Button variant="outline" className="w-full" size="sm">
                                    <Plus className="size-4" />
                                    Add Lesson
                                </Button>
                            }
                        />
                    </div>
                )}
            </aside>

            {/* Main content */}
            <main className="min-w-0 flex-1">
                {/* Media placeholder */}
                {activeLesson.type === "video" ? (
                    <div className="mb-6 flex aspect-video w-full items-center justify-center rounded-2xl bg-muted">
                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Play className="size-7 translate-x-0.5" />
                            </div>
                            <p className="text-sm font-medium">Video &bull; {activeLesson.duration}</p>
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-border bg-muted/40">
                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                            <FileText className="size-10" />
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
                        <ArrowLeft className="size-4" />
                        Previous
                    </Button>
                    <Button
                        disabled={!nextLesson || isNextLocked}
                        loading={completeLesson.isPending}
                        onClick={handleNext}
                    >
                        Next
                        <ArrowRight className="size-4" />
                    </Button>
                </div>
            </main>

            {/* Edit dialog — controlled, no visible trigger */}
            <LessonFormDialog
                courseId={courseId ?? ""}
                moduleId={moduleId ?? ""}
                lesson={editingLesson ?? undefined}
                open={!!editingLesson}
                onOpenChange={(next) => !next && setEditingLesson(null)}
            />

            {/* Delete confirm */}
            <ConfirmDeleteDialog
                open={!!deletingLesson}
                onOpenChange={(next) => !next && setDeletingLesson(null)}
                title="Delete Lesson"
                description={`This will permanently delete "${deletingLesson?.title}". This cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={async () => {
                    if (!deletingLesson) return;
                    await deleteLesson.mutateAsync({ lessonId: deletingLesson.id });
                    // If the deleted lesson was active, reset to first remaining lesson
                    if (activeLesson?.id === deletingLesson.id) setActiveLesson(null);
                    toast.success("Lesson deleted.");
                }}
            />
        </div>
    );
}