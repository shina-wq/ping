import { useMatches } from "react-router-dom";

import type { PageHeaderConfig } from "@/types/page-header";

export function usePageHeaderFromRoute(): PageHeaderConfig | null {
  const matches = useMatches();

  // Walk matches from most specific to least specific (deepest route wins).
  for (let i = matches.length - 1; i >= 0; i--) {
    // handle is typed as unknown by useMatches, cast to the known shape.
    // The module augmentation in types/router.d.ts keeps route definitions
    // type-safe at the call site without needing a separate named type here.
    const handle = matches[i].handle as { pageHeader?: PageHeaderConfig } | undefined;
    if (handle?.pageHeader) {
      return handle.pageHeader;
    }
  }

  return null;
}