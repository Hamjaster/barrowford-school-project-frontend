import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Users,
  UserPlus,
  KeyRound,
  BookOpen,
  Calendar,
  GraduationCap,
} from "lucide-react";
import type { RootState } from "../store";
import CreateUserForm from "../components/forms/CreateUserForm";
import ResetPasswordForm from "../components/forms/ResetPasswordForm";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";

interface DashboardCard {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  content: string[];
  action?: () => void;
}

const StaffDashboard: React.FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [activeTab, setActiveTab] = useState<
    "overview" | "create-user" | "reset-password" | "forgot-password"
  >("overview");

  // Staff can create parent and student accounts only
  const allowedRoles = ["parent", "student"];

  const dashboardCards: DashboardCard[] = [
    {
      title: "My Students",
      icon: (
        <Users className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      ),
      bgColor: "bg-blue-50",
      iconColor: "bg-blue-600",
      content: ["View and manage your students", "Track student progress"],
    },
    {
      title: "Create New Users",
      icon: (
        <UserPlus className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      ),
      bgColor: "bg-green-50",
      iconColor: "bg-green-600",
      content: ["Add new parents and students", "Set up initial credentials"],
      action: () => setActiveTab("create-user"),
    },
    {
      title: "Password Management",
      icon: (
        <KeyRound className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      ),
      bgColor: "bg-orange-50",
      iconColor: "bg-orange-600",
      content: [
        "Reset parent and student passwords",
        "Reset your own password",
      ],
      action: () => setActiveTab("reset-password"),
    },
    {
      title: "Curriculum Management",
      icon: (
        <BookOpen className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      ),
      bgColor: "bg-purple-50",
      iconColor: "bg-purple-600",
      content: ["Manage curriculum content", "Upload learning materials"],
    },
    {
      title: "Class Schedule",
      icon: (
        <Calendar className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      ),
      bgColor: "bg-pink-50",
      iconColor: "bg-pink-600",
      content: ["View your teaching schedule", "Manage class timetables"],
    },
    {
      title: "Academic Management",
      icon: (
        <GraduationCap className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      ),
      bgColor: "bg-indigo-50",
      iconColor: "bg-indigo-600",
      content: ["Manage academic years", "Assign subjects and classes"],
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "create-user":
        return <CreateUserForm allowedRoles={allowedRoles} />;
      case "reset-password":
        return (
          <div className="space-y-6">
            <ResetPasswordForm />
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Reset Your Own Password
              </h3>
              <ForgotPasswordForm />
            </div>
          </div>
        );
      case "overview":
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {dashboardCards.map((card, index) => (
              <div
                key={index}
                className={`${
                  card.bgColor
                } rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm ${
                  card.action
                    ? "cursor-pointer hover:shadow-md transition-shadow"
                    : ""
                }`}
                onClick={card.action}
              >
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 ${card.iconColor} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    {card.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 leading-tight">
                    {card.title}
                  </h3>
                </div>
                <div className="space-y-2">
                  {card.content.map((text, textIndex) => (
                    <p
                      key={textIndex}
                      className="text-gray-700 text-sm sm:text-base leading-relaxed"
                    >
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="w-full">
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

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "overview"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("create-user")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "create-user"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Create User
        </button>
        <button
          onClick={() => setActiveTab("reset-password")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "reset-password"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Password Management
        </button>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default StaffDashboard;
