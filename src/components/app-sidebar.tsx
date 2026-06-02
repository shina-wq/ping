import {
  BookOpen,
  Clock3,
  FileText,
  GraduationCap,
  LayoutGrid,
  LogOut,
  Settings,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/logo";

type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  { label: "My Courses", icon: BookOpen, href: "/courses" },
  { label: "Assignments", icon: FileText, href: "/assignments" },
  { label: "Grades", icon: GraduationCap, href: "/grades" },
  { label: "Reminders", icon: Clock3, href: "/reminders" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-5">
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4">
              {navItems.map(({ label, icon: Icon, href }) => {
                const isActive =
                  pathname === href ||
                  (href !== "/dashboard" && pathname.startsWith(href));

                return (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
                    <Link to={href}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl border border-border/70 bg-background/80 p-3 shadow-xs transition-colors hover:bg-muted/50"
            >
              <Avatar className="size-9">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  AT
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-semibold text-foreground">Aiko Tanaka</p>
                <p className="text-xs text-muted-foreground">Student</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">Aiko Tanaka</p>
              <p className="text-xs text-muted-foreground">Student</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserRound className="size-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="size-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="size-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}