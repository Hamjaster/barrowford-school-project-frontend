import type { UserRole, NavItem } from './types';
// Icons are imported in utils.ts where they're used

// API Configuration
export const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'}`;


// Validation Constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
} as const;

// Role-wise Information
// 
// CHANGES MADE FOR NEW PASSWORD MANAGEMENT FLOW:
// - Removed 'reset-password' and 'forgot-password' tabs from admin and staff availableTabs
// - These tabs have been commented out (not deleted) for potential future restoration
// - Password management is now integrated into the main dashboard views
//
// TO RESTORE OLD TABS: Uncomment the tabs in the availableTabs arrays below
export const ROLEWISE_INFORMATION: Record<UserRole, {
  displayName: string;
  dashboardTitle: string;
  dashboardSubtitle: string;
  dashboardDescription: string;
  sidebarTitle: string;
  sidebarSubtitle: string;
  sidebarDescription: string;
  allowedRoles: UserRole[];
  navItems: NavItem[];
  availableTabs: string[];
}> = {
  admin: {
    displayName: 'Admin',
    dashboardTitle: 'Admin Dashboard',
    dashboardSubtitle: 'System Administration',
    dashboardDescription: 'Manage all system users and settings',
    sidebarTitle: 'Admin Panel',
    sidebarSubtitle: 'System Administration',
    sidebarDescription: 'Full System Access',
    allowedRoles: ['staff', 'parent', 'student'],
    navItems: [
      {
        to: '/',
        label: 'Dashboard',
        bgColor: 'bg-blue-500',
        iconName: 'Home',
      },

    ],
    
    availableTabs: ['overview', 'create-user'], // 'reset-password' commented out for new password management flow
    
  },
  staff: {
    displayName: 'Staff/Teacher',
    dashboardTitle: 'Staff Dashboard',
    dashboardSubtitle: 'Teaching & Management',
    dashboardDescription: 'Manage your students and curriculum',
    sidebarTitle: 'Staff Portal',
    sidebarSubtitle: 'Teaching & Management',
    sidebarDescription: 'Educate & Inspire',
    allowedRoles: ['parent', 'student'],
    navItems: [
      {
        to: '/',
        label: 'Dashboard',
        bgColor: 'bg-blue-500',
        iconName: 'Home',
      },
      {
        to: '/my-students',
        label: 'My Students',
        bgColor: 'bg-green-500',
        iconName: 'Users',
      },
      {
        to: '/create-user',
        label: 'Create User',
        bgColor: 'bg-purple-500',
        iconName: 'UserPlus',
      },
      {
        to: '/reset-passwords',
        label: 'Reset Passwords',
        bgColor: 'bg-orange-500',
        iconName: 'KeyRound',
      },
      {
        to: '/curriculum',
        label: 'Curriculum',
        bgColor: 'bg-indigo-500',
        iconName: 'BookOpen',
      },
      {
        to: '/schedule',
        label: 'Schedule',
        bgColor: 'bg-pink-500',
        iconName: 'Calendar',
      },
    ],
    
    availableTabs: ['overview', 'create-user'], // 'reset-password', 'forgot-password' commented out for new password management flow

  },
  parent: {
    displayName: 'Parent',
    dashboardTitle: 'Parent Dashboard',
    dashboardSubtitle: 'Your Child\'s Journey',
    dashboardDescription: 'Track your child\'s progress and activities',
    sidebarTitle: 'Parent Portal',
    sidebarSubtitle: 'Your Child\'s Journey',
    sidebarDescription: 'Supporting Growth',
    allowedRoles: [],
    navItems: [
      {
        to: '/',
        label: 'Dashboard',
        bgColor: 'bg-blue-500',
        iconName: 'Home',
      },
      // {
      //   to: '/my-child',
      //   label: 'My Child',
      //   bgColor: 'bg-green-500',
      //   iconName: 'Baby',
      // },
      // {
      //   to: '/my-photos',
      //   label: 'Photos & Memories',
      //   bgColor: 'bg-purple-500',
      //   iconName: 'Camera',
      // },
    ],
    
    availableTabs: ['overview', 'my-child', 'my-photos'],
    
  },
  student: {
    displayName: 'Student',
    dashboardTitle: 'Student Dashboard',
    dashboardSubtitle: 'Your Learning Journey',
    dashboardDescription: 'Explore, learn, and grow every day',
    sidebarTitle: 'Student Portal',
    sidebarSubtitle: 'Your Learning Journey',
    sidebarDescription: 'Dream, Learn, Achieve',
    allowedRoles: [],
    navItems: [
      {
        to: '/',
        label: 'Dashboard',
        bgColor: 'bg-blue-500',
        iconName: 'Home',
      },
      {
        to: '/my-learning',
        label: 'My Learning',
        bgColor: 'bg-green-500',
        iconName: 'BookOpen',
      },
      {
        to: '/my-experiences',
        label: 'My Experiences',
        bgColor: 'bg-purple-500',
        iconName: 'Award',
      },
      {
        to: '/my-impact',
        label: 'My Impact',
        bgColor: 'bg-red-500',
        iconName: 'BookOpen',
      },
      {
        to: '/what-i-read',
        label: 'What I Read',
        bgColor: 'bg-orange-500',
        iconName: 'FileText',
      },
    ],

    availableTabs: ['overview', 'my-learning', 'my-experiences', 'what-i-read'],
 
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters long`,
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'An account with this email already exists',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully!',
  PASSWORD_RESET: 'Password reset successfully!',
  EMAIL_SENT: 'Reset email sent successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
} as const;

// Tab Display Names
export const TAB_DISPLAY_NAMES: Record<string, string> = {
  'overview': 'Overview',
  'create-user': 'Create User',
  'reset-password': 'Password Management',
  'forgot-password': 'Forgot Password',
  'my-child': 'My Child',
  'my-photos': 'Photos & Memories',
  'my-learning': 'My Learning',
  'my-experiences': 'My Experiences',
  'what-i-read': 'What I Read',
} as const;

// Default Avatar URL
export const DEFAULT_AVATAR_URL = 'https://i.pravatar.cc/1000';
