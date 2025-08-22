// User Role Type - 4 roles only
export type UserRole = 'admin' | 'staff' | 'parent' | 'student';

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
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

export interface ResetUserPasswordRequest {
  email: string;
  newPassword: string;
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
  iconName: string;
  bgColor: string;
}

// Form Types
export interface CreateUserFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
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
  error: string | null;
}

export interface UserManagementState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  createUserSuccess: boolean;
  resetPasswordSuccess: boolean;
  successMessage: string;
}
