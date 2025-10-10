import React, { useEffect } from "react";
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
      dispatch(fetchMyChildren());
      dispatch(fetchYearGroups());
    }
  }, [isAuthenticated, user?.role, dispatch]);

  const renderChildCard = (child: ParentChild) => (
    <div
      key={child.id}
      onClick={() => navigate(`/child-details/${child.id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="flex items-center space-x-4">
        {child.profile_photo ? (
          <img
            src={child.profile_photo}
            alt={`${child.first_name} ${child.last_name}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 group-hover:border-blue-300 transition-colors"
          />
        ) : (
          <div className="relative">
            <div className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-full border-2 border-blue-100 group-hover:border-blue-300 transition-colors">
              <UserCircle className="w-12 h-12" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
            {child.first_name} {child.last_name}
          </h3>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center text-gray-600">
              <GraduationCap className="w-4 h-4 mr-1" />
              <span className="text-sm">
                {getYearGroupDisplayName(child.year_group_id, yearGroups)}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              <span className="text-sm">Class {child.class_id || "N/A"}</span>
            </div>
          </div>
          <div className="flex items-center text-gray-500 mt-1">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="text-xs">
              Joined {new Date(child.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="text-blue-500 group-hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-5 h-5 rotate-180" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full p-6">
      {/* Welcome Section */}
      {isAuthenticated && user && (
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 rounded-b-2xl relative overflow-hidden mb-6">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="text-white w-8 h-8" />
                <div>
                  <h1 className="text-3xl text-white font-bold">
                    Welcome, {user.first_name}!
                  </h1>
                  <p className="text-orange-100 mt-1">
                    Parent Dashboard - Stay connected with your child's
                    educational journey
                  </p>
                </div>
              </div>
              {children.length > 0 && (
                <div className="text-right">
                  <div className="text-orange-100 text-sm">
                    {children.length === 1 ? "Child" : "Children"} in:
                  </div>
                  <div className="text-white font-semibold">
                    {Array.from(
                      new Set(
                        children.map((child) =>
                          getYearGroupDisplayName(
                            child.year_group_id,
                            yearGroups
                          )
                        )
                      )
                    ).join(", ")}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/5 rounded-full"></div>
        </div>
      )}

      {/* Tab Content */}

      <div className="space-y-6">
        {/* Children Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">My Children</h2>
          </div>
          {isLoadingChildren ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
              <span className="text-gray-600">Loading children...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => dispatch(fetchMyChildren())}>
                Try Again
              </Button>
            </div>
          ) : children.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No Children Found
              </h3>
              <p className="text-sm text-gray-500">
                No children are currently associated with your account.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {children.map(renderChildCard)}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-200 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-green-800 font-semibold text-lg">
                  {
                    children.filter(
                      (child) => !child.status || child.status === "active"
                    ).length
                  }
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
                  {new Set(children.map((child) => child.year_group_id)).size}
                </p>
                <p className="text-purple-600 text-sm">Different Year Groups</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
