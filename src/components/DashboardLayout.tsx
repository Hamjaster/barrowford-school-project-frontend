import type React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Header";
import AdminSidebar from "./sidebars/AdminSidebar";
import StaffSidebar from "./sidebars/StaffSidebar";
import ParentSidebar from "./sidebars/ParentSidebar";
import StudentSidebar from "./sidebars/StudentSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useResponsiveSidebar } from "@/hooks/use-responsive-sidebar";
import type { RootState } from "../store";

const DashboardLayout: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useResponsiveSidebar();
  const { user } = useSelector((state: RootState) => state.auth);

  const renderSidebar = () => {
    if (!user) return <StudentSidebar />;

    switch (user.role) {
      case "admin":
        return <AdminSidebar />;
      case "staff_admin":
      case "staff":
        return <StaffSidebar />;
      case "parent":
        return <ParentSidebar />;
      case "student":
      default:
        return <StudentSidebar />;
    }
  };

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex min-h-screen w-full">
        {renderSidebar()}
        <SidebarInset className="flex bg-[#eaf7fd] flex-col flex-1 w-full min-w-0">
          <Header />
          <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
