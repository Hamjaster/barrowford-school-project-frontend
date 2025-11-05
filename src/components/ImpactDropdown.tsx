import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchEligibleYearGroupsForStudent } from "@/store/slices/yearDataSlice";
import { setSelectedYearGroupForImpacts } from "@/store/slices/studentSlice";
import type { RootState, AppDispatch } from "@/store";
import { Spinner } from "./ui/Spinner";

interface ImpactDropdownProps {
  className?: string;
}

const ImpactDropdown: React.FC<ImpactDropdownProps> = ({ className }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { eligibleYearGroupsWithSubjects, isLoading, error } = useSelector(
    (state: RootState) => state.yearData
  );

  useEffect(() => {
    dispatch(fetchEligibleYearGroupsForStudent());
  }, [dispatch]);

  if (error) {
    return (
      <div className={cn("w-full", className)}>
        <div className="cursor-pointer h-16 p-2 w-full flex items-center justify-start text-md font-semibold bg-transparent hover:bg-accent/50 rounded-md transition-colors">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white flex-shrink-0 mr-3">
            <Heart size={20} />
          </div>
          <span>My Impact (Error loading data)</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer h-16 p-2 w-full flex items-center justify-start text-md font-semibold bg-transparent hover:bg-accent/50 rounded-md transition-colors">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white flex-shrink-0 mr-2">
              {isLoading ? <Spinner /> : <Heart size={20} />}
            </div>
            <span>My Impact</span>
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
            <div className="max-h-80 overflow-y-auto">
              {eligibleYearGroupsWithSubjects.map((yearGroup: any) => (
                <DropdownMenuItem key={yearGroup.id} asChild>
                  <Link
                    to={`/my-impact`}
                    className="flex items-center gap-3 p-3 w-full"
                    onClick={() =>
                      dispatch(setSelectedYearGroupForImpacts(yearGroup))
                    }
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {yearGroup.name === "EYFS"
                        ? "EY"
                        : yearGroup.name.split(" ")[1] || yearGroup.name}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{yearGroup.name}</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ImpactDropdown;

