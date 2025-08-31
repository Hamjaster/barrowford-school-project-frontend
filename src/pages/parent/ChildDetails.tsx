import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Camera,
  MessageSquare,
  Activity,
  Award,
  Calendar,
  Users,
  Heart,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useNavigate, useParams } from "react-router-dom";
import { mockChildren } from "@/constants";

const tabs = [
  { id: "learning", label: "Learning", icon: BookOpen },
  { id: "photos", label: "Photos", icon: Camera },
  { id: "reflections", label: "Reflections", icon: MessageSquare },
  { id: "other tabs", label: "Other Tabs", icon: Award },
];

export default function ChildDetailsPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("learning");

  const childId = params.id as string;
  const child = mockChildren.find((c) => c.id === childId);

  if (!child) {
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
  const mockReflections = [
    {
      id: 1,
      topic: "Mathematics Learning",
      reflection:
        "Today I learned about fractions and how to divide them. At first, it seemed really difficult, but when Mrs. Johnson showed us with pizza slices, everything clicked! I realized that 1/2 of a pizza is the same as 2/4. I felt proud when I solved the practice problems correctly. I want to practice more division problems at home.",
      date: "2024-01-22",
      mood: "excited",
      week: "Week 1",
    },
    {
      id: 2,
      topic: "Science Experiment",
      reflection:
        "We did a volcano experiment today using baking soda and vinegar. It was amazing to see the chemical reaction! I learned that when you mix an acid (vinegar) with a base (baking soda), it creates carbon dioxide gas. The eruption was so cool. I was a bit nervous at first, but working with my lab partner made it fun.",
      date: "2024-01-21",
      mood: "curious",
      week: "Week 2",
    },
    {
      id: 3,
      topic: "Reading Time",
      reflection:
        "Today we read 'Charlotte's Web' during story time. I love how Charlotte is so clever and kind to Wilbur. The story made me think about friendship and how we can help each other. Mrs. Smith asked us great questions about the characters. I shared my thoughts about how Charlotte shows that size doesn't matter when you want to help someone.",
      date: "2024-01-20",
      mood: "thoughtful",
      week: "Week 3",
    },
    {
      id: 4,
      topic: "Art Project",
      reflection:
        "We created self-portraits using watercolors today. I learned about mixing colors to create new ones - blue and yellow make green! I was frustrated at first because my painting didn't look exactly like me, but then I realized art is about expressing yourself, not making everything perfect. I'm proud of how I showed my personality through the colors I chose.",
      date: "2024-01-19",
      mood: "creative",
      week: "Week 4",
    },
  ];
  const renderTabContent = () => {
    switch (activeTab) {
      case "learning":
        return (
          <div className="space-y-6 h-52 flex items-center justify-center">
            Child Learnings here
          </div>
        );

      case "photos":
        return (
          <div className="space-y-6 h-52 flex items-center justify-center">
            Child photos here
          </div>
        );

      case "reflections":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <Badge variant="outline" className="text-xs">
                {mockReflections.length} total reflections
              </Badge>
            </div>

            <div className="grid gap-6">
              {mockReflections.map((reflection) => {
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
                              {reflection.topic}
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
                                {new Date(reflection.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-400">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {reflection.reflection}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MessageSquare className="w-3 h-3" />
                          <span>Student Reflection</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Heart className="w-3 h-3" />
                          <span>Shared with love</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Empty state for when no reflections */}
            {mockReflections.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  No Reflections Yet
                </h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Your child's daily reflections and thoughts about their
                  learning journey will appear here.
                </p>
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
                    { skill: "Problem Solving", level: 4 },
                    { skill: "Creativity", level: 5 },
                    { skill: "Teamwork", level: 4 },
                    { skill: "Communication", level: 3 },
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
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Child Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={child.avatar || "/placeholder.svg"}
                alt={`${child.first_name} ${child.last_name}`}
              />
              <AvatarFallback className="text-2xl">
                {child.first_name[0]}
                {child.last_name[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {child.first_name} {child.last_name}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Age {child.age}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{child.grade}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Class {child.class}</span>
                </div>
              </div>
              <div className="flex justify-center md:justify-start gap-2">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active Student
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  <Heart className="w-3 h-3 mr-1" />
                  Enrolled Since Jan 2024
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
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
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
    </div>
  );
}
