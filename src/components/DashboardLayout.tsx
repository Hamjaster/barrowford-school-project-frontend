import type React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Header";
import AdminSidebar from "./sidebars/AdminSidebar";
import StaffAdminSidebar from "./sidebars/StaffAdminSidebar";
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
    switch (user?.role) {
      case "admin":
        return <AdminSidebar />;
      case "staff_admin":
        return <StaffAdminSidebar />;
      case "staff":
        return <StaffSidebar />;
      case "parent":
        return <ParentSidebar />;
      case "student":
        return <StudentSidebar />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="flex max-h-screen w-full">
        {renderSidebar()}
        <SidebarInset className="flex overflow-y-scroll bg-[#eaf7fd] flex-col flex-1 w-full min-w-0">
          {user?.role !== "student" && user?.role !== "parent" && <Header />}
          <div className="w-full">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
