import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getReminders, dismissReminder } from "@/api/reminders";
import { queryKeys } from "@/lib/query-keys";

export function useReminders() {
  return useQuery({
    queryKey: queryKeys.reminders.all(),
    queryFn: getReminders,
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