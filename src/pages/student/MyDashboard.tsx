import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Heart,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Users,
  Zap,
  GraduationCap,
  Shield,
  Edit3,
  Save,
  Loader2,
} from "lucide-react";
import Footer from "@/components/footer";
//import for personal section
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTopics,
  getPersonalSectionByTopic,
  createPersonalSection,
  updatePersonalSection,
} from "@/store/slices/personalSectionSlice";
import type { RootState, AppDispatch } from "../../store";
import type { Topic, PersonalSection } from "@/types";
import supabase from "@/lib/supabse";
import { toast } from "sonner";

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

// Color mapping for different topics
const getTopicColors = (index: number) => {
  const colors = [
    { border: "border-orange-400", bg: "bg-orange-100", icon: "bg-orange-400" },
    { border: "border-sky-300", bg: "bg-sky-100", icon: "bg-sky-300" },
    { border: "border-blue-500", bg: "bg-blue-100", icon: "bg-blue-500" },
    { border: "border-pink-500", bg: "bg-pink-100", icon: "bg-pink-500" },
    { border: "border-green-500", bg: "bg-green-100", icon: "bg-green-500" },
    { border: "border-amber-500", bg: "bg-amber-100", icon: "bg-amber-500" },
    { border: "border-purple-500", bg: "bg-purple-100", icon: "bg-purple-500" },
    { border: "border-red-500", bg: "bg-red-100", icon: "bg-red-500" },
  ];
  return colors[index % colors.length];
};

export default function StudentDashboard() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [existingPersonalSection, setExistingPersonalSection] =
    useState<PersonalSection | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  // Grab state from Redux
  const {
    topics,
    personalSections,
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
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
    }
  }, [message, error]);

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
        ).unwrap();
      } else {
        // Create new personal section
        const result = await dispatch(
          createPersonalSection({
            topicId: selectedTopic.id,
            content: editingContent,
          })
        ).unwrap();
        setExistingPersonalSection(result);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving personal section:", error);
    }
  };

  // Handle edit mode
  const handleEdit = () => {
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-pink-500 text-white p-6 rounded-b-2xl">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <Avatar className="w-40 h-40">
                <AvatarImage
                  src="/student-photo.png"
                  alt="Jacob Smith"
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl font-bold bg-pink-100 text-pink-600">
                  JS
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <h2 className="text-5xl font-bold text-gray-800 mb-4">
                Jacob Smith is a Meliorist
              </h2>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 min-w-[280px]">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">Jacob Smith</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium">8 Years Old</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Class:</span>
                  <span className="font-medium">3WH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hair Color:</span>
                  <span className="font-medium">Brown</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Eye Color:</span>
                  <span className="font-medium">Brown</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Height:</span>
                  <span className="font-medium">3ft 4in</span>
                </div>
              </div>
            </div>
          </div>
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
        ) : topics.length === 0 ? (
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
            {topics.map((topic, index) => {
              const colors = getTopicColors(index);
              const icon = getTopicIcon(topic.title);
              const hasContent = personalSections.some(
                (ps) => ps.topic_id === topic.id
              );

              return (
                <Card
                  key={topic.id}
                  className={`${colors.border} ${colors.bg} font-medium p-6 cursor-pointer hover:shadow-md transition-all duration-300 border shadow-lg min-h-[120px] `}
                  onClick={() => handleTopicClick(topic)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`${colors.icon} text-white p-5 rounded-full`}
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
      <Footer />

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
              <div className="flex items-center  justify-center ">
                <div>
                  <Loader2 className="h-5 w-5 mt-3 animate-spin " />
                </div>
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
                    {existingPersonalSection ? "Update" : "Save"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {existingPersonalSection ? (
                  <div className="bg-gray-50 p-4 rounded-lg">
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
                  <Button onClick={handleEdit}>
                    <Edit3 className="w-4 h-4 mr-2" />
                    {existingPersonalSection ? "Edit" : "Write"}
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
