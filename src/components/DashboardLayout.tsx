import type React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useResponsiveSidebar } from "@/hooks/use-responsive-sidebar";

const DashboardLayout: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useResponsiveSidebar();

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex min-h-screen bg-[#eaf7fd]">
        <Sidebar />
        <SidebarInset className="flex bg-[#eaf7fd] flex-col flex-1">
          <Header />
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
