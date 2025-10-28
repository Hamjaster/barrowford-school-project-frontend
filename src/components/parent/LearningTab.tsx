"use client";

import { BookOpen, Clock, Zap, Target, Lightbulb, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AttachmentDisplay from "@/components/AttachmentDisplay";
import FilterDropdown from "./FilterDropdown";

interface LearningTabProps {
  learnings: any[];
  subjects: any[];
  subjectFilter: string;
  onSubjectFilterChange: (value: string) => void;
  isLoadingSubjects: boolean;
}

// Color mapping for subjects - matching student portal palette
const subjectColorMap: {
  [key: string]: { bg: string; icon: string; border: string; badge: string };
} = {
  default: {
    bg: "bg-orange-50",
    icon: "bg-orange-500",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-800",
  },
  english: {
    bg: "bg-blue-50",
    icon: "bg-blue-500",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-800",
  },
  math: {
    bg: "bg-green-50",
    icon: "bg-green-500",
    border: "border-green-200",
    badge: "bg-green-100 text-green-800",
  },
  science: {
    bg: "bg-purple-50",
    icon: "bg-purple-500",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-800",
  },
  history: {
    bg: "bg-pink-50",
    icon: "bg-pink-500",
    border: "border-pink-200",
    badge: "bg-pink-100 text-pink-800",
  },
  art: {
    bg: "bg-yellow-50",
    icon: "bg-yellow-500",
    border: "border-yellow-200",
    badge: "bg-yellow-100 text-yellow-800",
  },
};

const getSubjectColor = (subjectName?: string) => {
  if (!subjectName) return subjectColorMap.default;
  const key = subjectName.toLowerCase();
  return subjectColorMap[key] || subjectColorMap.default;
};

const getIconForSubject = (subjectName?: string) => {
  const name = subjectName?.toLowerCase() || "";
  if (name.includes("english")) return Lightbulb;
  if (name.includes("math")) return Target;
  if (name.includes("science")) return Zap;
  if (name.includes("history")) return Award;
  return BookOpen;
};

export default function LearningTab({
  learnings,
  subjects,
  subjectFilter,
  onSubjectFilterChange,
  isLoadingSubjects,
}: LearningTabProps) {
  const filteredLearnings =
    subjectFilter === "all"
      ? learnings
      : learnings.filter(
          (learning) => learning.subject?.name === subjectFilter
        );

  return (
    <div className="space-y-6">
      {/* Learning Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Learning Activities
        </h3>
        <FilterDropdown
          value={subjectFilter}
          onValueChange={onSubjectFilterChange}
          options={subjects.map((subject) => ({
            value: subject.name,
            label: subject.name,
          }))}
          placeholder="Filter by Subject"
          isLoading={isLoadingSubjects}
        />
      </div>

      {filteredLearnings.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {learnings.length === 0
              ? "No Learning Activities Yet"
              : "No Learning Activities for Selected Subject"}
          </h3>
          <p className="text-sm text-gray-500">
            {learnings.length === 0
              ? "Your child's learning activities will appear here."
              : "Try selecting a different subject or 'All Subjects' to see more activities."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredLearnings.map((learning) => {
            const colors = getSubjectColor(learning.subject?.name);
            const IconComponent = getIconForSubject(learning.subject?.name);

            return (
              <Card
                key={learning.id}
                className={`${colors.bg} border-2 ${colors.border} hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`${colors.icon} p-3 rounded-full flex-shrink-0`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 text-base">
                          {learning.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          {learning.subject && (
                            <Badge
                              variant="secondary"
                              className={`text-xs ${colors.badge}`}
                            >
                              {learning.subject.name}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(learning.created_at).toLocaleDateString(
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
                  {learning.description && (
                    <div className="bg-white/60 rounded-xl p-4 border border-white/80">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {learning.description}
                      </p>
                    </div>
                  )}
                  {learning.attachment_url && (
                    <div className="mt-4">
                      <AttachmentDisplay
                        url={learning.attachment_url}
                        alt="Learning attachment"
                        maxHeight="h-48"
                        maxWidth="max-w-full"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
