import type React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Home,
  Image,
  Heart,
  Star,
  BookOpen,
  LogOut,
  GraduationCap,
} from "lucide-react";

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
  isLogout?: boolean;
}

const Sidebar: React.FC = () => {
  const handleLogout = () => {
    console.log("Logging out...");
  };

  const navItems: NavItem[] = [
    {
      to: "/my-learning",
      label: "My Learning",
      bgColor: "bg-blue-500",
      icon: <Home size={20} />,
    },
    {
      to: "/my-photos",
      label: "My Photos",
      bgColor: "bg-orange-500",
      icon: <Image size={20} />,
    },
    {
      to: "/my-impact",
      label: "My Impact",
      bgColor: "bg-pink-600",
      icon: <Heart size={20} />,
    },
    {
      to: "/my-experiences",
      label: "My Experiences",
      bgColor: "bg-green-500",
      icon: <Star size={20} />,
    },
    {
      to: "/what-i-read",
      label: "What I Read",
      bgColor: "bg-purple-600",
      icon: <BookOpen size={20} />,
    },
  ];

  return (
    <ShadcnSidebar className="border-r" collapsible="offcanvas">
      <SidebarHeader className="p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center">
              <GraduationCap size={24} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-lg font-bold text-gray-800 leading-tight">
              Barrowford
            </div>
            <div className="text-sm text-gray-600 leading-tight">
              Primary School
            </div>
            <div className="text-xs text-pink-600 italic mt-1 leading-tight">
              Learn to Love. Love to Learn.
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
                      className="flex py-5 items-center  text-lg font-semibold"
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
                <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
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

export default Sidebar;
