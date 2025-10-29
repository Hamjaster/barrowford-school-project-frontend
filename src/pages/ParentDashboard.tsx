"use client";

import type React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Calendar,
  Heart,
  ArrowLeft,
  Users,
  CheckCircle,
  GraduationCap,
  Loader2,
  UserCircle,
} from "lucide-react";
import type { RootState, AppDispatch } from "../store";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { fetchMyChildren } from "../store/slices/parentSlice";
import type { ParentChild } from "../store/slices/parentSlice";
import { fetchYearGroups } from "../store/slices/userManagementSlice";
import { getYearGroupDisplayName } from "@/utils/yearGroupUtils";

const cardColors = [
  {
    bg: "bg-pink-50",
    border: "border-pink-200",
    icon: "bg-pink-500",
    accent: "text-pink-600",
  },
  {
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: "bg-blue-500",
    accent: "text-blue-600",
  },
  {
    bg: "bg-orange-50",
    border: "border-orange-200",
    icon: "bg-orange-500",
    accent: "text-orange-600",
  },
  {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "bg-green-500",
    accent: "text-green-600",
  },
  {
    bg: "bg-purple-50",
    border: "border-purple-200",
    icon: "bg-purple-500",
    accent: "text-purple-600",
  },
  {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    icon: "bg-cyan-500",
    accent: "text-cyan-600",
  },
];

const ParentDashboard: React.FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const { children, isLoadingChildren, error } = useSelector(
    (state: RootState) => state.parent
  );
  const { yearGroups } = useSelector(
    (state: RootState) => state.userManagement
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === "parent") {
      dispatch(fetchMyChildren as unknown as any);
      dispatch(fetchYearGroups as unknown as any);
    }
  }, [isAuthenticated, user?.role, dispatch]);

  const getChildColor = (index: number) => {
    return cardColors[index % cardColors.length];
  };

  const renderChildCard = (child: ParentChild, index: number) => {
    const colors = getChildColor(index);

    return (
      <div
        key={child.id}
        onClick={() => navigate(`/child-details/${child.id}`)}
        className={`${colors.bg} rounded-2xl border-2 ${colors.border} p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            {child.profile_photo ? (
              <img
                src={child.profile_photo || "/placeholder.svg"}
                alt={`${child.first_name} ${child.last_name}`}
                className={`w-16 h-16 rounded-full object-cover border-3 ${colors.border} group-hover:shadow-md transition-all`}
              />
            ) : (
              <div
                className={`w-16 h-16 flex items-center justify-center ${colors.icon} rounded-full border-3 ${colors.border} transition-all`}
              >
                <UserCircle className="w-10 h-10 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h3
                className={`text-lg font-bold ${colors.accent} group-hover:opacity-80 transition-opacity`}
              >
                {child.first_name} {child.last_name}
              </h3>
              <div className="flex items-center space-x-2 mt-2">
                <GraduationCap className={`w-4 h-4 ${colors.accent}`} />
                <span className={`text-sm font-medium ${colors.accent}`}>
                  {getYearGroupDisplayName(
                    child.current_year_group_id,
                    yearGroups
                  )}
                </span>
              </div>
            </div>
          </div>
          <div
            className={`${colors.icon} rounded-full p-2 group-hover:scale-110 transition-transform`}
          >
            <ArrowLeft className="w-5 h-5 text-white rotate-180" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4  border-current border-opacity-10">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">
              Class {child.class_id || "N/A"}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium">
              {new Date(child.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Welcome Section */}
      {isAuthenticated && user && (
        <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-pink-600 text-white p-8 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <Heart className="text-white w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">
                    Welcome, {user.first_name}!
                  </h1>
                  <p className="text-orange-100 mt-2 text-lg">
                    Parent Portal - Monitor your child's progress
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-16 -translate-x-16"></div>
        </div>
      )}

      <div className="p-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-green-500 rounded-full p-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-green-700 font-bold text-3xl">
                  {
                    children.filter(
                      (child) => !child.status || child.status === "active"
                    ).length
                  }
                </p>
                <p className="text-green-600 font-semibold">Active Students</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border-2 border-purple-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-500 rounded-full p-4">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-purple-700 font-bold text-3xl">
                  {
                    new Set(
                      children.map((child) => child.current_year_group_id)
                    ).size
                  }
                </p>
                <p className="text-purple-600 font-semibold">Year Groups</p>
              </div>
            </div>
          </div>
        </div>

        {/* Children Overview */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">My Children</h2>
            </div>
            {children.length > 0 && (
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                {children.length} {children.length === 1 ? "Child" : "Children"}
              </span>
            )}
          </div>

          {isLoadingChildren ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border-2 border-gray-200">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-3" />
              <span className="text-gray-600 font-medium">
                Loading children...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-red-200">
              <p className="text-red-600 mb-4 font-semibold">{error}</p>
              <Button
                onClick={() => dispatch(fetchMyChildren as unknown as any)}
              >
                Try Again
              </Button>
            </div>
          ) : children.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-gray-200">
              <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                No Children Found
              </h3>
              <p className="text-gray-500 font-medium">
                No children are currently associated with your account.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map((child, index) => renderChildCard(child, index))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
