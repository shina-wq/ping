import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  dismissNotification,
  dismissAllNotifications,
  type ListNotificationsParams,
} from "@/api/notifications";
import { queryKeys } from "@/lib/query-keys";

export function useNotifications(params: ListNotificationsParams = {}) {
  return useQuery({
    queryKey: queryKeys.notifications.all(params),
    queryFn: () => getNotifications(params),
    select: (res) => res.data,
  });
}

/** Marks a single notification as read and invalidates both the list and count. */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
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

export function useDismissNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dismissNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useDismissAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dismissAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}