import { LogOut } from "lucide-react";
import type { ReactNode } from "react";

import { useAuth } from "@/contexts/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { logout } = useAuth();


  const handleLogout = () => {
    // logout() is async but handles its own navigation, fire and forget.
    logout().catch(console.error);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent side={contentSide} align={contentAlign} className="w-56">
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}