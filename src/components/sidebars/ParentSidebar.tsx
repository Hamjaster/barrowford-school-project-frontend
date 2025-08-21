import type React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  User,
  Calendar,
  MessageSquare,
  FileText,
  Camera,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  bgColor: string;
}

const ParentSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems: NavItem[] = [
    {
      to: "/",
      label: "Dashboard",
      bgColor: "bg-green-500",
      icon: <Home size={20} />,
    },
    {
      to: "/my-child",
      label: "My Child",
      bgColor: "bg-blue-500",
      icon: <User size={20} />,
    },
    {
      to: "/school-calendar",
      label: "School Calendar",
      bgColor: "bg-purple-500",
      icon: <Calendar size={20} />,
    },
    {
      to: "/messages",
      label: "Messages",
      bgColor: "bg-orange-500",
      icon: <MessageSquare size={20} />,
    },
    {
      to: "/reports",
      label: "Reports",
      bgColor: "bg-indigo-500",
      icon: <FileText size={20} />,
    },
    {
      to: "/photos",
      label: "School Photos",
      bgColor: "bg-pink-500",
      icon: <Camera size={20} />,
    },
  ];

  return (
    <ShadcnSidebar className="border-r" collapsible="offcanvas">
      <SidebarHeader className="p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <GraduationCap size={24} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold text-gray-800 leading-tight">
              Parent Portal
            </div>
            <div className="text-sm text-gray-600 leading-tight">
              Stay Connected
            </div>
            <div className="text-xs text-green-600 italic mt-1 leading-tight">
              Your Child's Journey
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton className="h-16" asChild size="lg">
                    <Link
                      to={item.to}
                      className="flex py-5 items-center text-lg font-semibold"
                    >
                      <div
                        className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center text-white flex-shrink-0`}
                      >
                        {item.icon}
                      </div>
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 sm:p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" onClick={handleLogout}>
              <button className="flex items-center gap-3 text-lg font-semibold w-full">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  <LogOut size={20} />
                </div>
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default ParentSidebar;
