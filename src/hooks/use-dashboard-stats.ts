import { useQuery } from "@tanstack/react-query";

import { getDashboardStats } from "@/api/dashboard";
import { queryKeys } from "@/lib/query-keys";

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: getDashboardStats,
  });
}