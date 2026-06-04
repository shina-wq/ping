import { useMatches } from "react-router-dom";

import type { AppRouteHandle, PageHeaderConfig } from "@/types/page-header";

export function usePageHeaderFromRoute(): PageHeaderConfig | null {
  const matches = useMatches();

  for (let i = matches.length - 1; i >= 0; i--) {
    const handle = matches[i].handle as AppRouteHandle | undefined;
    if (handle?.pageHeader) {
      return handle.pageHeader;
    }
  }

  return null;
}
