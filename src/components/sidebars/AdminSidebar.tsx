import type React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Users,
  UserPlus,
  KeyRound,
  Settings,
  Shield,
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

const AdminSidebar: React.FC = () => {
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
      bgColor: "bg-blue-500",
      icon: <Home size={20} />,
    },
    {
      to: "/users",
      label: "Manage Users",
      bgColor: "bg-purple-500",
      icon: <Users size={20} />,
    },
    {
      to: "/create-user",
      label: "Create User",
      bgColor: "bg-green-500",
      icon: <UserPlus size={20} />,
    },
    {
      to: "/reset-passwords",
      label: "Reset Passwords",
      bgColor: "bg-orange-500",
      icon: <KeyRound size={20} />,
    },
    {
      to: "/system-settings",
      label: "System Settings",
      bgColor: "bg-red-500",
      icon: <Settings size={20} />,
    },
    {
      to: "/security",
      label: "Security",
      bgColor: "bg-gray-600",
      icon: <Shield size={20} />,
    },
  ];

  return (
    <ShadcnSidebar className="border-r" collapsible="offcanvas">
      <SidebarHeader className="p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <GraduationCap size={24} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold text-gray-800 leading-tight">
              Admin Panel
            </div>
            <div className="text-sm text-gray-600 leading-tight">
              System Administration
            </div>
            <div className="text-xs text-red-600 italic mt-1 leading-tight">
              Full System Access
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
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
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

export default AdminSidebar;
