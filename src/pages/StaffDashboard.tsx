/**
 * TO RESTORE OLD PASSWORD MANAGEMENT:
 * 1. Uncomment the KeyRound import and ResetPasswordForm import
 * 2. Uncomment the "Password Management" card in dashboardCards array
 * 3. Uncomment the "reset-password" case in renderTabContent switch statement
 * 4. Add "reset-password", "forgot-password" back to availableTabs in constants.ts
 * 5. Update TypeScript types to include these tabs in activeTab state
 */

import React, { useState } from "react";
import {
  Users,
  BookOpen,
  GraduationCap,
  Clock,
  MessageSquare,
} from "lucide-react";
import CreateUserForm from "../components/forms/CreateUserForm";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import { mockChildren, mockReflectionTopics } from "@/constants";
import { getTabDisplayName } from "@/lib/utils";
import type { UserRole } from "@/types";
import UsersTable from "@/components/UsersTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReflectionTopicsManagement from "@/components/ReflectionTopicsManagement";
import StudentManagement from "@/components/StudentManagement";
import ContentModeration from "@/components/ContentModeration";

import { useSelector } from "react-redux";
import type { RootState } from "../store";
import PersonalSectionTopicsManagement from "@/components/PersonalSectionTopicsManagement";

const StaffDashboard: React.FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [activeTab, setActiveTab] = useState("students");

  const [reflectionTopics] = useState(mockReflectionTopics);

  const pendingCount = 0; // This will be updated when we integrate with real moderation data

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
        return <ContentModeration />;
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
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-b-2xl relative overflow-hidden mb-6">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <GraduationCap className="text-white w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome, {user.first_name}!
                </h1>
                <p className="text-blue-100 mt-1">
                  Staff Dashboard - Manage your students and curriculum
                </p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full"></div>
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
