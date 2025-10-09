import React, { useEffect } from "react";
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
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchEligibleYearGroupsForStudent } from "@/store/slices/yearDataSlice";
import { setSelectedSubject } from "@/store/slices/studentSlice";
import type { RootState, AppDispatch } from "@/store";
import { Spinner } from "./ui/Spinner";

interface LearningDropdownProps {
  className?: string;
}

const LearningDropdown: React.FC<LearningDropdownProps> = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { eligibleYearGroupsWithSubjects, isLoading, error } = useSelector(
    (state: RootState) => state.yearData
  );

  if (error) {
    return (
      <div className={cn("w-full", className)}>
        <div className="cursor-pointer h-16 p-2 w-full flex items-center justify-start text-md font-semibold bg-transparent hover:bg-accent/50 rounded-md transition-colors">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white flex-shrink-0 mr-3">
            <BookOpen size={20} />
          </div>
          <span>My Learning (Error loading data)</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer h-16 p-2 w-full flex items-center justify-start text-md font-semibold bg-transparent hover:bg-accent/50 rounded-md transition-colors">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white flex-shrink-0 mr-2">
              {isLoading ? <Spinner /> : <BookOpen size={20} />}
            </div>
            <span>My Learning</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="start">
          <DropdownMenuLabel>Select Year Group</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Spinner />
              <span className="ml-2">Loading year groups...</span>
            </div>
          ) : eligibleYearGroupsWithSubjects.length === 0 ? (
            <div className="flex items-center justify-center p-4">
              <span className="text-muted-foreground">
                No year groups available
              </span>
            </div>
          ) : (
            eligibleYearGroupsWithSubjects.map((yearGroup: any) => (
              <DropdownMenuSub key={yearGroup.id}>
                <DropdownMenuSubTrigger className="flex items-center gap-3 p-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {yearGroup.name === "EYFS"
                      ? "EY"
                      : yearGroup.name.split(" ")[1] || yearGroup.name}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{yearGroup.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {yearGroup.subjects.length} subjects
                    </div>
                  </div>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-72">
                    <DropdownMenuLabel>
                      {yearGroup.name} Subjects
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto">
                      {yearGroup.subjects.length === 0 ? (
                        <div className="flex items-center justify-center p-4">
                          <span className="text-muted-foreground text-sm">
                            No subjects available
                          </span>
                        </div>
                      ) : (
                        yearGroup.subjects.map((subject: any) => (
                          <DropdownMenuItem key={subject.id} asChild>
                            <Link
                              to={`/my-learning`}
                              className="flex items-center gap-3 p-2 w-full"
                              onClick={() =>
                                dispatch(setSelectedSubject(subject))
                              }
                            >
                              <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                              <span className="flex-1">{subject.name}</span>
                            </Link>
                          </DropdownMenuItem>
                        ))
                      )}
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LearningDropdown;
