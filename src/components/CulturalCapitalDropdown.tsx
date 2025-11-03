import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
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
import {
  fetchAllTopics,
  setSelectedTopicId,
} from "@/store/slices/reflectionSlice";
import type { RootState, AppDispatch } from "@/store";
import { Spinner } from "./ui/Spinner";

interface CulturalCapitalDropdownProps {
  className?: string;
}

const CulturalCapitalDropdown: React.FC<CulturalCapitalDropdownProps> = ({
  className,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { topics, loading, error } = useSelector(
    (state: RootState) => state.reflection
  );

  useEffect(() => {
    // Fetch topics when component mounts
    if (topics.length === 0 && !loading && !error) {
      dispatch(fetchAllTopics());
    }
  }, [dispatch, topics.length, loading, error]);

  const handleTopicClick = (topicId: string) => {
    dispatch(setSelectedTopicId(topicId));
    navigate("/my-cultural-capital");
  };

  if (error) {
    return (
      <div className={cn("w-full", className)}>
        <div className="cursor-pointer h-16 p-2 w-full flex items-center justify-start text-md font-semibold bg-transparent hover:bg-accent/50 rounded-md transition-colors">
          <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white flex-shrink-0 mr-3">
            <Home size={20} />
          </div>
          <span>My Cultural Capital (Error loading data)</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer h-12 p-2 w-full flex items-center justify-start text-md font-semibold bg-transparent hover:bg-accent/50 rounded-md transition-colors">
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white flex-shrink-0 mr-2">
              {loading ? <Spinner /> : <Home size={20} />}
            </div>
            <span>My Cultural Capital</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="start">
          <DropdownMenuLabel>Select Reflection Topic</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              dispatch(setSelectedTopicId(null));
              navigate("/my-cultural-capital");
            }}
            className="flex items-center gap-3 p-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              All
            </div>
            <div>
              <div className="font-medium text-sm">All Topics</div>
              <div className="text-xs text-muted-foreground">
                View all reflections
              </div>
            </div>
          </DropdownMenuItem>
          {loading ? (
            <div className="flex items-center justify-center p-4">
              <Spinner />
              <span className="ml-2">Loading topics...</span>
            </div>
          ) : topics.length === 0 ? (
            <div className="flex items-center justify-center p-4">
              <span className="text-muted-foreground">No topics available</span>
            </div>
          ) : (
            topics.map((topic: any) => (
              <DropdownMenuItem
                key={topic.id}
                onClick={() => handleTopicClick(topic.id.toString())}
                className="flex items-center gap-3 p-3"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {topic.title?.charAt(0).toUpperCase() || "T"}
                </div>
                <div>
                  <div className="font-medium text-sm">{topic.title}</div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CulturalCapitalDropdown;
