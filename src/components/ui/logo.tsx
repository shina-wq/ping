import * as React from "react";

import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
};

export function Logo({
  className,
  size = "md",
  showText = true,
}: LogoProps) {
  const { user } = useAuth();
  const isTeacher = user?.role === "teacher";

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 font-medium text-foreground",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-md bg-primary text-primary-foreground font-bold shrink-0",
          {
            "h-6 w-6 rounded-md text-xs": size === "sm",
            "h-8 w-8 rounded-lg text-sm": size === "md",
            "h-10 w-10 rounded-xl text-base": size === "lg",
          }
        )}
      >
        P
      </div>

      {/* Brand name and Portal label */}
      {showText && (
        <div className="flex flex-col text-left justify-center">
          <span className="text-sm sm:text-base font-semibold leading-none text-current">
            Ping
          </span>
          {isTeacher && (
            <span className="text-[10px] font-medium text-muted-foreground/80 leading-none mt-1">
              Teacher Portal
            </span>
          )}
        </div>
      )}
    </div>
  );
}