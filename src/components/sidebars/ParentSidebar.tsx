import type React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, LogOut, Home, Baby, Camera } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/slices/authSlice";
import { ROLEWISE_INFORMATION } from "@/constants";

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

const ParentSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const parentInfo = ROLEWISE_INFORMATION.parent;
  const navItems = parentInfo.navItems;

  const getIconComponent = (iconName: string) => {
    const iconMap = {
      Home: <Home size={20} />,
      Baby: <Baby size={20} />,
      Camera: <Camera size={20} />,
    };
    return iconMap[iconName as keyof typeof iconMap] || null;
  };

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
              {parentInfo.sidebarTitle}
            </div>
            <div className="text-sm text-gray-600 leading-tight">
              {parentInfo.sidebarSubtitle}
            </div>
            <div className="text-xs text-green-600 italic mt-1 leading-tight">
              {parentInfo.sidebarSubtitle}
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
