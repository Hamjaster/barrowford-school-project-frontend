import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logout } from "../store/slices/authSlice";
import type { RootState } from "../store";
import { LogOut } from "lucide-react";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getUserInitials = () => {
    if (!user) return "U";
    return `${user.first_name?.[0] || ""}${
      user.last_name?.[0] || ""
    }`.toUpperCase();
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    return `${user.first_name} ${user.last_name}`;
  };

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "staff":
        return "bg-blue-100 text-blue-800";
      case "parent":
        return "bg-green-100 text-green-800";
      case "student":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <header className="bg-gradient-to-r min-h-20 from-orange-500 to-pink-500 text-white p-6 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden text-white" />
          <h1
            onClick={() => navigate("/")}
            className="text-2xl hover:underline cursor-pointer sm:text-3xl font-bold text-white"
          >
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-white/20 text-white border border-white/30">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>

            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-orange-100">
                {user?.role?.replace("_", " ") || "User"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
    </header>
  );
};

export default Header;
