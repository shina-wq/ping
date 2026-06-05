import { useQuery } from "@tanstack/react-query";

import { getNotificationCount } from "@/api/notifications";

/**
 * Returns the unread notification count for the AppHeader badge.
 * Refetches every 60 seconds so the badge stays reasonably current.
 * Returns 0 as a safe default while loading or on error.
 */

export function useNotificationCount(): number {
  const { data = 0 } = useQuery({
    queryKey: ["notifications", "count"],
    queryFn: getNotificationCount,
    refetchInterval: 60_000,
  });

  return data;
}