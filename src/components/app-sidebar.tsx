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

// Pure helper — extracted so the component stays clean and this is independently testable
const isNavItemActive = (pathname: string, href: string) =>
  pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

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
            <SidebarMenu>
              {navItems.map(({ label, icon: Icon, href }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isNavItemActive(pathname, href)}
                    tooltip={label}
                  >
                    <Link to={href}>
                      <Icon />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary/10 text-sm text-primary">
                      AT
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-semibold">Aiko Tanaka</p>
                    <p className="text-xs text-muted-foreground">Student</p>
                  </div>
                </SidebarMenuButton>
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}