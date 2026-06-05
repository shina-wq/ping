import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/api/notifications";

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
}

/** Marks a single notification as read and invalidates both the list and count. */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

/** Marks all notifications as read and invalidates both the list and count. */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}