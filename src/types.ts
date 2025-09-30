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
  status?: 'active' | 'inactive';
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
  session: any;
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

// Define Topic type
export interface Topic {
  id: number; // assuming backend returns id
  title: string;
  description?: string;
  created_at : string;
  status: string;
}

// Define PersonalSection type
export interface PersonalSection {
  id: number;
  topic_id: number;
  student_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Define state type for personal sections
export interface PersonalSectionState {
  topics: Topic[];
  loading: boolean;
  error: string | null;
}
// define reflection topic type 
export interface ReflectionTopic {
  id : number;
  title : string;
  created_by : string;
  is_active : boolean;
  created_at : string;
}

export interface ReflectionState {
  topics: ReflectionTopic[];    // full objects
  activeTitles: { id: string; title: string }[];     // just titles
  comments : ReflectionComment[];
  reflections: ReflectionItem[]  ;
  loading: boolean;
  fetchreflectionsloading : boolean;
  postingCommentLoading : boolean;
  error: string | null;
  message: string | null;
  previousWeeks: { currentWeek: string; previousWeeks: string[]; totalPreviousWeeks: number } | null;
}


// New one (only for active topics API)
export interface ReflectionTopicTitle {
  title: string;
  id : number
}

export interface RelectionRequest {
    topicID: number ,
    content: string,
    file: File,
}
// Define the type for a reflection item
export interface ReflectionItem {
  id: number;
  content: string;
  attachment_url?: string;
  student_id: number;
  created_at: string;
  topic_id: number;
  status: 'pending' | 'approved' | 'rejected' | 'pending_deletion';
  week?: string;
  reflectiontopics: {
    title: string;
  };
  reflectioncomments: ReflectionComment[];
}

export interface TableEntry {
  id: number;
  date: string;
  topic: string;   // ✅ instead of title
  status: string;
  content: string;
  attachment_url: string;
  topic_id: number;
  week?: string;   // optional if sometimes missing
}

export type CulturalCapitalEntry = Required<TableEntry>; 


export interface UpdateReflectionPayload {
  id: number;
  content: string;
  status: string;
}
export interface UpdateReflectionResponse {
  success: boolean;
  updatedReflection: ReflectionItem;
}

//for add comments
export interface AddCommentRequest {
  reflectionId: number;
  content: string;
}

// fetch comments
export interface ReflectionComment {
  id: number;
  reflection_id: number;
  user_role: string;
  comment: string;
  created_at: string;
}




// Year Data Types
export interface YearGroup {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Subject {
  id: number;
  name: string;
  status: string;
  created_at: string;
}

export interface YearGroupWithSubjects extends YearGroup {
  subjects: Subject[];
}

export interface YearDataState {
  yearGroups: YearGroup[];
  yearGroupsWithSubjects: YearGroupWithSubjects[];
  isLoading: boolean;
  isLoadingSubjects: boolean;
  error: string | null;
}

// Student Learning Types
export interface StudentLearning {
  id: number;
  subject_id: number;
  title: string;
  description: string;
  attachment_url?: string;
  created_at: string;
}

export interface CreateLearningRequest {
  subject_id: number;
  title: string;
  content?: string;
  attachment_url?: string;
}

// Student Image Interface
export interface StudentImage {
  id: string;
  image_url: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'pending_deletion';
}

// Student Impact and Experience Types
export interface StudentImpact {
  id: number;
  content: string;
  created_at: string;
}

export interface StudentExperience {
  id: number;
  content: string;
  created_at: string;
}

export interface UpdateImpactRequest {
  content: string;
}

export interface UpdateExperienceRequest {
  content: string;
}

export interface StudentState {
  selectedSubject: Subject | null;
  selectedYearGroup: YearGroup | null;
  learnings: StudentLearning[];
  images: StudentImage[];
  impact: StudentImpact | null;
  experience: StudentExperience | null;
  isLoading: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  error: string | null;
  message: string | null;
}