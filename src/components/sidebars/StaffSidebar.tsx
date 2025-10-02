import type React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  LogOut,
  Home,
  Users,
  UserPlus,
  KeyRound,
  BookOpen,
  Calendar,
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

const StaffSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const staffInfo = ROLEWISE_INFORMATION.staff;
  const navItems = staffInfo.navItems;

  const getIconComponent = (iconName: string) => {
    const iconMap = {
      Home: <Home size={20} />,
      Users: <Users size={20} />,
      UserPlus: <UserPlus size={20} />,
      KeyRound: <KeyRound size={20} />,
      BookOpen: <BookOpen size={20} />,
      Calendar: <Calendar size={20} />,
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
                      className="flex items-center gap-3 text-lg font-semibold w-full"
                    >
                      <div
                        className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center text-white flex-shrink-0`}
                      >
                        {getIconComponent(item.iconName)}
                      </div>
                      <span className="flex-1 text-sm font-medium leading-none tracking-normal text-foreground">
                        {item.label}
                      </span>
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
                className="flex items-center gap-3 text-lg font-semibold w-full justify-start p-0"
              >
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white flex-shrink-0 ">
                  <LogOut size={20} />
                </div>
                <span className="flex-1 text-sm font-medium  tracking-normal text-foreground">
                  Logout
                </span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default StaffSidebar;
