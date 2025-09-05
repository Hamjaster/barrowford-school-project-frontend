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
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-5 bg-white shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden" />
        <h1
          onClick={() => navigate("/")}
          className="text-2xl hover:underline cursor-pointer sm:text-3xl font-bold text-gray-800"
        >
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-indigo-100 text-indigo-800">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>

          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-900">
              {getUserDisplayName()}
            </p>
            {/* <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor()}`}
              >
                {user?.role?.replace("_", " ") || "User"}
              </span>
              {user?.role === "student" && user?.username && (
                <span className="text-xs text-gray-500">@{user.username}</span>
              )}
            </div> */}
          </div>
        </div>

        {/* Logout Button */}
        {/* <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button> */}
      </div>
    </header>
  );
};

export default Header;
