// User Role Type - 5 roles system
export type UserRole = 'admin' | 'staff_admin' | 'staff' | 'parent' | 'student';

/* 
 admin: Admin user with full access to the system
 staff_admin: Staff admin user with access to manage staff and parents
 staff: Staff(teacher) with access to manage students
 parent: Parent user with access to view their child's progress
 student: Student user with access to view their own progress
*/

// User Interface
export interface User {
  id: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  dob: string;
  username?: string; // For students
  created_at?: string;
  is_active?: boolean;
}

// Authentication Types
export interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordRequest {
  accessToken: string;
  refreshToken: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

// User Management Types
export interface CreateUserRequest {
  email?: string;
  username?: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  parent_ids?: number[]; // Optional array of parent IDs for student role
  year_group_id?: number; // Optional year group ID for student role
  class_id?: number; // Optional class ID for student role
}

export interface ResetUserPasswordRequest {
  email: string;
  newPassword: string;
}

// Paginated Users Types
export interface FetchUsersRequest {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  usersPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FetchUsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: PaginationInfo;
  };
}

// Component Types
export interface DashboardCard {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  content: string[];
  action?: () => void;
}

export interface NavItem {
  to: string;
  label: string;
  iconName: any;
  bgColor: string;
}

// Form Types
export interface CreateUserFormData {
  email?: string;
  username?: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  parent_ids?: number[]; // Optional array of parent IDs for student role
  year_group_id?: number; // Optional year group ID for student role
  class_id?: number; // Optional class ID for student role
}

export interface ResetPasswordFormData {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

// State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoadingForgotPassword: boolean;
  error: string | null;
}

export interface UserManagementState {
  users: User[];
  parents: User[];
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;
  createUserSuccess: boolean;
  resetPasswordSuccess: boolean;
  successMessage: string;
}

// Child-related Types
export interface Child {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  age: number;
  grade: string;
  class: string;
  avatar?: string;
  parent_id: string;
  created_at: string;
  is_active: boolean;
}
