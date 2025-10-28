"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  BookOpen,
  Camera,
  MessageSquare,
  Award,
  Calendar,
  Users,
  Heart,
  Star,
  CheckCircle,
  Zap,
  Loader2,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LearningTab from "@/components/parent/LearningTab";
import PhotosTab from "@/components/parent/PhotosTab";
import ReflectionsTab from "@/components/parent/ReflectionsTab";
import { useNavigate, useParams } from "react-router-dom";
import type { RootState, AppDispatch } from "@/store";
import {
  fetchReflectionsByStudentId,
  fetchPreviousWeeks,
} from "@/store/slices/reflectionSlice";
import { addReflectionComment } from "@/store/slices/parentSlice";
import {
  fetchYearGroups,
  fetchAllSubjects,
} from "@/store/slices/yearDataSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchChildDetails } from "@/store/slices/parentSlice";
import { getYearGroupDisplayName } from "@/utils/yearGroupUtils";

// Convert StudentImage to ImageItem for display
interface ImageItem {
  id: string;
  url: string;
  title: string;
  uploadDate: string;
  yearGroup: string;
}

const convertToImageItem = (studentImage: any): ImageItem => ({
  id: studentImage.id,
  url: studentImage.image_url,
  title: `Image ${studentImage.id}`,
  uploadDate: studentImage.created_at.split("T")[0],
  yearGroup: studentImage.yeargroup.name,
});

const tabs = [
  { id: "learning", label: "Learning", icon: BookOpen },
  { id: "photos", label: "Photos", icon: Camera },
  { id: "reflections", label: "Reflections", icon: MessageSquare },
];

