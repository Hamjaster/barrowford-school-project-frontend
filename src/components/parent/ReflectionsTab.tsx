"use client";

import { useState } from "react";
import {
  MessageSquare,
  Clock,
  FileText,
  Send,
  User,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import AttachmentDisplay from "@/components/AttachmentDisplay";
import FilterDropdown from "./FilterDropdown";

interface ReflectionsTabProps {
  reflections: any[];
  previousWeeks: any;
  weekFilter: string;
  onWeekFilterChange: (value: string) => void;
  isLoadingWeeks: boolean;
  onAddComment: (reflectionId: number, content: string) => Promise<void>;
  addingCommentLoading: boolean;
  addingCommentReflectionId: number | null;
  addCommentError: string;
}

const reflectionColorMap = {
  default: {
    bg: "bg-pink-50",
    icon: "bg-pink-500",
    border: "border-pink-200",
    accent: "border-pink-400",
  },
  week1: {
    bg: "bg-orange-50",
    icon: "bg-orange-500",
    border: "border-orange-200",
    accent: "border-orange-400",
  },
  week2: {
    bg: "bg-blue-50",
    icon: "bg-blue-500",
    border: "border-blue-200",
    accent: "border-blue-400",
  },
  week3: {
    bg: "bg-green-50",
    icon: "bg-green-500",
    border: "border-green-200",
    accent: "border-green-400",
  },
  week4: {
    bg: "bg-purple-50",
    icon: "bg-purple-500",
    border: "border-purple-200",
    accent: "border-purple-400",
  },
  week5: {
    bg: "bg-red-50",
    icon: "bg-red-500",
    border: "border-red-200",
    accent: "border-red-400",
  },
  week6: {
    bg: "bg-yellow-50",
    icon: "bg-yellow-500",
    border: "border-yellow-200",
    accent: "border-yellow-400",
  },
};

const getReflectionColor = (week?: string) => {
  if (!week) return reflectionColorMap.default;
  const key = `week${
    week.match(/\d+/)?.[0]
  }` as keyof typeof reflectionColorMap;
  return reflectionColorMap[key] || reflectionColorMap.default;
};

export default function ReflectionsTab({
  reflections,
  previousWeeks,
  weekFilter,
  onWeekFilterChange,
  isLoadingWeeks,
  onAddComment,
  addingCommentLoading,
  addingCommentReflectionId,
  addCommentError,
}: ReflectionsTabProps) {
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});

  const filteredReflections =
    weekFilter === "all"
      ? reflections
      : reflections.filter((reflection) => reflection.week === weekFilter);

  const handleAddComment = async (reflectionId: number) => {
    const commentText = newComments[reflectionId]?.trim();
    if (!commentText) return;

    try {
      await onAddComment(reflectionId, commentText);
      setNewComments((prev) => ({ ...prev, [reflectionId]: "" }));
    } catch (err) {
      // Error handling is done in parent component
    }
  };

  const toggleComments = (reflectionId: number) => {
    setExpandedComments((prev) => ({
      ...prev,
      [reflectionId]: !prev[reflectionId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Reflections Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Reflections</h3>
          <Badge variant="outline" className="text-xs">
            {filteredReflections.length} of {reflections.length} reflections
          </Badge>
        </div>
        <FilterDropdown
          value={weekFilter}
          onValueChange={onWeekFilterChange}
          options={
            previousWeeks?.previousWeeks?.map((week: string) => ({
              value: week,
              label: week,
            })) || []
          }
          placeholder="Filter by Week"
          isLoading={isLoadingWeeks}
        />
      </div>

      {filteredReflections.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {reflections.length === 0
              ? "No Reflections Yet"
              : "No Reflections for Selected Week"}
          </h3>
          <p className="text-sm text-gray-500">
            {reflections.length === 0
              ? "Your child's reflections will appear here."
              : "Try selecting a different week or 'All Weeks' to see more reflections."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredReflections.map((reflection) => {
            const colors = getReflectionColor(reflection.week);
            const isCommentsExpanded = expandedComments[reflection.id];

            return (
              <Card
                key={reflection.id}
                className={`${colors.bg} border-2 ${colors.border} hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`${colors.icon} p-3 rounded-full flex-shrink-0`}
                      >
                        <Lightbulb className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-base">
                          {reflection.reflection_topics?.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-white/60"
                          >
                            {reflection.week}
                          </Badge>
                          <span className="text-xs text-gray-600 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(reflection.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`bg-white/60 rounded-xl p-4 border-l-4 ${colors.accent}`}
                  >
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {reflection.content}
                    </p>
                  </div>

                  {/* Attachment Display */}
                  {reflection.attachment_url &&
                    reflection.attachment_url.length > 0 && (
                      <div className="mt-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                          <FileText className="w-4 h-4" />
                          Attachment
                        </div>
                        <div className="bg-white rounded-xl border-2 border-white/50 p-3">
                          <AttachmentDisplay
                            url={reflection.attachment_url}
                            alt="Reflection attachment"
                            maxHeight="h-48"
                            maxWidth="max-w-full"
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}

                  {reflection.reflection_comments.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <button
                        onClick={() => toggleComments(Number(reflection.id))}
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors w-full"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>
                          Comments ({reflection.reflection_comments.length})
                        </span>
                        {isCommentsExpanded ? (
                          <ChevronUp className="w-4 h-4 ml-auto" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-auto" />
                        )}
                      </button>

                      {isCommentsExpanded && (
                        <div className="space-y-3 pt-2">
                          {reflection.reflection_comments.map(
                            (comment: any) => (
                              <div
                                key={comment.id}
                                className="bg-white/70 rounded-xl p-3 border-l-4 border-blue-300"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-medium text-gray-800">
                                        {comment.user_name} (
                                        {comment.user_role.toLowerCase()})
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(
                                          comment.created_at
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                      {comment.comment}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 space-y-3">
                    <div className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/loving-parent.png" alt="Parent" />
                        <AvatarFallback className="text-xs">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        {addCommentError && (
                          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {addCommentError}
                          </div>
                        )}
                        <Textarea
                          placeholder="Share your thoughts about this reflection..."
                          value={newComments[reflection.id] || ""}
                          onChange={(e) =>
                            setNewComments((prev) => ({
                              ...prev,
                              [reflection.id]: e.target.value,
                            }))
                          }
                          className="min-h-[80px] text-sm resize-none rounded-xl"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleAddComment(Number(reflection.id))
                            }
                            disabled={!newComments[reflection.id]?.trim()}
                            className="h-8 bg-gradient-to-r from-pink-500 via-pink-600 to-pink-700 hover:from-pink-600 hover:via-pink-700 hover:to-pink-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
                            loading={
                              addingCommentLoading &&
                              addingCommentReflectionId === reflection.id
                            }
                          >
                            <Send className="w-3 h-3 mr-1" />
                            {addingCommentLoading &&
                            addingCommentReflectionId === reflection.id
                              ? "Posting..."
                              : "Post Comment"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
