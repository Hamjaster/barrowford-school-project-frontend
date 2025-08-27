import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  User,
  Calendar,
  MessageSquare,
  Camera,
  Heart,
  ArrowLeft,
  BookOpen,
  Users,
  CheckCircle,
  GraduationCap,
  Activity,
} from "lucide-react";
import type { RootState } from "../store";
import { ROLEWISE_INFORMATION, DEFAULT_AVATAR_URL } from "@/constants";
import { getTabDisplayName } from "@/lib/utils";
import type { Child } from "../types";
import { Button } from "@/components/ui/button";

const ParentDashboard: React.FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [activeTab, setActiveTab] = useState<
    "overview" | "my-child" | "my-photos"
  >("overview");
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  const parentInfo = ROLEWISE_INFORMATION.parent;
  const availableTabs = parentInfo.availableTabs;

  // Mock data for children (replace with API call later)
  const mockChildren: Child[] = [
    {
      id: "1",
      first_name: "Emma",
      last_name: "Johnson",
      username: "emma.johnson",
      age: 8,
      grade: "3rd Grade",
      class: "3A",
      avatar: `${DEFAULT_AVATAR_URL}?seed=emma`,
      parent_id: user?.id || "",
      created_at: "2024-01-15",
      is_active: true,
    },
    {
      id: "2",
      first_name: "Liam",
      last_name: "Johnson",
      username: "liam.johnson",
      age: 10,
      grade: "5th Grade",
      class: "5B",
      avatar: `${DEFAULT_AVATAR_URL}?seed=liam`,
      parent_id: user?.id || "",
      created_at: "2024-01-15",
      is_active: true,
    },
  ];

  const renderChildCard = (child: Child) => (
    <div
      key={child.id}
      onClick={() => setSelectedChild(child)}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src={child.avatar}
            alt={`${child.first_name} ${child.last_name}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 group-hover:border-blue-300 transition-colors"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
            {child.first_name} {child.last_name}
          </h3>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center text-gray-600">
              <GraduationCap className="w-4 h-4 mr-1" />
              <span className="text-sm">{child.grade}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-sm">Class {child.class}</span>
            </div>
          </div>
          <div className="flex items-center text-gray-500 mt-1">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="text-xs">Age {child.age}</span>
          </div>
        </div>
        <div className="text-blue-500 group-hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-5 h-5 rotate-180" />
        </div>
      </div>
    </div>
  );

  const renderChildDetails = (child: Child) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={child.avatar}
            alt={`${child.first_name} ${child.last_name}`}
            className="w-20 h-20 rounded-full object-cover border-3 border-blue-200"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {child.first_name} {child.last_name}
            </h2>
            <p className="text-gray-600">@{child.username}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center text-blue-600">
                <GraduationCap className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{child.grade}</span>
              </div>
              <div className="flex items-center text-green-600">
                <Users className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Class {child.class}</span>
              </div>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedChild(null)}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Children</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <User className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Basic Information</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Age:</span>
              <span className="font-medium">{child.age} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Grade:</span>
              <span className="font-medium">{child.grade}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Class:</span>
              <span className="font-medium">{child.class}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </span>
            </div>
          </div>
        </div>

        {/* School Information */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <BookOpen className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-800">School Details</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Username:</span>
              <span className="font-medium font-mono text-sm">
                {child.username}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Enrolled:</span>
              <span className="font-medium">
                {new Date(child.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Student ID:</span>
              <span className="font-medium font-mono text-sm">#{child.id}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-800">Quick Actions</h3>
          </div>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-left"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Teacher
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-left"
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start text-left"
            >
              <Camera className="w-4 h-4 mr-2" />
              View Photos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full p-6">
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

      {/* Tab Content */}
      {selectedChild ? (
        renderChildDetails(selectedChild)
      ) : (
        <div className="space-y-6">
          {/* Children Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                My Children
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("my-child")}
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockChildren.slice(0, 2).map(renderChildCard)}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-200 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-blue-800 font-semibold text-lg">
                    {mockChildren.length}
                  </p>
                  <p className="text-blue-600 text-sm">Children Enrolled</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-200 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-green-800 font-semibold text-lg">
                    {mockChildren.filter((child) => child.is_active).length}
                  </p>
                  <p className="text-green-600 text-sm">Active Students</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-200 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-purple-800 font-semibold text-lg">
                    {new Set(mockChildren.map((child) => child.grade)).size}
                  </p>
                  <p className="text-purple-600 text-sm">Different Grades</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
