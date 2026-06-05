import {
  BookOpen,
  Clock3,
  FileText,
  GraduationCap,
  LayoutGrid,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/logo";
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
import { UserMenu } from "@/components/user-menu";

// Nav config

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

const isNavItemActive = (pathname: string, href: string) =>
  pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

/** Derives up to two initials from a full name. e.g. "Aiko Tanaka" → "AT" */
const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// Component

export function AppSidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const displayName = user?.name ?? "";
  const displayRole = user?.role ?? "";
  const initials = user ? getInitials(user.name) : "";

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
                    className="font-[450] data-active:font-[550]"
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
            <UserMenu
              contentSide="top"
              contentAlign="start"
              trigger={
                <SidebarMenuButton size="lg" className="gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary/10 text-sm text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-semibold">{displayName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{displayRole}</p>
                  </div>
                </SidebarMenuButton>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}