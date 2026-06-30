import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getReminders,
  createReminder,
  dismissReminder,
  dismissAllReminders,
} from "@/api/reminders";
import { queryKeys } from "@/lib/query-keys";

export function useReminders() {
  return useQuery({
    queryKey: queryKeys.reminders.all(),
    queryFn: () => getReminders(),
    select: (res) => res.data,
  });
}

export function useCreateReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.all() });
    },
  });
}

/** Dismisses a reminder and removes it from the cached list immediately. */
export function useDismissReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dismissReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.all() });
    },
  });
}

export function useDismissAllReminders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dismissAllReminders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.all() });
    },
  });
}