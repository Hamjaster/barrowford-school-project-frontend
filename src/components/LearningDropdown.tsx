import React from "react";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CURRICULUM_STRUCTURE } from "@/constants";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface LearningDropdownProps {
  className?: string;
}

const LearningDropdown: React.FC<LearningDropdownProps> = ({ className }) => {
  const yearGroups = Object.keys(CURRICULUM_STRUCTURE);

  return (
    <div className={cn("w-full", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer h-16 p-2 w-full flex items-center justify-start text-md font-semibold bg-transparent hover:bg-accent/50 rounded-md transition-colors">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0 mr-3">
              <BookOpen size={20} />
            </div>
            <span>My Learning</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="start">
          <DropdownMenuLabel>Select Year Group</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {yearGroups.map((yearGroup) => {
            const yearData =
              CURRICULUM_STRUCTURE[
                yearGroup as keyof typeof CURRICULUM_STRUCTURE
              ];
            return (
              <DropdownMenuSub key={yearGroup}>
                <DropdownMenuSubTrigger className="flex items-center gap-3 p-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {yearGroup === "EYFS" ? "EY" : yearGroup.split(" ")[1]}
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {yearData.displayName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {yearData.subjects.length} subjects
                    </div>
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-72">
                    <DropdownMenuLabel>
                      {yearData.displayName} Subjects
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto">
                      {yearData.subjects.map((subject, index) => (
                        <DropdownMenuItem key={index} asChild>
                          <Link
                            to={`/my-learning`}
                            className="flex items-center gap-3 p-2 w-full"
                          >
                            <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                            <span className="flex-1">{subject}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LearningDropdown;
