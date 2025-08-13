"use client";

import type React from "react";
import { useState } from "react";
import { BookOpen, Star, Lightbulb, Users, Target } from "lucide-react";
import { PoemEditorDialog } from "./PoemEditor";

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  bgColor: string;
  onClick?: () => void;
}

const RightSidebar: React.FC = () => {
  const [isPoemDialogOpen, setIsPoemDialogOpen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    {
      title: "Poem of the Week",
      icon: <BookOpen size={24} className="text-white" />,
      iconColor: "bg-orange-500",
      bgColor: "bg-orange-50",
      onClick: () => setIsPoemDialogOpen(true),
    },
    {
      title: "Artist of the Week",
      icon: <Star size={30} className="text-white" />,
      bgColor: "bg-pink-50",
      iconColor: "bg-pink-600",
    },
    {
      title: "I Wonder Wednesday",
      icon: <Lightbulb size={30} className="text-white" />,
      bgColor: "bg-green-50",
      iconColor: "bg-green-500",
    },
    {
      title: "UN Rights of the Child",
      icon: <Users size={30} className="text-white" />,
      bgColor: "bg-purple-50",
      iconColor: "bg-purple-600",
    },
    {
      title: "Sustainable Development Goals",
      icon: <Target size={30} className="text-white" />,
      bgColor: "bg-orange-50",
      iconColor: "bg-orange-500",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-5 ${
              item.bgColor
            } rounded-sm shadow-sm ${
              item.onClick
                ? "cursor-pointer hover:shadow-md transition-shadow"
                : ""
            }`}
            onClick={item.onClick}
          >
            <div
              className={`w-14 h-14 ${item.iconColor} rounded-full flex items-center justify-center flex-shrink-0`}
            >
              {item.icon}
            </div>
            <span className="text-xl font-semibold text-gray-800 leading-tight">
              {item.title}
            </span>
          </div>
        ))}
      </div>

      <PoemEditorDialog
        open={isPoemDialogOpen}
        onOpenChange={setIsPoemDialogOpen}
      />
    </>
  );
};

export default RightSidebar;
