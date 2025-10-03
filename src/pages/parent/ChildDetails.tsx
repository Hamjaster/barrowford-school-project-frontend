"use client";

import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
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
  Clock,
  CheckCircle,
  Zap,
  Send,
  User,
  Loader2,
  FileText,
  Image as ImageIcon,
  Download,
  UserCircle,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { DEFAULT_AVATAR_URL } from "@/constants";
import AttachmentDisplay from "@/components/AttachmentDisplay";

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

  // Filter states
  const [learningSubjectFilter, setLearningSubjectFilter] =
    useState<string>("all");
  const [photosYearFilter, setPhotosYearFilter] = useState<string>("all");
  const [reflectionWeekFilter, setReflectionWeekFilter] =
    useState<string>("all");

  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

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
    const studentId = parseInt(childId); // convert to number
    dispatch(fetchReflectionsByStudentId(studentId));
  }, [dispatch, childId]);

  useEffect(() => {
    if (childId) {
      dispatch(fetchChildDetails(childId));
    }
  }, [childId, dispatch]);

  // Fetch year groups, subjects, and weeks on component mount
  useEffect(() => {
    dispatch(fetchYearGroups());
    dispatch(fetchAllSubjects());
    dispatch(fetchPreviousWeeks());
  }, [dispatch]);

  if (isLoadingChildDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading child details...</p>
        </div>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Child Not Found
          </h1>
          <Button onClick={() => navigate("/")}>
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

  // Filter functions
  const filterLearningsBySubject = (
    learnings: any[],
    subjectFilter: string
  ) => {
    if (subjectFilter === "all") return learnings;
    return learnings.filter((learning) => {
      return learning.subject?.name === subjectFilter;
    });
  };

  const filterImagesByYear = (images: ImageItem[], yearFilter: string) => {
    if (yearFilter === "all") return images;
    return images.filter((image) => {
      return image.yearGroup === yearFilter;
    });
  };

  const filterReflectionsByWeek = (reflections: any[], weekFilter: string) => {
    if (weekFilter === "all") return reflections;
    return reflections.filter((reflection) => reflection.week === weekFilter);
  };

  // Get filtered data
  const filteredLearnings = filterLearningsBySubject(
    selectedChild.learnings,
    learningSubjectFilter
  );
  const filteredImages = filterImagesByYear(images, photosYearFilter);
  const filteredReflections = filterReflectionsByWeek(
    selectedChild.reflections,
    reflectionWeekFilter
  );

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  const handleAddComment = async (reflectionId: number) => {
    const commentText = newComments[reflectionId]?.trim();
    if (!commentText) return;

    try {
      // clear old error before request
      setAddCommentError("");
      setAddingCommentReflectionId(reflectionId);
      // ✅ unwrap so errors can be caught
      await dispatch(
        addReflectionComment({ reflectionId, content: commentText })
      ).unwrap();

      // ✅ clear input on success
      setNewComments((prev) => ({ ...prev, [reflectionId]: "" }));
    } catch (err: any) {
      // ❌ show backend error for this reflection
      setAddCommentError("Failed while uploading comments");
    } finally {
      setAddingCommentReflectionId(null);
    }
  };

  // Filter component
  const FilterDropdown = ({
    value,
    onValueChange,
    options,
    placeholder,
    isLoading = false,
  }: {
    value: string;
    onValueChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
    isLoading?: boolean;
  }) => (
    <div className="flex items-center gap-2">
      <Filter className="w-4 h-4 text-gray-500" />
      <Select value={value} onValueChange={onValueChange} disabled={isLoading}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All {placeholder.toLowerCase()}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value !== "all" && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onValueChange("all")}
          className="h-8 w-8 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "learning":
        return (
          <div className="space-y-6">
            {/* Learning Filter */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Learning Activities
              </h3>
              <FilterDropdown
                value={learningSubjectFilter}
                onValueChange={setLearningSubjectFilter}
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
                  {selectedChild.learnings.length === 0
                    ? "No Learning Activities Yet"
                    : "No Learning Activities for Selected Subject"}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedChild.learnings.length === 0
                    ? "Your child's learning activities will appear here."
                    : "Try selecting a different subject or 'All Subjects' to see more activities."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredLearnings.map((learning) => (
                  <Card
                    key={learning.id}
                    className="hover:shadow-md transition-shadow duration-200"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800 text-base">
                              {learning.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              {learning.subject && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-green-100 text-green-800"
                                >
                                  {learning.subject.name}
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(
                                  learning.created_at
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-400">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {learning.description}
                        </p>
                      </div>
                      {learning.attachment_url && (
                        <div className="mt-4">
                          <AttachmentDisplay
                            url={learning.attachment_url}
                            alt="Learning attachment"
                            maxHeight="h-32"
                            maxWidth="max-w-full"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case "photos":
        return (
          <div className="space-y-6">
            {/* Photos Filter */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Photos</h3>
              <FilterDropdown
                value={photosYearFilter}
                onValueChange={setPhotosYearFilter}
                options={yearGroups.map((year) => ({
                  value: year.name,
                  label: year.name,
                }))}
                placeholder="Filter by Year"
                isLoading={isLoadingYearGroups}
              />
            </div>

            {filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  {selectedChild.images.length === 0
                    ? "No Photos Yet"
                    : "No Photos for Selected Year"}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedChild.images.length === 0
                    ? "Your child's photos will appear here."
                    : "Try selecting a different year or 'All Years' to see more photos."}
                </p>
              </div>
            ) : (
              <Masonry
                breakpointCols={breakpointColumnsObj}
                className="masonry-grid"
                columnClassName="masonry-grid-column"
              >
                {filteredImages.map((image) => (
                  <div
                    key={image.id}
                    onClick={() => setSelectedImage(image)}
                    className="relative mb-4 group cursor-pointer"
                  >
                    <div className="aspect-square overflow-hidden rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = DEFAULT_AVATAR_URL;
                        }}
                      />
                    </div>
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-md flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-2 text-white">
                          <ImageIcon className="w-5 h-5" />
                          <span className="text-sm font-medium">
                            View Image
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Masonry>
            )}
          </div>
        );

      case "reflections":
        return (
          <div className="space-y-6">
            {/* Reflections Filter */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Reflections
                </h3>
                <Badge variant="outline" className="text-xs">
                  {filteredReflections.length} of{" "}
                  {selectedChild.reflections.length} reflections
                </Badge>
              </div>
              <FilterDropdown
                value={reflectionWeekFilter}
                onValueChange={setReflectionWeekFilter}
                options={
                  previousWeeks?.previousWeeks?.map((week) => ({
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
                  {selectedChild.reflections.length === 0
                    ? "No Reflections Yet"
                    : "No Reflections for Selected Week"}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedChild.reflections.length === 0
                    ? "Your child's reflections will appear here."
                    : "Try selecting a different week or 'All Weeks' to see more reflections."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredReflections.map((reflection) => {
                  return (
                    <Card
                      key={reflection.id}
                      className="hover:shadow-md transition-shadow duration-200"
                    >
                      <CardContent className="px-6 py-2">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <h4 className="font-semibold text-gray-800 text-base">
                                {/* {reflection.reflectiontopics.title} */}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-gray-100"
                                >
                                  {reflection.week}
                                </Badge>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(
                                    reflection.created_at
                                  ).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-400">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {reflection.content}
                          </p>
                        </div>

                        {reflection.reflectioncomments.length > 0 && (
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <MessageSquare className="w-4 h-4" />
                              Comments ({reflection.reflectioncomments.length})
                            </div>

                            {reflection.reflectioncomments.map(
                              (comment: any) => (
                                <div
                                  key={comment.id}
                                  className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-200"
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

                        <div className="mt-4 space-y-3">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <MessageSquare className="w-4 h-4" />
                            Add a comment
                          </div>
                          <div className="flex gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src="/loving-parent.png"
                                alt="Parent"
                              />
                              <AvatarFallback className="text-xs">
                                <User className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              {addcommentError && (
                                <div className="p-3 mb-4 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
                                  {addcommentError}
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
                                className="min-h-[80px] text-sm resize-none"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleAddComment(Number(reflection.id))
                                  }
                                  disabled={!newComments[reflection.id]?.trim()}
                                  className="h-8 bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:from-gray-800 hover:via-gray-900 hover:to-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MessageSquare className="w-3 h-3" />
                            <span>Student Reflection</span>
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
    <div className="min-h-screen bg-gray-50">
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
      `}</style>

      <div className="w-full mx-auto px-6 py-8">
        {/* Child Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* <Avatar className="w-24 h-24"> */}
              {/* <AvatarImage
                src={DEFAULT_AVATAR_URL}
                alt={`${child.first_name} ${child.last_name}`}
              /> */}
              <div className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full border-2 border-blue-100 group-hover:border-blue-300 transition-colors">
  <UserCircle className="w-12 h-12 " />
</div>
              {/* <AvatarFallback className="text-2xl">
                {child.first_name[0]}
                {child.last_name[0]}
              </AvatarFallback> */}
            {/* </Avatar> */}

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {child.first_name} {child.last_name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Username: {child.username}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Year Group: {child.year_group_id || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Class: {child.class_id || "N/A"}</span>
                </div>
              </div>
              <div className="flex justify-center md:justify-start gap-2">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {child.status === "active"
                    ? "Active Student"
                    : child.status || "Active Student"}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
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
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="border-b">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`cursor-pointer flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">{renderTabContent()}</div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <div className="relative">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedImage.title}
                    </h2>
                    <p className="text-gray-500 text-sm mb-4">
                      Uploaded on{" "}
                      {new Date(selectedImage.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = selectedImage.url;
                        link.download = selectedImage.title;
                        link.target = "_blank";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
