import { useQueries } from "@tanstack/react-query";

import { getSubmissions } from "@/api/submissions";
import type { Submission } from "@/api/submissions";
import { useAssignments } from "@/hooks/use-assignments";
import { queryKeys } from "@/lib/query-keys";

export type SubmissionWithContext = Submission & {
  assignmentTitle: string;
  courseName: string;
  courseId: string;
};

export type RecentSubmissionWithContext = SubmissionWithContext;

type UseNeedsGradingOptions = {
  enabled?: boolean;
  assignmentLimit?: number;
  resultLimit?: number;
};

export function useNeedsGrading({
  enabled = true,
  assignmentLimit = 8,
  resultLimit = 5,
}: UseNeedsGradingOptions = {}) {
  const { data: assignments, isLoading: assignmentsLoading } = useAssignments({
    limit: assignmentLimit,
  });

  const submissionQueries = useQueries({
    queries: (assignments ?? []).map((a) => ({
      queryKey: queryKeys.submissions.byAssignment(a.id),
      queryFn: () => getSubmissions(a.id, { limit: 20 }),
      enabled: enabled && !!assignments,
      select: (res: { data: Submission[] }) =>
        res.data
          .filter((s) => s.status === "submitted")
          .map((s) => ({
            ...s,
            assignmentTitle: a.title,
            courseName: a.courseName,
            courseId: a.courseId,
          })),
    })),
  });

  const isLoading =
    enabled && (assignmentsLoading || submissionQueries.some((q) => q.isLoading));
  const error = submissionQueries.find((q) => q.error)?.error as Error | undefined;

  const allPending: SubmissionWithContext[] = submissionQueries.flatMap(
    (q) => q.data ?? []
  );

  const pendingByCourse = allPending.reduce<Record<string, number>>((acc, s) => {
    acc[s.courseId] = (acc[s.courseId] ?? 0) + 1;
    return acc;
  }, {});

  const data = [...allPending]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, resultLimit);

  return { data, pendingByCourse, isLoading, error };
}

export function useRecentSubmissions({
  enabled = true,
  assignmentLimit = 8,
  resultLimit = 5,
}: UseNeedsGradingOptions = {}) {
  const { data: assignments, isLoading: assignmentsLoading } = useAssignments({
    limit: assignmentLimit,
  });

  const submissionQueries = useQueries({
    queries: (assignments ?? []).map((assignment) => ({
      queryKey: queryKeys.submissions.byAssignment(assignment.id),
      queryFn: () => getSubmissions(assignment.id, { limit: 20 }),
      enabled: enabled && !!assignments,
      select: (res: { data: Submission[] }) =>
        res.data.map((submission) => ({
          ...submission,
          assignmentTitle: assignment.title,
          courseName: assignment.courseName,
          courseId: assignment.courseId,
        })),
    })),
  });

  const isLoading = enabled && (assignmentsLoading || submissionQueries.some((q) => q.isLoading));
  const error = submissionQueries.find((q) => q.error)?.error as Error | undefined;

  const allSubmissions: RecentSubmissionWithContext[] = submissionQueries.flatMap(
    (q) => q.data ?? []
  );

  const pendingByCourse = allSubmissions
    .filter((submission) => submission.status === "submitted")
    .reduce<Record<string, number>>((acc, submission) => {
      acc[submission.courseId] = (acc[submission.courseId] ?? 0) + 1;
      return acc;
    }, {});

  const data = [...allSubmissions]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, resultLimit);

  return { data, pendingByCourse, isLoading, error };
}