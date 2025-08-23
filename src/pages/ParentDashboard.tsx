import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  User,
  Calendar,
  MessageSquare,
  FileText,
  Camera,
  Heart,
} from "lucide-react";
import type { RootState } from "../store";
import { ROLEWISE_INFORMATION } from "@/constants";
import { getTabDisplayName } from "@/lib/utils";

interface DashboardCard {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  content: string[];
}

const ParentDashboard: React.FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [activeTab, setActiveTab] = useState<
    "overview" | "my-child" | "my-photos"
  >("overview");

  const parentInfo = ROLEWISE_INFORMATION.parent;
  const availableTabs = parentInfo.availableTabs;

  const dashboardCards: DashboardCard[] = [
    {
      title: "My Child's Progress",
      icon: <User className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />,
      bgColor: "bg-blue-50",
      iconColor: "bg-blue-600",
      content: [
        "View your child's academic progress",
        "See recent achievements and milestones",
      ],
    },
    {
      title: "School Calendar",
      icon: (
        <Calendar className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      ),
      bgColor: "bg-green-50",
      iconColor: "bg-green-600",
      content: [
        "Check upcoming school events",
        "View important dates and holidays",
      ],
    },
    {
      title: "Messages from School",
      icon: (
        <MessageSquare className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      ),
      bgColor: "bg-orange-50",
      iconColor: "bg-orange-600",
      content: [
        "Read messages from teachers",
        "Stay updated with school communications",
      ],
    },
    {
      title: "Reports & Assessments",
      icon: (
        <FileText className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      ),
      bgColor: "bg-purple-50",
      iconColor: "bg-purple-600",
      content: [
        "Access your child's reports",
        "View assessment results and feedback",
      ],
    },
    {
      title: "School Photos",
      icon: (
        <Camera className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      ),
      bgColor: "bg-pink-50",
      iconColor: "bg-pink-600",
      content: [
        "View your child's school photos",
        "Download and share special moments",
      ],
    },
    {
      title: "Child's Well-being",
      icon: (
        <Heart className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      ),
      bgColor: "bg-red-50",
      iconColor: "bg-red-600",
      content: [
        "Monitor your child's emotional well-being",
        "Access support resources",
      ],
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "my-child":
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              My Child's Information
            </h2>
            <p className="text-gray-600">
              Detailed information about your child will be displayed here.
            </p>
          </div>
        );
      case "my-photos":
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Photos & Memories
            </h2>
            <p className="text-gray-600">
              Your child's school photos and memories will be displayed here.
            </p>
          </div>
        );
      case "overview":
      default:
        return (
          <>
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {dashboardCards.map((card, index) => (
                <div
                  key={index}
                  className={`${card.bgColor} rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
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

            {/* Quick Actions Section
            <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <MessageSquare className="text-blue-600 w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700">
                    Contact Teacher
                  </span>
                </button>
                <button className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <Calendar className="text-green-600 w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700">
                    Book Meeting
                  </span>
                </button>
                <button className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <FileText className="text-purple-600 w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700">
                    View Reports
                  </span>
                </button>
                <button className="flex items-center gap-3 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors">
                  <Camera className="text-pink-600 w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700">
                    School Gallery
                  </span>
                </button>
              </div>
            </div> */}
          </>
        );
    }
  };

  return (
    <div className="w-full">
      {/* Welcome Section */}
      {isAuthenticated && user && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Heart className="text-green-600 w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {user.first_name}!
              </h1>
              <p className="text-sm text-gray-600">
                Parent Dashboard - Stay connected with your child's educational
                journey
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {availableTabs.map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setActiveTab(tab as "overview" | "my-child" | "my-photos")
            }
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {getTabDisplayName(tab)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default ParentDashboard;
