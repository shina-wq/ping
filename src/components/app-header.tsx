// components/app-header.tsx
import type { ReactNode } from "react";
import { NotificationsPopover } from "./notifications-popover";

type AppHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export function AppHeader({ title, description, actions }: AppHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[2rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {actions}
        <NotificationsPopover />
      </div>
    </header>
  );
}