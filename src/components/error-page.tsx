import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Home, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

type ErrorAction = {
  label: string;
  href?: string;
  onClick?: () => void;
};

type ErrorPageProps = {
  code?: string;
  title: string;
  description: string;
  icon: ReactNode;
  primaryAction: ErrorAction;
  secondaryAction?: ErrorAction;
};

export function ErrorPage({
  code,
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-background px-6 py-12">
      <Logo />

      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-xl border border-border bg-card p-8 text-center shadow-xs">
        <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          {icon}
        </div>

        <div className="space-y-2">
          {code && (
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Error {code}
            </p>
          )}
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>

        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          {secondaryAction && (
            <Button
              variant="outline"
              className="sm:w-auto"
              onClick={secondaryAction.onClick}
              asChild={!!secondaryAction.href}
            >
              {secondaryAction.href ? (
                <Link to={secondaryAction.href}>{secondaryAction.label}</Link>
              ) : (
                <>
                  <RotateCcw className="size-4" />
                  {secondaryAction.label}
                </>
              )}
            </Button>
          )}

          <Button className="sm:w-auto" onClick={primaryAction.onClick} asChild={!!primaryAction.href}>
            {primaryAction.href ? (
              <Link to={primaryAction.href}>
                <Home className="size-4" />
                {primaryAction.label}
              </Link>
            ) : (
              primaryAction.label
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}