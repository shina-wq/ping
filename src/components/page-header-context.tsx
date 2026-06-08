import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { AppHeader } from "@/components/app-header";
import { usePageHeaderFromRoute } from "@/hooks/use-page-header-from-route";
import type { PageHeaderConfig } from "@/types/page-header";

type PageHeaderContextValue = {
  override: PageHeaderConfig | null;
  setOverride: (config: PageHeaderConfig | null) => void;
};

const PageHeaderContext = createContext<PageHeaderContextValue | null>(null);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [override, setOverride] = useState<PageHeaderConfig | null>(null);

  const value = useMemo(
    () => ({ override, setOverride }),
    [override]
  );

  return (
    <PageHeaderContext.Provider value={value}>
      {children}
    </PageHeaderContext.Provider>
  );
}

function usePageHeaderContext() {
  const context = useContext(PageHeaderContext);
  if (!context) throw new Error("Page header hooks must be used within PageHeaderProvider");
  return context;
}

export function usePageHeader(config: PageHeaderConfig) {
  const { setOverride } = usePageHeaderContext();

  useEffect(() => {
    setOverride(config);
    return () => setOverride(null);
    // Depend on values, not the config object reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.title, config.description, setOverride]);
}

export function PageHeaderSlot() {
  const { override } = usePageHeaderContext();
  const routeHeader = usePageHeaderFromRoute();
  const header = override ?? routeHeader;

  if (!header) return null;

  return <AppHeader title={header.title} description={header.description} />;
}