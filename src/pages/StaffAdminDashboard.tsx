/**
 * Staff Admin Dashboard - Similar to Admin Dashboard but with restricted permissions
 *
 * Staff Admin can:
 * - Create staff, parent, and student accounts
 * - Reset passwords for staff, parent, and student accounts
 * - Manage users (but not other staff_admins or admins)
 */

import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import CreateUserForm from "../components/forms/CreateUserForm";
import UsersTable from "../components/UsersTable";
import type { UserRole } from "@/types";
import { ROLEWISE_INFORMATION } from "@/constants";
import { getTabDisplayName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";

const StaffAdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [activeTab, setActiveTab] = useState<"overview" | "create-user">(
    "overview"
  );

  // Staff Admin can create staff, parent, and student accounts (not other staff_admins or admins)
  const allowedCreatableRoles: UserRole[] = ["staff", "parent", "student"];
  const staffAdminInfo = ROLEWISE_INFORMATION.staff_admin;
  const availableTabs = staffAdminInfo.availableTabs;

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome back, {user?.first_name}!
              </h2>
              <p className="text-gray-600">
                {staffAdminInfo.dashboardDescription}
              </p>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  User Management
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and monitor user accounts
                </p>
              </div>
              <UsersTable />
            </div>
            <ForgotPasswordForm />
          </div>
        );

      case "create-user":
        return <CreateUserForm allowedRoles={allowedCreatableRoles} />;

      default:
        return <div>Tab not found</div>;
    }
  };

  if (!isAuthenticated || !user) {
    return <div>Please log in to access the staff admin dashboard.</div>;
  }

  if (user.role !== "staff_admin") {
    return <div>Access denied. Staff Admin privileges required.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {staffAdminInfo.dashboardTitle}
          </h1>
          <p className="text-gray-600 mt-2">
            {staffAdminInfo.dashboardSubtitle}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-2">
            {availableTabs.map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`border-b-2 p-3 font-medium text-sm cursor-pointer ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent"
                }`}
              >
                {getTabDisplayName(tab)}
              </div>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default StaffAdminDashboard;
