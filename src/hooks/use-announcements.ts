import { useQuery } from "@tanstack/react-query";

import { getAnnouncements } from "@/api/announcements";
import { queryKeys } from "@/lib/query-keys";

export function useAnnouncements(courseId: string) {
  return useQuery({
    queryKey: queryKeys.announcements.byCourse(courseId),
    queryFn: () => getAnnouncements(courseId),
    select: (res) => res.data,
    enabled: !!courseId,
  });
}