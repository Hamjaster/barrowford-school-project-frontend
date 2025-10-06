import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  BookOpen,
  Edit3,
  GraduationCap,
  Heart,
  Lightbulb,
  Loader2,
  Save,
  Shield,
  UserCircle,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
//import for personal section
import supabase from "@/lib/supabse";
import {
  clearError, clearMessage,
  createPersonalSection,
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTopics,
  getPersonalSectionByTopic,
  updatePersonalSection,
} from "@/store/slices/personalSectionSlice";
import { fetchStudentDetails } from '@/store/slices/studentSlice';
import type { PersonalSection, Topic } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import type { AppDispatch, RootState } from "../../store";


import type { RootState, AppDispatch } from "../../store";
import type { Topic, PersonalSection } from "@/types";
import supabase from "@/lib/supabse";
import { toast } from "sonner";
import { clearError, clearMessage } from "@/store/slices/personalSectionSlice";
import { fetchStudentDetails } from "@/store/slices/studentSlice";
import { Badge } from "@/components/ui/badge";

// Icon mapping for different topics
const getTopicIcon = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("love") || lowerTitle.includes("me"))
    return <Heart className="w-6 h-6" />;
  if (lowerTitle.includes("read") || lowerTitle.includes("book"))
    return <BookOpen className="w-6 h-6" />;
  if (lowerTitle.includes("ambition") || lowerTitle.includes("dream"))
    return <Lightbulb className="w-6 h-6" />;
  if (lowerTitle.includes("step") || lowerTitle.includes("next"))
    return <ArrowRight className="w-6 h-6" />;
  if (lowerTitle.includes("teacher") || lowerTitle.includes("adult"))
    return <Users className="w-6 h-6" />;
  if (lowerTitle.includes("strength") || lowerTitle.includes("good"))
    return <Zap className="w-6 h-6" />;
  if (lowerTitle.includes("school") || lowerTitle.includes("education"))
    return <GraduationCap className="w-6 h-6" />;
  if (lowerTitle.includes("safety") || lowerTitle.includes("people"))
    return <Shield className="w-6 h-6" />;
  return <Heart className="w-6 h-6" />; // Default icon
};

// Color mapping for different topics with gradients
const getTopicColors = (index: number) => {
  const colors = [
    {
      border: "border-orange-400",
      bg: "bg-gradient-to-br from-orange-100 via-orange-50 to-amber-100",
      icon: "bg-gradient-to-br from-orange-400 to-orange-600",
      shadow: "shadow-orange-200/50",
    },
    {
      border: "border-sky-300",
      bg: "bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100",
      icon: "bg-gradient-to-br from-sky-300 to-sky-500",
      shadow: "shadow-sky-200/50",
    },
    {
      border: "border-blue-500",
      bg: "bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100",
      icon: "bg-gradient-to-br from-blue-500 to-blue-700",
      shadow: "shadow-blue-200/50",
    },
    {
      border: "border-pink-500",
      bg: "bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200",
      icon: "bg-gradient-to-br from-pink-500 to-pink-600",
      shadow: "shadow-pink-200/50",
    },
    {
      border: "border-green-500",
      bg: "bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100",
      icon: "bg-gradient-to-br from-green-500 to-green-600",
      shadow: "shadow-green-200/50",
    },
    {
      border: "border-amber-500",
      bg: "bg-gradient-to-br from-amber-100 via-yellow-50 to-orange-100",
      icon: "bg-gradient-to-br from-amber-500 to-amber-600",
      shadow: "shadow-amber-200/50",
    },
    {
      border: "border-purple-500",
      bg: "bg-gradient-to-br from-purple-100 via-violet-50 to-purple-200",
      icon: "bg-gradient-to-br from-purple-500 to-purple-600",
      shadow: "shadow-purple-200/50",
    },
    {
      border: "border-red-500",
      bg: "bg-gradient-to-br from-red-100 via-rose-50 to-pink-100",
      icon: "bg-gradient-to-br from-red-500 to-red-600",
      shadow: "shadow-red-200/50",
    },
  ];
  return colors[index % colors.length];
};

