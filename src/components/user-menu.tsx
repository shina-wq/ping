import { LogOut, Settings, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const CURRENT_USER = {
  name: "Aiko Tanaka",
  role: "Student",
  initials: "AT",
} as const;

type UserMenuProps = {
  trigger: ReactNode;
  contentSide?: "top" | "right" | "bottom" | "left";
  contentAlign?: "start" | "center" | "end";
};

export function UserMenu({
  trigger,
  contentSide = "top",
  contentAlign = "start",
}: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent side={contentSide} align={contentAlign} className="w-56">
        <DropdownMenuLabel>
          <p className="text-sm font-medium">{CURRENT_USER.name}</p>
          <p className="text-xs text-muted-foreground">{CURRENT_USER.role}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex w-full items-center gap-2 cursor-pointer">
            <UserRound className="size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex w-full items-center gap-2 cursor-pointer">
            <Settings className="size-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
