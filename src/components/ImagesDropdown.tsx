import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchEligibleYearGroupsForStudent } from "@/store/slices/yearDataSlice";
import {
  setSelectedSubject,
  setSelectedYearGroup,
} from "@/store/slices/studentSlice";
import type { RootState, AppDispatch } from "@/store";

interface ImagesDropdownProps {
  className?: string;
}

const ImagesDropdown: React.FC<ImagesDropdownProps> = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading, error, eligibleYearGroupsWithSubjects } = useSelector(
    (state: RootState) => state.yearData
  );

  useEffect(() => {
    // Fetch eligible year groups when component mounts
    if (eligibleYearGroupsWithSubjects.length === 0 && !isLoading && !error) {
      console.log("Fetching eligible year groups !!");
      dispatch(fetchEligibleYearGroupsForStudent());
    }
  }, [dispatch, eligibleYearGroupsWithSubjects.length, isLoading, error]);

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
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <BookOpen size={20} />
              )}
            </div>
            <span>My Images</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="start">
          <DropdownMenuLabel>Select Year Group</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
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
              <DropdownMenuItem
                onClick={() => {
                  console.log("updating year group to ", yearGroup);
                  dispatch(setSelectedYearGroup(yearGroup));
                  navigate("/my-images");
                }}
                className="flex items-center gap-3 p-3"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {yearGroup.name === "EYFS"
                    ? "EY"
                    : yearGroup.name.split(" ")[1] || yearGroup.name}
                </div>
                <div>
                  <div className="font-medium text-sm">{yearGroup.name}</div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ImagesDropdown;
