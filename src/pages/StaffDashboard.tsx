/**
 * TO RESTORE OLD PASSWORD MANAGEMENT:
 * 1. Uncomment the KeyRound import and ResetPasswordForm import
 * 2. Uncomment the "Password Management" card in dashboardCards array
 * 3. Uncomment the "reset-password" case in renderTabContent switch statement
 * 4. Add "reset-password", "forgot-password" back to availableTabs in constants.ts
 * 5. Update TypeScript types to include these tabs in activeTab state
 */

import React, { useState } from "react";
import { useSelector } from "react-redux";
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
import type { RootState } from "../store";
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

const mockStudents = [
  {
    id: 1,
    firstName: "Emma",
    lastName: "Johnson",
    age: 8,
    grade: "3rd Grade",
    parentName: "Sarah Johnson",
    parentEmail: "sarah.johnson@email.com",
    avatar: "/girl-student.png",
    personalSections: [
      {
        id: 1,
        topic: "My Hobbies",
        description: "I love painting and reading books about animals.",
      },
      {
        id: 2,
        topic: "My Goals",
        description: "I want to become a veterinarian when I grow up.",
      },
    ],
  },
  {
    id: 2,
    firstName: "Liam",
    lastName: "Smith",
    age: 9,
    grade: "4th Grade",
    parentName: "Michael Smith",
    parentEmail: "michael.smith@email.com",
    avatar: "/boy-student.png",
    personalSections: [
      {
        id: 3,
        topic: "My Interests",
        description: "I enjoy building with LEGO and playing soccer.",
      },
    ],
  },
];

const StaffDashboard: React.FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [activeTab, setActiveTab] = useState("students");
  const [newTopicDialog, setNewTopicDialog] = useState(false);
  const [editingTopic, setEditingTopic] = useState(null);
  const [pendingContent, setPendingContent] = useState(mockPendingContent);
  const [reflectionTopics, setReflectionTopics] =
    useState(mockReflectionTopics);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const handleDeleteTopic = (topicId: number) => {
    setReflectionTopics((prev) => prev.filter((topic) => topic.id !== topicId));
  };
  // Staff can create parent and student accounts only
  const allowedCreatableRoles: UserRole[] = ["parent", "student"];
  const availableTabs = [
    "students",
    "content-review",
    "reflection-topics",
    "account-management",
    "create-user",
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "create-user":
        return <CreateUserForm allowedRoles={allowedCreatableRoles} />;

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
        return (
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Reflection Topics</CardTitle>
                  <CardDescription>
                    Manage topics that students can reflect on
                  </CardDescription>
                </div>
                <Dialog open={newTopicDialog} onOpenChange={setNewTopicDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Topic
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Reflection Topic</DialogTitle>
                      <DialogDescription>
                        Add a new topic for students to reflect on
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="topic-title" className="mb-2">
                          Topic Title
                        </Label>
                        <Input
                          id="topic-title"
                          placeholder="Enter topic title"
                        />
                      </div>
                      <div>
                        <Label className="mb-2" htmlFor="topic-description">
                          Description
                        </Label>
                        <Textarea
                          id="topic-description"
                          placeholder="Provide guidance for students"
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setNewTopicDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => setNewTopicDialog(false)}>
                        Create Topic
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reflectionTopics.map((topic) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {topic.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit3 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTopic(topic.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "content-review":
        return (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>
                  Review and approve student submissions
                </CardDescription>
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
                            className="bg-green-600 hover:bg-green-700"
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
        return (
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>
                  View and edit student information and personal sections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage
                            src={student.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {student.firstName[0]}
                            {student.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {student.firstName} {student.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {student.grade} • Age {student.age}
                          </p>
                          {/* <p className="text-sm text-muted-foreground">Parent: {student.parent_id}</p> */}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">
                          {student.personalSections.length} Sections
                        </Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit Sections
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                Edit Personal Sections - {student.firstName}{" "}
                                {student.lastName}
                              </DialogTitle>
                              <DialogDescription>
                                Manage the student's personal sections and
                                content
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              {student.personalSections.map((section) => (
                                <div
                                  key={section.id}
                                  className="p-4 border rounded-lg space-y-2"
                                >
                                  <Label htmlFor={`topic-${section.id}`}>
                                    Topic
                                  </Label>
                                  <Input
                                    id={`topic-${section.id}`}
                                    defaultValue={section.topic}
                                  />
                                  <Label htmlFor={`desc-${section.id}`}>
                                    Description
                                  </Label>
                                  <Textarea
                                    id={`desc-${section.id}`}
                                    defaultValue={section.description}
                                    rows={3}
                                  />
                                </div>
                              ))}
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Cancel</Button>
                              <Button>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
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
