import { useState, useRef } from "react";
import {Link, useParams} from "react-router-dom";
import {
    ChevronRight,
    CalendarDays,
    Star,
    Paperclip,
    BellRing,
    Upload,
    XIcon
} from "lucide-react";
import {format} from "date-fns";

import { useAssignment } from "@/hooks/use-assignments";
import { usePageHeader } from "@/components/page-header-context";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Status config
type DisplayStatus = "upcoming" | "overdue" | "submitted" | "graded";

const STATUS_CONFIG: Record<DisplayStatus, {label: string; className: string}> = {
    upcoming: {label: "Upcoming", className: "bg-sky-500/10 text-white border-sky-500/20"},
    overdue: {label: "Overdue", className: "bg-red-500 text-white border-transparent"},
    submitted: {label: "Submitted", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"},
    graded: {label: "Graded", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"},
}

// Skeleton
function AssignmentDetailSkeleton() {
    return (
        <div className="-mx-4 -mt-6 flex flex-col lg:-mx-8">
            {/* Header */}
            <div className="bg-primary px-6 py-8 sm:px-10 lg:px-12">
                <div className="mb-4 mt-4 flex items-center gap-2">
                    <Skeleton className="h-4 w-20 bg-primary-foreground/20"/>
                    <ChevronRight className="size-4 text-primary-foreground/40"/>
                    <Skeleton className="h-4 w-28 bg-primary-foreground/20"/>
                    <ChevronRight className="size-4 text-primary-foreground/40"/>
                    <Skeleton className="h-4 w-24 bg-primary-foreground/20"/>
                    <ChevronRight className="size-4 text-primary-foreground/40"/>
                    <Skeleton className="h-4 w-28 bg-primary-foreground/20"/>
                </div>
                <Skeleton className="mb-2 h-9 w-64 bg-primary-foreground/20"/>
                <Skeleton className="mb-6 h-5 w-48 bg-primary-foreground/20"/>
                <div className="flex gap-6">
                    <Skeleton className="h-4 w-36 bg-primary-foreground/20"/>
                    <Skeleton className="h-4 w-24 bg-primary-foreground/20"/>
                </div>
            </div>
            {/* Body */}
            <div className="flex-1 bg-background p-6 sm:p-10 lg:px-12">
                <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                    <div className="space-y-6">
                        <Skeleton className="h-32 w-full rounded-xl"/>
                        <Skeleton className="h-48 w-full rounded-xl"/>
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full rounded-xl"/>
                        <Skeleton className="h-48 w-full rounded-xl"/>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Main page
export default function AssignmentDetail() {
    usePageHeader({title: ""});

    const {assignmentId} = useParams<{assignmentId: string}>();
    const {data: assignment, isLoading, error} = useAssignment(assignmentId ?? "");

    const [showSubmit, setShowSubmit] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const submitSectionRef = useRef<HTMLDivElement>(null);

    if (isLoading) return <AssignmentDetailSkeleton />;

    if (error || !assignment) {
        return (
            <p className="py-12 text-center text-sm text-muted-foreground">
                Assignment not found.
            </p>
        );
    }

    const dueFormatted = format(new Date(assignment.dueDate), "MMM d, yyyy 'at' h:mm a");
    const statusKey = (assignment.status === "upcoming" ? "upcoming" : assignment.status) as DisplayStatus;
    const statusCfg = STATUS_CONFIG[statusKey];
    const isSubmittable = assignment.status === "upcoming";

    function handleSubmitClick() {
        setShowSubmit(true);
        setTimeout(() => {
            submitSectionRef.current?.scrollIntoView({behavior: "smooth", block: "start"});
        }, 50);
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setSelectedFile(file);
    }

    return (
        <div className="-mx-4 -mt-6 flex flex-col lg:-mx-8">
            {/* Indigo header */}
            <div className="relative bg-primary px-6 py-8 text-primary-foreground sm:px-10 lg:px-12">
                {/* Due badge */}
                <div className="absolute right-6 top-6 sm:right-10 lg:right-12">
                    <Badge className={cn("rounded-full px-3 py-1 text-sm font-semibold", statusCfg.className)}>
                        {statusCfg.label}
                    </Badge>
                </div>

                {/* Breadcrumb */}
                <nav className="mb-4 mt-4 flex items-center gap-1 text-sm font-medium text-primary-foreground/80">
                    <Link to="/courses" className="hover:text-primary-foreground"> My Courses</Link>
                    <ChevronRight className="mx-0.5 size-4"/>
                    <Link to={`/courses/${assignment.courseId}/assignments`} className="hover:text-primary-foreground">
                    {assignment.courseName}</Link>
                    <ChevronRight className="mx-0.5 size-4"/>
                    <Link to={`/courses/${assignment.courseId}/assignments`} className="hover:text-primary-foreground">
                    Assignments</Link>
                    <ChevronRight className="mx-0.5 size-4"/>
                    <span className="text-primary-foreground">{assignment.title}</span>
                </nav>

                {/* Title */}
                <h1 className="mb-1.5 text-3xl font-bold tracking-tight">
                    {assignment.title}
                </h1>
                <p className="mb-6 text-base font-medium text-primary-foreground/90">
                    {assignment.courseName} &bull; {assignment.instructor ?? "Unknown Instructor"}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-primary-foreground/90 sm:gap-6">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="size-4"/>
                        <span>Due {dueFormatted}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Star className="size-4"/>
                        <span>{assignment.points ?? "_"} points</span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 bg-background p-6 sm:p-10 lg:px-12">
                <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
                    {/* Left column */}
                    <div className="space-y-8">
                        {/* Instructions */}
                        {assignment.description && (
                            <section className="space-y-4">
                                <h2 className="text-lg font-semibold text-foreground">Instructions</h2>
                                <Card className="shadow-xs border-border/50 p-0">
                                    <CardContent className="p-5 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                                        {assignment.description}
                                    </CardContent>
                                </Card>
                            </section>
                        )}

                        {/* Grading rubric */}
                        {assignment.gradingRubric && assignment.gradingRubric.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-lg font-semibold text-foreground">
                                Grading Rubric
                                </h2>
                                <Card className="overflow-hidden shadow-xs border-border/50 p-0">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-muted/60 text-left">
                                            <th className="px-5 py-3 font-medium text-muted-foreground">
                                                Criterion
                                            </th>
                                            <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                                                Points
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                      {assignment.gradingRubric.map((row, i) => (
                                        <tr key={i}>
                                          <td className="px-5 py-3.5 text-foreground">
                                            {row.criterion}
                                          </td>
                                          <td className="px-5 py-3.5 text-right text-muted-foreground">
                                            {row.points} pts
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                    <tfoot>
                                      <tr className="border-t border-border bg-muted/30">
                                        <td className="px-5 py-3.5 font-semibold text-foreground">Total</td>
                                        <td className="px-5 py-3.5 text-right font-bold text-foreground">
                                          {assignment.gradingRubric.reduce((sum, r) => sum + r.points, 0)} pts
                                        </td>
                                      </tr>
                                    </tfoot>
                                  </table>
                                </Card>
                            </section>
                        )}

                        {/* Submission section */}
                        {showSubmit && (
                          <section ref={submitSectionRef} className="space-y-4 scroll-mt-6">
                            <h2 className="text-lg font-semibold text-foreground">Your Submission</h2>
                            <Card className="shadow-xs border-border/50 p-0">
                              <CardContent className="p-5">
                                <div
                                  onClick={() => !selectedFile && fileInputRef.current?.click()}
                                  className={cn(
                                    "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 transition-colors",
                                    selectedFile
                                      ? "border-primary/40 bg-primary/5 cursor-default"
                                      : "border-border hover:border-primary/40 hover:bg-muted/40 cursor-pointer"
                                  )}
                                >
                                  <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <Upload className="size-5" />
                                  </div>
                                  {selectedFile ? (
                                    <>
                                      <div className="text-center">
                                        <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                      </div>
                                      {/* Remove file button */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedFile(null);
                                          if (fileInputRef.current) fileInputRef.current.value = "";
                                        }}
                                        className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                        aria-label="Remove file"
                                      >
                                        <XIcon className="size-3.5" />
                                      </button>
                                    </>
                                  ) : (
                                    <div className="text-center">
                                      <p className="text-sm font-medium text-foreground">Upload your work</p>
                                      <p className="text-xs text-muted-foreground">PDF, DOCX, or image files up to 20 MB</p>
                                    </div>
                                  )}
                                </div>
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept=".pdf,.doc,.docx,image/*"
                                  className="hidden"
                                  onChange={handleFileChange}
                                />
                                <Button className="mt-4 w-full" disabled={!selectedFile}>
                                  Submit Assignment
                                </Button>
                              </CardContent>
                            </Card>
                          </section>
                        )}
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                    {/* Submit button */}
                    {isSubmittable && !showSubmit && (
                      <Button className="w-full" onClick={handleSubmitClick}>
                        Submit Assignment
                      </Button>
                    )}

                    {/* Assignment Details card */}
                    <Card className="shadow-xs border-border/50 p-0">
                      <div className="border-b border-border/50 px-5 py-3.5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Assignment Details
                        </p>
                      </div>
                      <CardContent className="divide-y divide-border/40 p-0">
                        {[
                          { Icon: CalendarDays, label: "Course",          value: assignment.courseName },
                          { Icon: CalendarDays, label: "Instructor",      value: assignment.instructor ?? "—" },
                          { Icon: CalendarDays, label: "Due Date",        value: format(new Date(assignment.dueDate), "MMM d, yyyy") },
                          { Icon: Star,         label: "Points",          value: `${assignment.points ?? "—"} pts` },
                          { Icon: Paperclip,    label: "Submission type", value: assignment.submissionType ?? "—" },
                        ].map(({ Icon, label, value }) => (
                          <div key={label} className="flex items-start gap-3 px-5 py-3.5">
                            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div>
                              <p className="text-xs text-muted-foreground">{label}</p>
                              <p className="text-sm font-medium text-foreground">{value}</p>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Reminder card */}
                    {assignment.reminderNote && (
                      <Card className="shadow-xs border-sky-500/20 bg-sky-500/5 p-0">
                        <CardContent className="flex items-start gap-3 p-4">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-500">
                            <BellRing className="size-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">Deadline reminder set</p>
                            <p className="text-xs text-muted-foreground">{assignment.reminderNote}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
            </div>
        </div>
    )
}