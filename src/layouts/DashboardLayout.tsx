import { AppSidebar } from "#components/app-sidebar.tsx";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex items-center gap-3 border-b px-6 py-4">
            <SidebarTrigger />
            {/* Shared header content (search, notifications, user menu) */}
          </header>

          <div className="flex-1 px-6 py-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}