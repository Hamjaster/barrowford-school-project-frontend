import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  KeyRound,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { RootState, AppDispatch } from "@/store";
import {
  fetchUsers,
  resetUserPassword,
  clearError,
  clearSuccess,
} from "@/store/slices/userManagementSlice";
import type { FetchUsersRequest, User } from "@/types";
import { toast } from "sonner";

type SortColumn = "first_name" | "last_name" | "email" | "role" | "created_at";
type SortOrder = "asc" | "desc";

const UsersTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, pagination, isLoading, error, resetPasswordSuccess } =
    useSelector((state: RootState) => state.userManagement);
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortColumn, setSortColumn] = useState<SortColumn>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset password modal state
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // API call with debounced search term
  useEffect(() => {
    const params: FetchUsersRequest = {
      page: currentPage,
      limit: pagination?.usersPerPage || 10,
      search: debouncedSearchTerm,
      role: roleFilter,
      sortBy: sortColumn,
      sortOrder: sortOrder,
    };
    dispatch(fetchUsers(params));
    console.log("hit the API", debouncedSearchTerm);
  }, [
    currentPage,
    debouncedSearchTerm,
    roleFilter,
    sortColumn,
    sortOrder,
    dispatch,
  ]);

  // Handle reset password success
  useEffect(() => {
    if (resetPasswordSuccess) {
      toast.success("Password reset successfully!");
      setResetPasswordModal(false);
      setSelectedUser(null);
      setNewPassword("");
      setConfirmPassword("");
      dispatch(clearSuccess());
    }
  }, [resetPasswordSuccess, dispatch]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Reset role filter if current filter is not available for the current user
  useEffect(() => {
    const availableRoles = getAvailableRoles();
    const isCurrentFilterValid =
      roleFilter === "all" ||
      availableRoles.some((role) => role.value === roleFilter);

    if (!isCurrentFilterValid) {
      setRoleFilter("all");
    }
  }, [currentUser, roleFilter]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  }, []);

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const handleResetPassword = () => {
    if (!selectedUser || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    dispatch(
      resetUserPassword({
        email: selectedUser.email,
        newPassword: newPassword,
      })
    );
  };

  const openResetPasswordModal = (user: User) => {
    setSelectedUser(user);
    setResetPasswordModal(true);
    setNewPassword("");
    setConfirmPassword("");
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const capitalizeRole = (role: string) => {
    console.log(role, "ROLE");
    console.log(role.charAt(0).toUpperCase() + role.slice(1), "now ROLE");

    // staff_admin --> Staff Admin

    return (
      role.replace(/_/g, " ").charAt(0).toUpperCase() +
      role.replace(/_/g, " ").slice(1)
    );
  };

  // Get available roles based on current user's role
  const getAvailableRoles = () => {
    if (!currentUser) return [];

    const allRoles = [
      { value: "staff_admin", label: "Staff Admin" },
      { value: "staff", label: "Staff" },
      { value: "parent", label: "Parent" },
      { value: "student", label: "Student" },
    ];

    // Filter roles based on current user's role
    switch (currentUser.role) {
      case "admin":
        // Admin can see all roles
        return allRoles;
      case "staff_admin":
        // Staff Admin cannot see "Staff Admin" (their own role)
        return allRoles.filter((role) => role.value !== "staff_admin");
      case "staff":
        // Staff cannot see "Staff" or "Staff Admin"
        return allRoles.filter(
          (role) => role.value !== "staff" && role.value !== "staff_admin"
        );
      case "parent":
      case "student":
        // Parents and students typically don't have access to user management
        return [];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          {searchTerm !== debouncedSearchTerm && (
            <Loader2 className="absolute right-3 top-3 h-4 w-4 text-gray-400 animate-spin" />
          )}
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className={`pl-10 ${
              searchTerm !== debouncedSearchTerm ? "pr-10" : ""
            }`}
          />
        </div>
        <Select value={roleFilter} onValueChange={handleRoleFilter}>
          <SelectTrigger className="cursor-pointer w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem className="cursor-pointer" value="all">
              All Roles
            </SelectItem>
            {getAvailableRoles().map((role) => (
              <SelectItem
                key={role.value}
                className="cursor-pointer"
                value={role.value}
              >
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("first_name")}
                  className="cursor-pointer h-auto p-0 font-medium hover:bg-transparent"
                >
                  Name {getSortIcon("first_name")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("email")}
                  className="cursor-pointer h-auto p-0 font-medium hover:bg-transparent"
                >
                  Email {getSortIcon("email")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("role")}
                  className="cursor-pointer h-auto p-0 font-medium hover:bg-transparent"
                >
                  Role {getSortIcon("role")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("created_at")}
                  className="cursor-pointer h-auto p-0 font-medium hover:bg-transparent"
                >
                  Created {getSortIcon("created_at")}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : user.role === "staff"
                          ? "bg-blue-100 text-blue-800"
                          : user.role === "parent"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {capitalizeRole(user.role)}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(user.created_at || "")}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openResetPasswordModal(user)}
                      className="cursor-pointer ml-2"
                    >
                      <KeyRound className="h-4 w-4 mr-1" />
                      Reset Password
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalUsers > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(pagination.currentPage - 1) * pagination.usersPerPage + 1}{" "}
            to{" "}
            {Math.min(
              pagination.currentPage * pagination.usersPerPage,
              pagination.totalUsers
            )}{" "}
            of {pagination.totalUsers} users
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!pagination.hasPrevPage}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      <Dialog open={resetPasswordModal} onOpenChange={setResetPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedUser && (
              <div className="text-sm text-gray-600">
                Reset password for:{" "}
                <strong>
                  {selectedUser.first_name} {selectedUser.last_name}
                </strong>{" "}
                ({selectedUser.email})
              </div>
            )}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={
                  confirmPassword && newPassword !== confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  Passwords do not match
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  setResetPasswordModal(false);
                  setSelectedUser(null);
                  setNewPassword("");
                  setConfirmPassword("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleResetPassword}
                className="cursor-pointer"
                disabled={
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword ||
                  isLoading
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersTable;
