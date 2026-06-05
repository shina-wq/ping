import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getReminders, dismissReminder } from "@/api/reminders";

export function useReminders() {
  return useQuery({
    queryKey: ["reminders"],
    queryFn: getReminders,
  });
}

/** Dismisses a reminder and removes it from the cached list immediately. */
export function useDismissReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dismissReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
    },
  });
}