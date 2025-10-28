/**
 * TO RESTORE OLD PASSWORD MANAGEMENT:
 * 1. Uncomment the KeyRound import and ResetPasswordForm import
 * 2. Uncomment the "Password Management" card in dashboardCards array
 * 3. Uncomment the "reset-password" case in renderTabContent switch statement
 * 4. Add "reset-password" back to availableTabs in constants.ts
 * 5. Update TypeScript types to include "reset-password" in activeTab state
 */

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Shield } from "lucide-react";
// Commented out for new password management flow - may need in future
// import { KeyRound } from "lucide-react";
import type { RootState } from "../store";
import CreateUserForm from "../components/forms/CreateUserForm";
// Commented out for new password management flow - may need in future
// import ResetPasswordForm from "../components/forms/ResetPasswordForm";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import UsersTable from "../components/UsersTable";
import type { UserRole } from "@/types";
import { ROLEWISE_INFORMATION } from "@/constants";
import { getTabDisplayName } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [activeTab, setActiveTab] = useState<
    "overview" | "create-user" // | "reset-password"
  >("overview");

  // Admin can create all user types including staff_admin
  const allowedCreatableRoles: UserRole[] = [
    "staff_admin",
    "staff",
    "parent",
    "student",
  ];
  const adminInfo = ROLEWISE_INFORMATION.admin;
  const availableTabs = adminInfo.availableTabs;

  const renderTabContent = () => {
    switch (activeTab) {
      case "create-user":
        return <CreateUserForm allowedRoles={allowedCreatableRoles} />;
      // Commented out for new password management flow - may need in future
      // case "reset-password":
      //   return (
      //     <div className="space-y-6">
      //       <ResetPasswordForm />
      //       <div className="border-t pt-6">
      //         <h3 className="text-lg font-semibold text-gray-800 mb-4">
      //           Reset Your Own Password
      //         </h3>
      //         <ForgotPasswordForm />
      //       </div>
      //     </div>
      //   );
      case "overview":
      default:
        return (
          <div className="space-y-6">
            {/* Users Management Section */}
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

            {/* Reset Your Own Password Section */}
            <ForgotPasswordForm />
          </div>
        );
    }
  };

  return (
    <div className="w-full p-6">
      {/* Welcome Section */}
      {isAuthenticated && user && (
        <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-b-2xl relative overflow-hidden mb-6">
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <Shield className="text-white w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Welcome, {user.first_name}!
                </h1>
                <p className="text-red-100 mt-1">
                  System Administrator Dashboard - You have full system access
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

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {availableTabs?.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "secondary" : "ghost"}
            size="sm"
            onClick={
              () =>
                setActiveTab(
                  tab as "overview" | "create-user" /* | "reset-password" */
                ) // Commented out for new password management flow
            }
            className={`text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
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

export default AdminDashboard;
