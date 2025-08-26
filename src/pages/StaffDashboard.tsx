/**
 * TO RESTORE OLD PASSWORD MANAGEMENT:
 * 1. Uncomment the KeyRound import and ResetPasswordForm import
 * 2. Uncomment the "Password Management" card in dashboardCards array
 * 3. Uncomment the "reset-password" case in renderTabContent switch statement
 * 4. Add "reset-password", "forgot-password" back to availableTabs in constants.ts
 * 5. Update TypeScript types to include these tabs in activeTab state
 */

import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Users,
  UserPlus,
  BookOpen,
  Calendar,
  GraduationCap,
} from "lucide-react";
// import { KeyRound } from "lucide-react";
import type { RootState } from "../store";
import CreateUserForm from "../components/forms/CreateUserForm";
// import ResetPasswordForm from "../components/forms/ResetPasswordForm";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import { ROLEWISE_INFORMATION } from "@/constants";
import { getTabDisplayName } from "@/lib/utils";
import type { UserRole } from "@/types";
import UsersTable from "@/components/UsersTable";

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
    "overview" | "create-user" // | "reset-password" | "forgot-password"
  >("overview");

  // Staff can create parent and student accounts only
  const allowedCreatableRoles: UserRole[] = ["parent", "student"];
  const staffInfo = ROLEWISE_INFORMATION.staff;
  const availableTabs = staffInfo.availableTabs;

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

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {availableTabs.map((tab) => (
          <button
            key={tab}
            onClick={() =>
              setActiveTab(
                tab as
                  | "overview"
                  | "create-user" /* | "reset-password" | "forgot-password" */
              )
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

export default StaffDashboard;