// Status badge component
const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs"
        >
          ⏳ Pending Review
        </Badge>
      );
    case "approved":
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-700 border-green-200 text-xs"
        >
          ✅ Approved
        </Badge>
      );
    case "pending_updation":
      return (
        <Badge
          variant="secondary"
          className="bg-blue-100 text-blue-700 border-blue-200 text-xs"
        >
          🔄 Pending Update
        </Badge>
      );
    case "rejected":
      return (
        <Badge
          variant="secondary"
          className="bg-red-100 text-red-700 border-red-200 text-xs"
        >
          ❌ Rejected
        </Badge>
      );
    default:
      return null;
  }
};

export default function StudentDashboard() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [existingPersonalSection, setExistingPersonalSection] =
    useState<PersonalSection | null>(null);
  const { studentDetails, isLoading, error: studentError } = useSelector(
  const { studentDetails, error: studentError } = useSelector(
    (state: RootState) => state.student
  );
  const dispatch = useDispatch<AppDispatch>();

  // Grab state from Redux
  const {
    topics,
    loading,
    personalSectionLoading,
    personalSectionSubmitting,
    error,
    message,
  } = useSelector((state: RootState) => state.personalSection);

  // Fetch topics on component mount
  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  // Handle success/error messages
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
    if (message) {
      toast.success(message);
      dispatch(clearMessage());
    }
  }, [error, message, dispatch]);

  useEffect(() => {
    dispatch(fetchStudentDetails());
  }, [dispatch]);

  // Handle topic selection
  const handleTopicClick = async (topic: Topic) => {
    setSelectedTopic(topic);
    setIsEditing(false);
    setEditingContent("");

    // Check if personal section exists for this topic
    try {
      const result = await dispatch(
        getPersonalSectionByTopic({ topicId: topic.id })
      ).unwrap();
      if (result) {
        setExistingPersonalSection(result);
        setEditingContent(result.content);
      } else {
        setExistingPersonalSection(null);
        setEditingContent("");
      }
    } catch (error) {
      console.error("Error fetching personal section:", error);
      setExistingPersonalSection(null);
      setEditingContent("");
    }
  };

  // Handle save content
  const handleSaveContent = async () => {
    if (!selectedTopic || !editingContent.trim()) return;

    try {
      if (existingPersonalSection) {
        // Update existing personal section
        await dispatch(
          updatePersonalSection({
            id: existingPersonalSection.id,
            content: editingContent,
          })
        )
          .unwrap()
          .then((result) => {
            setExistingPersonalSection(result);
            setEditingContent(result.content);
            setIsEditing(false);
            console.log(result, "updated RESULT here !!");
          });
      } else {
        // Create new personal section
        const result = await dispatch(
          createPersonalSection({
            topicId: selectedTopic.id,
            content: editingContent,
          })
        )
          .unwrap()
          .then((result) => {
            setExistingPersonalSection(result);
            setEditingContent(result.content);
            setIsEditing(false);
            console.log(result, "result here !!");
          });
        console.log(result, "result here !!");
      }
    } catch (error) {
      console.error("Error saving personal section:", error);
    }
  };

  // Handle edit mode
  const handleEdit = () => {
    // Don't allow editing if there's a pending update
    if (existingPersonalSection?.status === "pending_updation") {
      return;
    }
    setIsEditing(true);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingContent(existingPersonalSection?.content || "");
  };
  
  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      console.log(data, "user data");
    }
    getUser();
  }, []);
  if (studentError) {
    return <p className="text-red-500">{studentError}</p>;
  }
  return (
    <div className="min-h-screen relative bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 rounded-b-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Dashboard</h1>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Profile Section */}

<div className="bg-white rounded-2xl p-6 shadow-sm">
  {isLoading ? (
    // 🔄 Loading State
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-500" />
      <p className="text-lg font-medium">Loading student details...</p>
    </div>
  ) : studentDetails && Object.keys(studentDetails).length > 0 ? (
    // ✅ Student Details Available
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div className="flex-shrink-0">
        {studentDetails.profile_photo ? (
          <img
            src={studentDetails.profile_photo}
            alt="Picture Not Found"
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 group-hover:border-blue-300 transition-colors"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full border-2 border-black-600 group-hover:border-blue-300 transition-colors">
            <UserCircle className="w-12 h-12" />
          </div>
        )}
      </div>

      <div className="flex-1">
        <h2 className="text-5xl font-bold text-gray-800 mb-4">
          {studentDetails.name} is a Meliorist
        </h2>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 min-w-[280px]">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{studentDetails.name || "Not Specified"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Age:</span>
            <span className="font-medium">{studentDetails?.age || "Not Specified"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Year:</span>
            <span className="font-medium">{studentDetails.year || "Not Specified"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Class:</span>
            <span className="font-medium">{studentDetails?.class || "Not Specified"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Hair Color:</span>
            <span className="font-medium">{studentDetails?.haircolor || "Not Specified"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Eye Color:</span>
            <span className="font-medium">{studentDetails?.eyecolor || "Not Specified"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Height:</span>
            <span className="font-medium">{studentDetails?.height || "Not Specified"}</span>
          </div>
        </div>
      </div>
    </div>
  ) : (
    // ❌ No Data Fallback
    <div className="text-center text-gray-500 text-lg font-medium border-2 border-dashed rounded-xl p-8">
      No student details available.
    </div>
  )}
</div>


        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-pink-500" />
              <p className="text-gray-600">Loading topics...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading topics: {error}</p>
              <Button onClick={() => dispatch(fetchTopics())}>Try Again</Button>
            </div>
          </div>
        ) : topics.filter((topic) => topic.status === "active").length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-600">
                No topics available yet. Check back later!
              </p>
            </div>
          </div>
        ) : (
          /* Topics Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics
              .filter((topic) => topic.status === "active")
              .map((topic, index) => {
                const colors = getTopicColors(index);
                const icon = getTopicIcon(topic.title);

                return (
                  <Card
                    key={topic.id}
                    className={`${colors.border} ${colors.bg} ${colors.shadow} font-medium p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border shadow-lg min-h-[120px] backdrop-blur-sm`}
                    onClick={() => handleTopicClick(topic)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`${colors.icon} text-white p-5 rounded-full shadow-lg`}
                      >
                        {icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl leading-tight">
                          {topic.title}
                        </h3>
                        {topic.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {topic.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full">
        <Footer />
      </div>

      {/* Content Editing Modal */}
      <Dialog
        open={!!selectedTopic}
        onOpenChange={() => setSelectedTopic(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedTopic && (
                <>
                  <div className="bg-pink-500 text-white p-4 rounded-full">
                    {getTopicIcon(selectedTopic.title)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedTopic.title}
                    </h3>
                    {selectedTopic.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedTopic.description}
                      </p>
                    )}
                  </div>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {personalSectionLoading ? (
              <div className="flex flex-col items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin mb-2" />
                <span>Loading content...</span>
              </div>
            ) : isEditing ? (
              <div className="space-y-4">
                <Textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  placeholder="Write your thoughts about this topic..."
                  className="min-h-[200px] resize-none"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveContent}
                    loading={personalSectionSubmitting}
                    disabled={!editingContent.trim()}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {personalSectionSubmitting
                      ? existingPersonalSection
                        ? "Updating..."
                        : "Saving..."
                      : existingPersonalSection
                        ? "Update"
                        : "Save"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {existingPersonalSection ? (
                  <div
                    className={`p-4 rounded-lg ${
                      existingPersonalSection.status === "pending_updation"
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusBadge(existingPersonalSection.status)}
                    </div>

                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {existingPersonalSection.content}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>You haven't written anything about this topic yet.</p>
                    <p className="text-sm mt-1">Click "Edit" to get started!</p>
                  </div>
                )}
                <div className="flex justify-end">
                  <Button
                    onClick={handleEdit}
                    disabled={
                      existingPersonalSection?.status === "pending_updation"
                    }
                    className={
                      existingPersonalSection?.status === "pending_updation"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {existingPersonalSection?.status === "pending_updation"
                      ? "Update Pending"
                      : existingPersonalSection
                      ? "Edit"
                      : "Write"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
