import type React from "react";
import { Link } from "react-router-dom";
import {
  LogOut,
  Home,
  Users,
  UserPlus,
  KeyRound,
  Settings,
  Shield,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/slices/authSlice";
import { ROLEWISE_INFORMATION } from "@/constants";
import { Button } from "@/components/ui/button";
import barrowfordlogo from '@/assets/barrowforrdlogo.png'

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

const AdminSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const adminInfo = ROLEWISE_INFORMATION.admin;
  const navItems = adminInfo.navItems;

  const getIconComponent = (iconName: string) => {
    const iconMap = {
      Home: <Home size={20} />,
      Users: <Users size={20} />,
      UserPlus: <UserPlus size={20} />,
      KeyRound: <KeyRound size={20} />,
      Settings: <Settings size={20} />,
      Shield: <Shield size={20} />,
    };
    return iconMap[iconName as keyof typeof iconMap] || null;
  };

  return (
    <ShadcnSidebar className="border-r" collapsible="none">
      <SidebarHeader className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
      <img 
        src={barrowfordlogo} 
        alt="Barrowford Logo"
        className="h-12 sm:h-14 md:h-16 w-auto object-contain"
      />
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
                        {getIconComponent(item.iconName)}
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
            <SidebarMenuButton asChild size="lg">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex cursor-pointer items-center gap-2 text-lg font-semibold w-full justify-start h-auto p-0"
              >
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  <LogOut size={20} />
                </div>
                <span className="text-sm">Logout</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default AdminSidebar;
