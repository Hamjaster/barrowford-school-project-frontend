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
import { UserPlus, Shield, BarChart3, Settings } from "lucide-react";
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

interface DashboardCard {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  content: string[];
  action?: () => void;
}

const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [activeTab, setActiveTab] = useState<
    "overview" | "create-user" // | "reset-password"
  >("overview");

  // Admin can create all user types
  const allowedCreatableRoles: UserRole[] = ["staff", "parent", "student"];
  const adminInfo = ROLEWISE_INFORMATION.admin;
  const availableTabs = adminInfo.availableTabs;

  const dashboardCards: DashboardCard[] = [
    {
      title: "Create New Users",
      icon: (
        <UserPlus className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      ),
      bgColor: "bg-green-50",
      iconColor: "bg-green-600",
      content: [
        "Add new staff, parents, and students",
        "Set up initial credentials",
      ],
      action: () => setActiveTab("create-user"),
    },
    // Commented out for new password management flow - may need in future
    // {
    //   title: "Password Management",
    //   icon: (
    //     <KeyRound className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
    //   ),
    //   bgColor: "bg-orange-50",
    //   iconColor: "bg-orange-600",
    //   content: ["Reset user passwords", "Manage security credentials"],
    //   action: () => setActiveTab("reset-password"),
    // },
    {
      title: "System Security",
      icon: (
        <Shield className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      ),
      bgColor: "bg-red-50",
      iconColor: "bg-red-600",
      content: ["Monitor system security", "Configure access controls"],
    },
    {
      title: "Analytics & Reports",
      icon: (
        <BarChart3 className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      ),
      bgColor: "bg-purple-50",
      iconColor: "bg-purple-600",
      content: [
        "View system usage statistics",
        "Generate administrative reports",
      ],
    },
    {
      title: "System Settings",
      icon: (
        <Settings className="text-white w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      ),
      bgColor: "bg-gray-50",
      iconColor: "bg-gray-600",
      content: ["Configure system parameters", "Manage school information"],
    },
  ];

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
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <Shield className="text-red-600 w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {user.first_name}!
              </h1>
              <p className="text-sm text-gray-600">
                System Administrator Dashboard - You have full system access
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
            onClick={
              () =>
                setActiveTab(
                  tab as "overview" | "create-user" /* | "reset-password" */
                ) // Commented out for new password management flow
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

export default AdminDashboard;
