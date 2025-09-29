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
