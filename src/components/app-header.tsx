import { Bell, Search } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { useNotificationCount } from "@/hooks/use-notification-count";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AppHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function AppHeader({ title, description, actions }: AppHeaderProps) {
  // Fetched internally — notification count is global state, not a page concern.
  const notificationCount = useNotificationCount();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    if (newQuery) {
      searchParams.set("q", newQuery);
    } else {
      searchParams.delete("q");
    }
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{description}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        {actions}

        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={query}
            onChange={handleSearch}
            className="h-10 w-56 rounded-full border-border/70 bg-background/90 pr-4 pl-10 shadow-xs"
          />
        </div>

        <Button variant="outline" size="icon" className="relative" asChild>
          <Link to="/notifications">
            <Bell className="size-4" />
            {notificationCount > 0 ? (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            ) : null}
            <span className="sr-only">Notifications</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}