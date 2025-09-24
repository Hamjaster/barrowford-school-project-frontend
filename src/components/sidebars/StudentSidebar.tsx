import type React from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  LogOut,
  Home,
  BookOpen,
  Award,
  Image,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import LearningDropdown from "@/components/LearningDropdown";
import ImagesDropdown from "@/components/ImagesDropdown";
import barrowfordlogo from "@/assets/barrowforrdlogo.png"

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

const StudentSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [
    {
      to: "/",
      label: "Dashboard",
      bgColor: "bg-blue-500",
      iconName: <Home size={20} />,
    },
    {
      to: "/my-learning",
      label: "My Learning",
      bgColor: "bg-green-500",
      iconName: <BookOpen size={20} />,
    },
    {
      to: "/my-experiences",
      label: "My Experiences",
      bgColor: "bg-purple-500",
      iconName: <Award size={20} />,
    },
    {
      to: "/my-impact",
      label: "My Impact",
      bgColor: "bg-red-500",
      iconName: <BookOpen size={20} />,
    },
    {
      to: "/my-cultural-capital",
      label: "My Cultural Capital",
      bgColor: "bg-pink-500",
      iconName: <Home size={20} />,
    },
    {
      to: "/my-images",
      label: "My Images",
      bgColor: "bg-orange-500",
      iconName: <Image size={20} />,
    },
  ];

  return (
    <ShadcnSidebar className="border-r" collapsible="offcanvas">
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
                  {/* I also want to show a dropdown on My Images page */}

                  {item.label === "My Learning" ? (
                    <LearningDropdown className="w-full" />
                  ) : item.label === "My Images" ? (
                    <ImagesDropdown className="w-full" />
                  ) : (
                    <SidebarMenuButton className="h-16" asChild size="lg">
                      <Link
                        to={item.to}
                        className="flex py-5 items-center text-lg font-semibold"
                      >
                        <div
                          className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center text-white flex-shrink-0`}
                        >
                          {item.iconName}
                        </div>
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
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
                className="flex cursor-pointer items-center gap-3 text-lg font-semibold w-full justify-start h-auto p-3"
              >
                <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  <LogOut size={20} />
                </div>
                <span>Logout</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  );
};

export default StudentSidebar;
