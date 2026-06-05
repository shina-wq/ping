import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/app-sidebar";
import { PageHeaderSlot } from "@/components/page-header-context";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="min-h-dvh min-w-0 bg-linear-to-br from-background via-background to-muted/30">
          <div className="flex min-w-0 flex-1 flex-col px-4 py-6 lg:px-8">
            <PageHeaderSlot />
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}