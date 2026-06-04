import * as React from "react";
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
  return (
    <div
      className={cn(
        "flex items-center gap-2 font-medium text-foreground",
        className
      )}
    >
      {/* Icon container */}
      <div
        className={cn(
          "flex items-center justify-center rounded-md bg-primary text-primary-foreground font-bold",
          {
            "h-6 w-6 text-xs": size === "sm",
            "h-8 w-8 text-sm": size === "md",
            "h-10 w-10 text-base": size === "lg",
          }
        )}
      >
        P
      </div>

      {/* Brand name */}
      {showText && <span className="text-lg leading-none">Ping</span>}
    </div>
  );
}