export default function ChildDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const childId = params.id as string;
  const [activeTab, setActiveTab] = useState("learning");

  const [addcommentError, setAddCommentError] = useState<string>("");
  const [addingCommentReflectionId, setAddingCommentReflectionId] = useState<
    number | null
  >(null);
  const { selectedChild, isLoadingChildDetails, addingCommentLoading } =
    useSelector((state: RootState) => state.parent);

  useEffect(() => {
    console.log("selectedChild : ", selectedChild);
  }, [selectedChild]);

  // Filter states
  const [learningSubjectFilter, setLearningSubjectFilter] =
    useState<string>("all");
  const [photosYearFilter, setPhotosYearFilter] = useState<string>("all");
  const [reflectionWeekFilter, setReflectionWeekFilter] =
    useState<string>("all");

  // Get year groups, subjects, and weeks from Redux store
  const {
    yearGroups,
    subjects,
    isLoading: isLoadingYearGroups,
    isLoadingSubjects,
  } = useSelector((state: RootState) => state.yearData);
  const { previousWeeks, loading: isLoadingWeeks } = useSelector(
    (state: RootState) => state.reflection
  );

  useEffect(() => {
    const studentId = Number.parseInt(childId); // convert to number
    dispatch(fetchReflectionsByStudentId(studentId) as any);
  }, [dispatch, childId]);

  useEffect(() => {
    if (childId) {
      dispatch(fetchChildDetails(childId) as any);
    }
  }, [childId, dispatch]);

  // Fetch year groups, subjects, and weeks on component mount
  useEffect(() => {
    dispatch(fetchYearGroups() as any);
    dispatch(fetchAllSubjects() as any);
    dispatch(fetchPreviousWeeks() as any);
  }, [dispatch]);

  if (isLoadingChildDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading child details...</p>
        </div>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Child Not Found
          </h1>
          <Button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const child = selectedChild.student;

  // Convert student images to display format
  const images = selectedChild.images.map(convertToImageItem);

  const handleAddComment = async (reflectionId: number, content: string) => {
    try {
      // clear old error before request
      setAddCommentError("");
      setAddingCommentReflectionId(reflectionId);
      // ✅ unwrap so errors can be caught
      await dispatch(
        addReflectionComment({ reflectionId, content }) as any
      ).unwrap();
    } catch (err: any) {
      // ❌ show backend error for this reflection
      setAddCommentError("Failed while uploading comments");
      throw err; // Re-throw to let ReflectionsTab handle it
    } finally {
      setAddingCommentReflectionId(null);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "learning":
        return (
          <LearningTab
            learnings={selectedChild.learnings}
            subjects={subjects}
            subjectFilter={learningSubjectFilter}
            onSubjectFilterChange={setLearningSubjectFilter}
            isLoadingSubjects={isLoadingSubjects}
          />
        );

      case "photos":
        return (
          <PhotosTab
            images={images}
            yearGroups={yearGroups}
            yearFilter={photosYearFilter}
            onYearFilterChange={setPhotosYearFilter}
            isLoadingYearGroups={isLoadingYearGroups}
          />
        );

      case "reflections":
        return (
          <ReflectionsTab
            reflections={selectedChild.reflections}
            previousWeeks={previousWeeks}
            weekFilter={reflectionWeekFilter}
            onWeekFilterChange={setReflectionWeekFilter}
            isLoadingWeeks={isLoadingWeeks}
            onAddComment={handleAddComment}
            addingCommentLoading={addingCommentLoading}
            addingCommentReflectionId={addingCommentReflectionId}
            addCommentError={addcommentError}
          />
        );

      case "other tabs":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      title: "Math Star",
                      description: "Completed all multiplication tables",
                      date: "2024-01-20",
                    },
                    {
                      title: "Reading Champion",
                      description: "Read 10 books this month",
                      date: "2024-01-15",
                    },
                    {
                      title: "Helpful Friend",
                      description: "Helped classmates with projects",
                      date: "2024-01-10",
                    },
                  ].map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg"
                    >
                      <Star className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">
                          {achievement.title}
                        </p>
                        <p className="text-xs text-gray-600">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {achievement.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    Skills Development
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      skill: "Problem Solving",
                      level: 4,
                    },
                    {
                      skill: "Creativity",
                      level: 5,
                    },
                    {
                      skill: "Teamwork",
                      level: 4,
                    },
                    {
                      skill: "Communication",
                      level: 3,
                    },
                  ].map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{skill.skill}</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < skill.level
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return <div>Content for {activeTab}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50">
      <style>{`
        .masonry-grid {
          display: flex;
          margin-left: -16px;
          width: auto;
        }
        .masonry-grid-column {
          padding-left: 16px;
          background-clip: padding-box;
        }
        .msnry {
          column-count: 4;
          column-gap: 16px;
        }
        @media (max-width: 1200px) {
          .msnry {
            column-count: 3;
          }
        }
        @media (max-width: 768px) {
          .msnry {
            column-count: 2;
          }
        }
        @media (max-width: 480px) {
          .msnry {
            column-count: 1;
          }
        }
        .msnry > div {
          break-inside: avoid;
          margin-bottom: 16px;
        }
      `}</style>

      <div className="w-full mx-auto px-6 py-8">
        {/* Child Profile Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl shadow-lg p-8 mb-8 text-white relative">
          {/* Back Button */}
          <Button
            onClick={() => navigate("/parent-dashboard")}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white border-white/40 hover:border-white/60 transition-all duration-200 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </Button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {selectedChild.student.profile_photo ? (
              <img
                src={selectedChild.student.profile_photo || "/placeholder.svg"}
                alt={`${selectedChild.student.first_name} ${selectedChild.student.last_name}`}
                className={`w-16 h-16 rounded-full object-cover border-3  group-hover:shadow-md transition-all`}
              />
            ) : (
              <div
                className={`w-16 h-16 flex items-center justify-center bg-white/20 rounded-full border-3 border-white/40 backdrop-blur-sm transition-all`}
              >
                <UserCircle className="w-10 h-10 text-white" />
              </div>
            )}

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-3 text-white">
                {child.first_name} {child.last_name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white/90 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">{child.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-sm">
                    {getYearGroupDisplayName(child.year_group_id, yearGroups)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">{child.class_id || "N/A"}</span>
                </div>
              </div>
              <div className="flex justify-center md:justify-start gap-3">
                <Badge className="bg-white/20 text-white border-white/40 hover:bg-white/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {child.status === "active"
                    ? "Active Student"
                    : child.status || "Active Student"}
                </Badge>
                <Badge className="bg-white/20 text-white border-white/40 hover:bg-white/30">
                  <Heart className="w-3 h-3 mr-1" />
                  Joined{" "}
                  {new Date(child.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const colors = [
                  "text-blue-600 border-blue-600 bg-blue-50 hover:bg-blue-100",
                  "text-green-600 border-green-600 bg-green-50 hover:bg-green-100",
                  "text-purple-600 border-purple-600 bg-purple-50 hover:bg-purple-100",
                ];
                const inactiveColors = [
                  "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
                  "text-gray-600 hover:text-green-600 hover:bg-green-50",
                  "text-gray-600 hover:text-purple-600 hover:bg-purple-50",
                ];
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`cursor-pointer flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-all ${
                      activeTab === tab.id
                        ? `border-b-2 ${colors[index]}`
                        : inactiveColors[index]
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
