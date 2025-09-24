/**
 * TO RESTORE OLD PASSWORD MANAGEMENT:
 * 1. Uncomment the KeyRound import and ResetPasswordForm import
 * 2. Uncomment the "Password Management" card in dashboardCards array
 * 3. Uncomment the "reset-password" case in renderTabContent switch statement
 * 4. Add "reset-password", "forgot-password" back to availableTabs in constants.ts
 * 5. Update TypeScript types to include these tabs in activeTab state
 */

import React, { useState, useEffect } from "react";
import {
  Users,
  UserPlus,
  BookOpen,
  Calendar,
  GraduationCap,
  Clock,
  MessageSquare,
  ImageIcon,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
// import { KeyRound } from "lucide-react";
import CreateUserForm from "../components/forms/CreateUserForm";
// import ResetPasswordForm from "../components/forms/ResetPasswordForm";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import {
  DEFAULT_AVATAR_URL,
  mockChildren,
  mockPendingContent,
  mockReflectionTopics,
  ROLEWISE_INFORMATION,
} from "@/constants";
import { getTabDisplayName } from "@/lib/utils";
import type { UserRole } from "@/types";
import UsersTable from "@/components/UsersTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit3 } from "lucide-react";
import ReflectionTopicsManagement from "@/components/ReflectionTopicsManagement";
import StudentManagement from "@/components/StudentManagement";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchTopics,
  createTopic,
  updateTopic,
  deleteTopic,
} from "@/store/slices/personalSectionSlice";
import type { RootState, AppDispatch } from "../store";
import PersonalSectionTopicsManagement from "@/components/PersonalSectionTopicsManagement";

const StaffDashboard: React.FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [activeTab, setActiveTab] = useState("students");
  const [newTitle, setNewTitle] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const [pendingContent, setPendingContent] = useState(mockPendingContent);
  const [reflectionTopics, setReflectionTopics] =
    useState(mockReflectionTopics);

  const pendingCount = pendingContent.filter(
    (item) => item.status === "pending"
  ).length;

  // Quick stats data
  const quickStats = [
    {
      id: "total-students",
      title: "Total Students",
      value: mockChildren.length,
      icon: Users,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      id: "pending-reviews",
      title: "Pending Reviews",
      value: pendingCount,
      icon: Clock,
      bgColor: "bg-orange-500/5",
      iconColor: "text-orange-500",
    },
    {
      id: "reflection-topics",
      title: "Reflection Topics",
      value: reflectionTopics.length,
      icon: BookOpen,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      id: "total-reflections",
      title: "Total Reflections",
      value: 24,
      icon: MessageSquare,
      bgColor: "bg-orange-500/5",
      iconColor: "text-orange-500",
    },
  ];

  const handleContentModeration = (contentId: number, action: string) => {
    setPendingContent((prev) =>
      prev.map((item) =>
        item.id === contentId
          ? { ...item, status: action === "approve" ? "approved" : "rejected" }
          : item
      )
    );
  };

  // Staff can create parent and student accounts only
  const allowedCreatableRoles: UserRole[] = ["parent", "student"];
  const availableTabs = [
    "students",
    "content-review",
    "reflection-topics",
    "account-management",
    "create-user",
    "personal-section-topics",
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "create-user":
        return <CreateUserForm allowedRoles={allowedCreatableRoles} />;
      case "personal-section-topics":
        return <PersonalSectionTopicsManagement />;
      case "account-management":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Users Management
                </h2>
                <p className="text-gray-600">
                  View, search, and manage all users in the system. Reset
                  passwords directly from the table.
                </p>
              </div>
              <UsersTable />
            </div>

            <ForgotPasswordForm />
          </div>
        );
      case "reflection-topics":
        return <ReflectionTopicsManagement />;
      case "content-review":
        return (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>
                  Review and approve student submissions
                </CardDescription>
                {/* Add Topic Button */}
                <button className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition">
                  <Plus size={16} /> Add Topic
                </button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingContent
                    .filter((item) => item.status === "pending")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-4 border rounded-lg space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-lg">
                              {item.type === "reflection" ? (
                                <MessageSquare className="h-5 w-5 text-primary" />
                              ) : item.type === "personal_section" ? (
                                <BookOpen className="h-5 w-5 text-primary" />
                              ) : (
                                <ImageIcon className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {item.studentName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {item.type === "reflection"
                                  ? "Reflection"
                                  : item.type === "personal_section"
                                  ? "Personal Section"
                                  : "Image"}{" "}
                                •{" "}
                                {new Date(
                                  item.submittedAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {item.isEdit ? (
                              <Badge
                                variant="secondary"
                                className="bg-orange-100 text-orange-800 border-orange-200"
                              >
                                Edit
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800 border-green-200"
                              >
                                New
                              </Badge>
                            )}
                          </div>
                        </div>

                        {(item.type === "reflection" ||
                          item.type === "personal_section") && (
                          <div className="space-y-3">
                            <p className="font-medium">Topic: {item.topic}</p>

                            {item.isEdit ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-red-600 border-red-200 bg-red-50"
                                    >
                                      Previous Version
                                    </Badge>
                                  </div>
                                  <div className="text-sm bg-red-50 border border-red-200 p-3 rounded-lg">
                                    {item.oldContent}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-green-600 border-green-200 bg-green-50"
                                    >
                                      New Version
                                    </Badge>
                                  </div>
                                  <div className="text-sm bg-green-50 border border-green-200 p-3 rounded-lg">
                                    {item.content}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm bg-muted p-3 rounded-lg">
                                {item.content}
                              </div>
                            )}
                          </div>
                        )}

                        {item.type === "image" && (
                          <div className="space-y-3">
                            <p className="font-medium">{item.content}</p>

                            {item.isEdit ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-red-600 border-red-200 bg-red-50"
                                    >
                                      Previous Image
                                    </Badge>
                                  </div>
                                  <img
                                    src={item.oldImageUrl || "/placeholder.svg"}
                                    alt="Previous submission"
                                    className="max-w-full h-48 object-cover rounded-lg border border-red-200"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-green-600 border-green-200 bg-green-50"
                                    >
                                      New Image
                                    </Badge>
                                  </div>
                                  <img
                                    src={item.imageUrl || "/placeholder.svg"}
                                    alt="New submission"
                                    className="max-w-full h-48 object-cover rounded-lg border border-green-200"
                                  />
                                </div>
                              </div>
                            ) : (
                              <img
                                src={item.imageUrl || "/placeholder.svg"}
                                alt="Student submission"
                                className="max-w-sm rounded-lg border"
                              />
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleContentModeration(item.id, "approve")
                            }
                            className="bg-green-600 hover:bg-green-700 cursor-pointer"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleContentModeration(item.id, "reject")
                            }
                            className="cursor-pointer"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}

                  {pendingContent.filter((item) => item.status === "pending")
                    .length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                      <p>All content has been reviewed!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "students":
        return <StudentManagement />;
      default:
        return <div>No tab selected</div>;
    }
  };

  return (
    <div className="w-full p-6">
      {/* Welcome Section */}
      {isAuthenticated && user && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <GraduationCap className="text-blue-600 w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {user.first_name}!
              </h1>
              <p className="text-sm text-gray-600">
                Staff Dashboard - Manage your students and curriculum
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    <IconComponent className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 my-6 bg-gray-100 p-1 rounded-lg w-fit">
        {availableTabs.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "outline" : "ghost"}
            onClick={() => setActiveTab(tab)}
            className="cursor-pointer"
          >
            {getTabDisplayName(tab)}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default StaffDashboard;
