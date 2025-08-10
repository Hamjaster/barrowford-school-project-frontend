import type React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Header: React.FC = () => {
  return (
    <header className="flex items-center gap-4 px-4 sm:px-6 lg:px-8 py-5 ">
      <SidebarTrigger className="lg:hidden" />
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
        Dashboard
      </h1>
    </header>
  );
};

export default Header;
