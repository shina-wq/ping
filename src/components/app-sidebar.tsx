import {
  BookOpen,
  FileText,
  GraduationCap,
  LayoutGrid,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { useAuth } from "@/contexts/auth-context";
import { getInitials } from "@/lib/format";
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
  { label: "Settings", icon: Settings, href: "/settings" },
];

const isNavItemActive = (pathname: string, href: string) =>
  pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

// Component

export function AppSidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const displayName = user?.name ?? "";
  const displayRole = user?.role ?? "";
  const initials = user ? getInitials(user.name) : "";

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Logo size="sm" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="py-3">
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

      <SidebarFooter className="border-t border-sidebar-border p-2.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu
              contentSide="top"
              contentAlign="start"
              trigger={
                <SidebarMenuButton size="lg" className="gap-2">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-medium">{displayName}</p>
                    <p className="truncate text-xs text-muted-foreground capitalize">{displayRole}</p>
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