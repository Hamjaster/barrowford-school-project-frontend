import type { UserRole, NavItem, Child } from './types';
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
  sidebarTitle?: string;
  sidebarSubtitle?: string;
  sidebarDescription?: string;
  allowedRoles?: UserRole[];
  navItems?: NavItem[];
  availableTabs?: string[];
}> = {
  admin: {
    displayName: 'Admin',
    dashboardTitle: 'Admin Dashboard',
    dashboardSubtitle: 'System Administration',
    dashboardDescription: 'Manage all system users and settings',
    sidebarTitle: 'Admin Panel',
    sidebarSubtitle: 'System Administration',
    sidebarDescription: 'Full System Access',
    allowedRoles: ['staff_admin', 'staff', 'parent', 'student'],
    navItems: [
      {
        to: '/',
        label: 'Dashboard',
        bgColor: 'bg-blue-500',
        iconName: 'Home',
      },
      {
        to: '/bulk-upload',
        label: 'Bulk Upload',
        bgColor: 'bg-purple-500',
        iconName: 'Upload',
      },
    ],
    
    availableTabs: ['overview', 'create-user'], // Removed bulk-upload tab - now has dedicated page
    
  },
  staff_admin: {
    displayName: 'Staff Admin',
    dashboardTitle: 'Staff Admin Dashboard',
    dashboardSubtitle: 'Administrative Management',
    dashboardDescription: 'Manage staff, parents, and students',
    sidebarTitle: 'Staff Admin Panel',
    sidebarSubtitle: 'Administrative Management',
    sidebarDescription: 'Staff & User Management',
    allowedRoles: ['staff', 'parent', 'student'],
    navItems: [
      {
        to: '/',
        label: 'Dashboard',
        bgColor: 'bg-blue-500',
        iconName: 'Home',
      },
      {
        to: '/bulk-upload',
        label: 'Bulk Upload',
        bgColor: 'bg-purple-500',
        iconName: 'Upload',
      },
    ],
    
    availableTabs: ['overview', 'create-user'], // Removed bulk-upload tab - now has dedicated page
    
  },
  staff: {
    displayName: 'Staff/Teacher',
    dashboardTitle: 'Staff Dashboard',
    dashboardSubtitle: 'Teaching & Management',
    dashboardDescription: 'Manage your students',
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
     
    ],
    availableTabs: ['overview', 'create-user', 'personal-section-topics'],
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
  'bulk-upload': 'Bulk Upload',
} as const;

// Default Avatar URL
export const DEFAULT_AVATAR_URL = 'https://i.pravatar.cc/1000';

export const mockChildren: Child[] = [
  {
    id: "1",
    first_name: "Emma",
    last_name: "Johnson",
    username: "emma.johnson",
    age: 8,
    grade: "Year 1",
    class: "3A",
    avatar: `${DEFAULT_AVATAR_URL}?seed=emma`,
    parent_id: "1",
    created_at: "2024-01-15",
    is_active: true,
  },
  {
    id: "2",
    first_name: "Liam",
    last_name: "Johnson",
    username: "liam.johnson",
    age: 10,
    grade: "Year 3",
    class: "5B",
    avatar: `${DEFAULT_AVATAR_URL}?seed=liam`,
    parent_id: "2",
    created_at: "2024-01-15",
    is_active: true,
  },
];


export const mockPendingContent = [
  {
    id: 1,
    studentName: "Emma Johnson",
    type: "reflection",
    topic: "My Summer Vacation",
    content:
      "This summer I went to the beach with my family. We built sandcastles and collected seashells. I learned how to swim better and saw dolphins!",
    submittedAt: "2024-01-15T10:30:00Z",
    status: "pending",
    isEdit: false,
  },
  {
    id: 2,
    studentName: "Liam Smith",
    type: "image",
    content: "Art project - painted landscape",
    imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQA7wMBEQACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAAAgMEBQYBB//EADwQAAIBAwMCBAMGBAUEAwEAAAECAwAEEQUSITFBBhNRYSIygRQjcZGhsUJSwfAVJDNi0ZKi4fFDcsIW/8QAGwEBAAIDAQEAAAAAAAAAAAAAAAMEAQIFBgf/xAA5EQACAgECAwYFAgQFBQEAAAAAAQIDEQQhEjFBBRMiUWFxgZGxwfAUoSMy0eEGM0KC8RVDUmKiJP/aAAwDAQACEQMRAD8A9xoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoAoDhNYyBKOH+U55xUVN0LlxQ5f02MtYF1MYCgCgCgCgCgCgCgCgCgCgCgCgCgCgCgCgCgCgCgCgCgCgCgCgOZoBKSK/ynPOKirurtzwPOHh+66GWsC6lMDFw7KgCAb24Gapa62ddX8NZlLZe76/DmbwSb3Fwp5aKg6KMZqXS09xTGvySRq3ljlWDAUAUAUAUAUAUAUAUAUAUAUAUAUAUAUAUAUAUAUAUAUAUAUAUBwjNYAwnwTyKMfF8VUqUq9RZBdcS+z+3zN3vFD27A5q7k0GfnnBxwg/WqWHZqc9Ir93/RfU35RHx+FXTQCcVkBmsZB0VkBQBQBQBQBQBQBQBQBQBQBQBQBQBQBQBQBQBQBQBQBQBQHGOOe1aykorLMpEGScySDyEJZT1xxXn7u0nfYv0kXKS3zyjh7b53x+ciZQ4V4upEkklkkPmOFwcYzgVwr9Tq775QusSx0y0vmidRhFZSE5khdTvGe+xs5qGVl2jtj48efDLOfg2EozT2LK2nLr8alSPUdfevZ6DWyvh/EWJLz2yvPHTP7FWcMMRNenOyBfMb26Cqes7XfEqtIuOT+SN4VdZbBCLoyZlK7fQVvo49pyuU72lHyMTdaXhJgrtIhO1kBQBQBQBQBQBQBQBQBQBQHD0oDgPPWgFUAUAUAUAUAUAUAl+nHHvWsuQGM3C5xtce/Bqh/+6pP+Wf8A8v7r6G/gfoNTzXGwjyOTxwc1R1mt1vdOCo3lst8kkIQznJCErxQmJV25+Yk5JrzL1l9GnenhDhzzfV42+GOXwLHApSyxlSAMNyPSqEbIJ8M8te+PsyRryFfdbcDzN30xUj/RuG3Epf7WvszHi64HraIsA7SfCcZAbtXV0GjnbFWW2eFtJpPfD+JFOaTwluWkMKRDCKBXsdNo6NNHhqjgqOcpcxzAqzg1O1kBQBQBQBQBQBQBQBQBQBQBQDV1s+zyeYcJt5OccVrLHC8m0c525nmUGv3tvdIsd9M1rC52Kx+Ydt3c1wFq7Iz/AJng9dLs+mcMuCUn+bG88P6xDq1r5ikCVeHT0P8AxXa0+ojdHKPNazSS01nC+XQtRU5UO0AUAUAUAUAYz1oDmB6UAiQqoy3AqOyca4uUnhIylkp5mDSuyFmTucfvXzvW2Oy6cqW3F83h8vX8Wf3L0FhLPM75dvtUl2X3zkGp/wBNoHGPFNxb2znKfr0a9Rx2Z2OGMxHejKw7NjNQvTy0s+9hNOKfNLPzTM8alszsrcISFGe+zaRW+rusjGOUk3yfDwte2McvbBiKW6+5bwsrKNrBgB1zXvqbIWRThLK8yi1gcqYwFAFAFAFAFAFAFAFAFAFAFAcY8GgML451neyaZaucqw84r3PZfz5/KuRr9Q2+6g/f+h6HsjR4TvsXt92ZaWNYoxApbecGRXTGxskdfTFc+UUlwr4+52ozy+N8uj81sLsrufS70TQsVmTg4PB9j6g0rm6Z5T3MXVQ1VXDJbP8ANj0HQfE1nqgWNiILnOPLZvmPse9dvT6yFuz2Z5bWdmW6bxLxR8y/BGKuHOO0AUAUAUAUAlsd6wwRsC5OTzEp6eprluEdfLL3ri9vJvz9lyXrnyJM8HuPRRJGm1BxVyjS1aeDhWsLn8TWUm+Y29nDJ1THuKp6jsbRXvLhh+a2NlbNdSPBZRMuW3HnBGe4rmaPsLS2RUpZeG01nm02v7ksrpLYlLBGqbdgIPXNduvQaeEHDhyn57kLnJvLI8lo8R32jbf9vY1ybeyLdPJ26CeH5Pl+e5KrVJYsOJeujBbiPZ/u7VpT23ZVNQ1tfD69A6YtZgycpBGQcj1r0kWmsldiq2AUAUAUAUAUAUAUAUAUBUeIdUGmWBZMG4kO2FScc46/gKram7uoZXNlvRab9Rak+S5nmMBL3DzSO2eZGbdznqOT6nArgRy5cTPYyxGtRj12/PgSLq5l/wARF66oXZstGD7DIP4g1vOUlYrOpFVXHue6T26P89R+WOKWY24+NZlD2cufiBPRG9u3tgVvKMZScPPl/QijKUY95/45Ul90QImNtOfOiV0U4kjI688ioYy4JYki1OKth4X7M3Wi6kqbc3kktu+PKEuNy8crnuwOPpiuxRcl1yjzOr0zl/pSkuePr7GpUjGK6ByUKoAoAoAoBqaMyYGSB3x3qtqKJXJR4sR646/E2i8C0XaMDpU8IKEVGKwkasVWwCgI8BxJMpHR8j6iudo5JW3V+Us/NJm8+SZIromgUA3JGrgqygg9ahuphdBwmspmU2nlCoxtUDsOK3qgq4KC5IN5YqtzAUAUAUAUAUAUAUAUBHu7yCzt5J7mQJGg+JjWs5qEeKRvXXKyahFZbPLtd1N9Y1BrgbhGoKxJ/Korzuoud03JHstFplpaVF8+oiz066mtZp0tJGiCk+YSFUY6nnrWK6ZuLljYzdqa42Rg54flzZG3xi2iBjyxY5Zm4OO2PqK0bWES8Mu8bz+fmRtiyjYRjqQpGMZ71q2+TJElLclXIE8CTA5nA2yKTycDr+PIqWa4o8T5kFTdc3DHh6BZX720M0BLGKXnhiNjfzDH9n6Viq1xTiuv1F+nVslLqv3N14c8QJeJFbTYSTBUEtyxHUfkRjr3rs6XVKxKL5nmtfoHS3OO6/qaUVdOYFAFAFAFAFAFAFARos/aJjggZGK52m43q7m1heHD89iSX8iJNdEjCgCgCgCgCgCgCgOZrGQGcdqZADmsg7QDbyrGGZztVepJ4FYbSWWZSb2R5t4p1ldS1Py45T9jibaNn8Xq3v7VwtZqO9s4U/Ces7O0XcU8TXif4iot4nuJjbW6hTKO55xVWEXJ8MVuXpzVcVZPkjTjw9ci2Ivp/uhD8LSSkKjdht4GfzrorSzUXxs43/UK3Nd1HfPRbv4+RlIVRmIkk2AYAZRkda5kYrkzuycv9KyTbq8jvLVPtJd7mLKK6ptyv8JJ71NK1Tgm+aKtdM6pvg2Tx8/Ij20gjl/zEZaOZdrgDBI9R7io4Phfi6k1seKPge6/MAjIudrMbaQ7JGK9OePrxmsrhWf/ABMSUpYyvEt0OWlxJpmoxTY3GI5ABB3KeeD71mE5VWKRrbXHU0yj5/U9R0vUrfU7VZ7Vsg8MvdT6GvRVWxtjxRPG6jTz08+Ca3J1SEIUBxm20AgSq3Qg/ga1Uk1lB7cxYOa2B2gCgOYrGAdrICgCgCgCgCgCgOHpRggyXhSTB24yRXndR2xKi7hly3/b18/InVWVlDUt4d3wsQew9apavtexNtNxax5+fy2XubRrTLCFsoCep616micp1RlLnhZIJLDFbupqY1MV4/1BSsVlE+WzvkAPAHvXK7RuW1aO/wBiaZ8TtktjHwukaySHLPjEeOx9TXKi8JnoJJtpdCZpS6nAXmsImU7eZXQDaPYnpU1MbI7wRV1T088RtfwySYra+1CZFy8y4ILFmlAP1IGePpUsYW2vC3+JDK2miLfL5L+5BOnyLqS2EmI3MgTc4GBnoTg1B3LVnA9i1+pi6XdHfbJIn0yO2t7jNyxu4JREYduN4Iz8Pf1/Kt50qEZZfiT5fcihqpTlHw+BrOfIm6fYWt9YyJLIBJxsnHJjzyu7n5TyKnqphZBp8/p/yVL9TZTapJbdV54549UcttPP2ea1vIRBNHIRHcbcxscfK+Px4b3rEanwuM1jHXp7P7M2s1C41ZXLKay119190Utxby20zW0ylGQ8qx6fgfeqc4yjLhlzOlXZGcVOHJkvRdWn0a8E0eSp4kiPG4f81JRfKiWenUh1ekhq6+Hr0Z6rbTrcQxzR/JIoYfga9HGXEk/M8TKLjJxfQdY4GRWxgo9b1qCCHyd7B5GEYdP4ckAnPtn86q6i+MI4yXtJpJ2Pixslkiab9saIyi1FtKJQiITx5fqR79aq1ahSx5t7eWPX9yXUd0nw8XEsb+5Z6NeTXH2lZWR1jc+XIv8AEMkfupq7RZKec/D6fVFbU0xr4eFYzzXy+zLWpyqFAFAFAFAFAJZggJYgKOpJoDoIIBHINAdoAoBMh2oT6VHbNVwc3ySz8jK3ZR3Uu52LADHANeX7O7vX9qSd0N47rHLZ438/c21spU6fMXzEIpExViCNuemPqK7Pbml086O9klx9H+799k8epS0M7I28GdiysWLc56Eg8VR7GsdiynnGcv6Z9To2pJktyACSeAOfavQ5WCDB5Reo19qN1cW0UptzN80aFioz1968/wBzPU3Pg5N8/wAZ7JXQ0enirXul8x2NNOe+gEjXFnZqPikkX7wuPUYIH/FX7Oy5x1MKY7rGcooR7Sk9LO5rMs4x0Rc6mlvLGs9jrFiiunlsZCVaT157flW2p0dsOTS+BW0eqhPacG/bp9PqVTXV9bo0cWqxGNucwtk+4z2qjJXx2z8v+Dp8Omsak6915lY8pa4817iR2A+F8ZJI9aiWnvnLaLfwZZ72mEOHwr0yLilikIMr3EkzckggfTuTUq0d3+qLbI5amtbRlFIk6ZcnStRjuZ0YQup3LE2WI/P962rovosU5wePbJHfKrV0uuE1lHoGn3pvtPNxHp7Krg4jYgFgOgNdmHdzWU/2weVtjOqzhk8teTKfV9Nk1nyzfae1kyKfvo5kfjsCOM/0rTVaCq+KxLf2LGk7Tnok8eJeRD1fw9NdsHht50nChTIShSUAdTg5BNVdR2aprihNcXlgu6Ltju9prwv5r+xzw7qOs2dpv8k3dnFIYmiX/Uix6e3PSq2mtvrjyzFfNFrW6fS22Y4uGTWU+jNqsrXFkJIgVaSPK7+CDjjNdZPijlHn3FQniXJPoZDRrJmMs16padHUDeMKAAcAf9p+teY113c0NveT2+R29Vato17Lf9/xosL+dYbC6lkaRQIj8nU9q4+g4tRZKbb8O+xUqjm6EI4znqTvDFtHFp8ciMpLIqED+EKPlPvksT7k17jSwUYJ/m35uQ6+xztaa6t/Pr7csexcE4qyUiNHeB2XC4VyQpz1NbOOCCN2X7knOelak3MVQycbOOKAz994t060lEX3sj7iCETG3HU5P4VYhpbJrIM/4s8Sfb41srEyKNoeUbcNnqVPpgdataTT8L4pg1XhtpIfD9kbyQBvKDFmPY8jn8MVSuw7HwgtUYMoZSCD0IqICqARLtKMGOFPBNR2wVlcoS5NY+Zlc9iGliqkkuTmuNp+xIU2OXG98+79G1uSyt4lhordLBvlu5MEBbh0XPoDis6zR2a1KDfgT5cv3KminFcU8b5ZeQIEjC4HHtXT0lCppjX5E8nl5OXLIkEpkAKBCWB7jFWeHi28zCeHlGX0FpLaxh2KEaRc7FXAGecfSrLqrguGC2Rz79XbO9ybbZKlmW6jeLFvNHnDKUDHd3znNElHxPY0nZdBcJBOi2ErZFjGrp3Xco/HAOK0n43xcb+b+xPXr9TGHCop+8UNDw9ppJ/y4IzyXlbr9DWO7/8AaXzZt/1XU88RX+1Czo+lJGqpZx7gfmySMfUmsLTx65+bMS7W1XDhSx7Jf0H4LS3h5ghhTH8q81vGquHJFWet1NyxObfxHHtlkA3wq205AKVs7IRkuJ7sjj3qT4c464yPxmdFChTtH8OMDFMwl1Cdi5rb4ipZozDsEKrLkc4zxWEnnJmU4cPDw7j8zu1jawKfvJ5BHnvtByf0Fa4XG2+h0dP/AJSLCC0ggnmliQK8xBkx3I9qrRhGLbXUsyslNKMnshdyGFvIIcB9p2/j2rM88LwYi1lcXIySXxtIpY2t7yR1kLCMr8qk8c9s47muDq9JDUYVnFhN/vj+h2HQrJJppLHP19viV9tK11f3kUsUkhKFHQEso7dPx/apdPVCuLrhHCxj89TzuiulLtBy4uTf5ubfT4TBE5bG+Ry77eme2PoBXYhHhW/MuWzUnhclsV9xdXAuJF80qNxAX0qyox4ctHHndZxuKfMQ7MoVWYgxjgg+2K87HtuU9dLT8O2Ulz3yXpaTFCnndL7EvS1cNnJ2DPOfmr0NnkV9KpPfoWlRF443TrigPJtTnhbWN0HmTwwzk5XkOu8sMfTI+ldiC4avHsMZHL7R7u3083l2485mIMeecHO4k/rXN0fbFGsvdVCzFdfpj6EkoOKyxMi6vqcv3jPHCigr5jlUiXt+3Hc10v4Vax1Iz0Tw3FPBo9vHdH7zBJGMYBJI4rmXNObaBYySKo+JgPTmojKMdr+r2zXFvJCRKiP5jtuxnb0Ue27H41XVUtVvVulv8uh0al+njw2PDe3wfN/LkXmhXsNzZQIJ/NlRAHyMc96zROMopZyytqqpQsbxiL5ewrSwyapqEYbMQKso9CRk1mvacvI51SxZPHItqmLA3KAylWGVIwRRcwZ+1VIrqEBcInQdQAOBVl7o48JZuUmN6Ttg01lhYN50zyFgPVjxXkf8S9qTUnpo5T2z7Y+56GmtN8TJKgMBhUDZxu9q4Wk12oqpVdMmsy3eSSymE3mayIQJJqBjCDyYYC8vHUk/Bj6An617vs7UWX6VW2c23j2WdzmXaamOXgI4Va2mmK/KQBz710M+JI5kY5rlMbnn8ww7xj4kTI/+w/pVXXQzpbF6Mt6OfFdHPRD/AJcEb5QyRTNks4Oct64PFeMn2pGLqhdu608e7xj9l+52e7bzjqP27zrCCHXDEku4yeB1q72LfbJcT/7k8/Bc/wB9jS5LOPJFdFdS30MdxcAIxXgBccc84r2XCovCOFqt7OZOtPvNTs4+dsFq0n1YhR+gb86iltBvzaRf0/8AlIu6hJjh6UBGubKC4kiklj3NGcqckfmO9aShGTyzeFs4JpPmU2jwBPE2sOFC/wCnwD/MM5/Soao4vmznUwxqLHg0SjAqyXiq1S2klmBSLIP8Sj96mrkktyhqqpSkmkMS286yJE2XVs4PGQBVB6an9SrllS36/Z/Y2fe933TeU/2wTdNjeJWDbgCeAe1XJvJvpoOCafIn5HqK0LWSNqFst7aPbs5UP3U/3keo71tGXC8g8813RF0a4ikF2puZpcoAuNgz8xPtmujCf6mEoSjlcvQymQbv7fe26G6uCPi3RxTNtOHPBzxUWkq0WlnKOnjw+eDXveN4zujT+FNLgtdRK74ryQQBpZVwyxNnAVT+Ga11FrlDy3+Zk2YqmCn8RSi30y6mOf8ASKbu4zxx+dQamSjW2y3olx3QXqYaHS3vYkkkVREkKxx4wVYk8A+n9M1vpNb+n0sYxScl8vQt6uhWaqXE9vzJrdE0+4N0LyZVih6xRq24kFQASfXHX3qtRVNS45Eervrce7ju+r+JYeH5vtMNxc4b72dsEnqAcDH0FT0PiTl5s4umfFFz82WtTFgZuQ5idYh8ZXArK5mlmXF4M3JKDbpKUKlQynJz8pIqy9uLJzrKuGcI+Yq1hW3tYokPEagY9eK+Sa3Uy1d875c5PPt/wj00VwrBJVS7KgHxE1tXTKdkKI7SbDaSbYibcpuSV2bpQq5OMqowMfvX1OiqFVcK48oo8/rLXJYTJa2zixwWIGN2D3PvW3F4smvcvucEIRoiM8nSOaIE/i3WtdS/4Ul6P6MzoYeNsdVS6uxPCgZJr5ZGqdynY3tFZb+iPQZUcIdUs9o3YuVhXjpk8/vXqv8ADUZTTtnyiuFfV/N4K2oxyXUi3B+9lxwqkIMf37V6+OyR5+6Tc5MkaWm7W7xj/Ba28ZHv8Z/qKjm/4a939jqVpqCT8i8qEkCgOGgKW0Aj8Taio/8Akgif8sj+lQQ2ul8CtXtqJ+y+5dCpyydoCsGZNccH5YrcY46FmOf2FRZzZjyIedvsvqM+JbiW20eeS3Z0cDh0GSv99PrWmqlKFTcTo6CELdRGM915FZu1SW/gjupv8rHGssssJK7jj5eDk888e1UZanFqrsmlhZe/mWktNGqTgvE20k+m/MvtKuo72yhniLFWXB3fMCOoPvXSqmpwUonPvqlVY4S6DGpaFY6jdxXN3EzvGNoG74SPcVYhdOtcMSIQkcT69cI8aEG2j4KgjhjVZPFr33wV4/579kWcUSRrtiRUX0UYFStt8ywO0AxdWsd1C8UyBldSp/A9a1lBSXCzaE5VyU480Z6+0q2bWLa2lVvJmhxwcbmTGAfxH7VUsphKyMXyJo9pWVTUMc8vPkXGsTCy0e7mXjy4GxjjnHFWbZcFbfkUr5uNcp9cCtEt1tdLtYlXbiNSR7kZNKY8MEjFEVGtJE6pCY4awwZayLB5EdRL5c8u0E4B+LOP1q3NJx90ijdJK+OehNguYXjle4gkHABWJd+OegxyefavOw7CrdlveJYlsumyw/qX46yM8KDyJm1HTYHCeZJby4OPNhdSSQehIxmrFPYddFtdlMV4W2+vNNc/TJmVsrINZ5lTb69ZXEaqcQAHBeVwM9en4hT+lWo62vvJRfJbGdR2LdCmLr8TeP7/AGJ+n+IU1RpoY4fKjRCvxMCWbqAPbAJrTTatXW4S2LOu7PlptPxSeX9ESLTa1pco5YAgH4BlvxAq7qIKyPDJZT2OJoXwt5OJMFtpF+z3EmXHVRFn/rxXn9N2BHubKrpbSllY8kdOepSaeRMN9dPdKXgiigRt2PN3MxwRjgYAru06SqiL4Or/ALFSzVR5J7jOTJMe4dufx/s1Z5I5WXKXuyx0fL3epzFCN1z5an1CIq5/PNRW7KK9Pudxci2qIBQHDQFDMzW/i6IkfBc2pQH3U5/rVZ5jevVFNvh1K9V9C+XvVkuHaArLQiTV79kJwnloec5OM/1qKO9kvgQw3sk/YqvFtnd3EGUV5YAOYlbA7nJ9R0qtra5yjtyOz2bbXCfi2fmyF/jMEVkXIeSaFUV4ycsCeleV1mjt1OqlLHluyPXy/RV941lPljqaXRLT7FptvBkkqmSx6knk/qa9nTWq61FFW+7v7HZ5k81KRFOuf/6cjsLT/wDVQf8AefsVt+/+BcA1OWTtAMx3MUryRxsGeM4cDsaxxLODVSTbSKrWyY77SZewutn/AFKRUN380H6/Yr6jacH6/VHPFUwGn+Qy7kly0nP8Cjcf2A+tYveIYGrfg4fP7FvEVCLt+XAwfap0WVy2HM1kycz6CsAysH3hmKrjM8jcjB+b/wAVcfJHM1L4rceRJkhKW6TF/nPABrCeZEDqagpPqBWdLWUsD5WxgxJ4/LvUV0oKLbeC1pa7uNYi2vfB59KiGXYswlUH4SyEZGPT9PrXlJpOWIyz+x9JrlPg4pR4X1Wc/uXnheEqwkkzue4Me0nGAI2J4/T61d7PjicX64+pye2pqVM49OHPzawae1t3lBPmbF9Se1ehcjwldLlu3g7LFCHURu8jd2PArKcjacIZwssmRi0iAKbGkx1JzUbcmyzGNUFtuyNaFEjDyjjzGfHsq1tLJFp0ts9X9iV4eUjSIHYndJukOfVmLf1rS7+dnSLInAzUYIGo6olk8EflNJJM+1UU4OO5qOdig0urIbblW0nzY5Lfwx30VmcmV0L+wA9ay5pS4TZ2xU1DqV+uvGlxpV0WACXIUN6hgRUV3OMvUh1GFKEvUud2BVgtELVdUj022E0iNIN6ptTqCaittVccshuujVHiY3pGHe9uVYFZrglcDHAAH7g1irfMvNmKN+KS6snTyxwxl5WCqBnJqVvhRM3hZZjdds7i002/laNVSS6Mm/qzfESufQCudZCUISfr9zPbF8bNLBRf8qj8MczV2l0P8Ot7m5cDdEhY+5A/qavxl4E2RwnmCkyVvBOO47VtlEhSRXMT+K5Y1YbktgpGe+c4qBSTva9Cqpxepa9CXrWpf4ZaGbynkJPRK3ts4I8RJfb3UeInQTLLCjgqQQDkHIqSLTWSVPKyY6w1a5t7BpgoeS5vWjHmHkMTgHj04qhC6UYZxu3g5dV8415XOUsfMm67qtvI+lpnDtcQzggZG3NSXXR8HumS6i+DcF6pjHjG8jmNvbQzLklvMIPAXGCDWurmsKJprrE8Ri/Ml3l5cjVUFk6bYzFCsbHOWfk9PRRW85yUvD0wiayyXe+D2+e/0J0t7tgmVrlMwgmaTHyj2A9ecVM5rD3JXZiL35cw0G4muLBXuNys+5wGOSqEnaD74rFMm4ZY08pThl7ZKy3Z7myF27Kd8jgFeAUycH64rovaXCVNTUo7p5Y9ERhgxbIU7eM5NYfoQQw08+RKu2b7HO8j7UVTvBQDA9z7VBNwjFuXIv097KS7vOfJI89gtEkhe5t3JETsQJByVCg9uM/8ivMKtNOUen29j3/fTi1XYllpZxyy9uu5oPCds1xCxjlWRo2bcSD8BYDPPfgD9a63Zihhye7X3POf4glc5KuC4YtfPBcyxhG2k71A6+9ddPJ5WUeF4TyJVpCejE47L0rLwapy6EkIyxtNPG42r8Oe56VpnfCJ1F4cpLoR79WTR5Hj/ht5Np9zxW8P8zHqiXTx3g1ywxC+IRbLcW/lDfAAsRJ4c9MfpXMnqVxSNpaxJyj5EmDxEkt3FaiBy7Ku9l+VSQD1/CkdQpSUcG0dWnJRwVV3qwmuru/jWIpassNuzdyT8R/WoZW8UnNdORXnfmUrMctkVdtquNRuLy5ZsyJKyEcnBG0D9Kgjd4nKRWjficpy9SZqd+Y9I0WPZ8UXlzMACQEA459cYqSyzFcM+hLbbiqtNcsEW81C9eGWDc7pMwnV8nKKwBH/AKrSVs0ms+ppO6zhazzGprx59HBaRZZ5Lwysqnr8K446/wDqtXNuteeTR2OVXPfJrfDV1GdFtS8iCRiwYE8l9xz/AH71f0806lvudLSWJ0xbfP6ifE959ntmU/Ls5GOuSBj271jUTwjGrs4I7lX4j1ePUNFK2aq0cihmZjgrzwMYqC+6M6vCQau9WUvg5FfqWq3NxaWkVu7R2yIis3QsQSAf+0Go7LZOCS5YILdROUIqLwsFjY3d6dTsnmuiyPmNiQMMoUsT+fH0qWM58cW2T1zs7yLctiokuHS+j1bzG3vMXUDBBTJwAeOwIzUEptS7xlWUnGfe56k7xLqb3MMMEKN9+yyrjngn4Afrz3qTU2OS4fMl1Vzmko9dy9tbkx2VnHZpvlSHbsz0wQDn9atceIrBdViUFwlNBbp/iukWxLGIPNLtz1YMSD+gqslmyEXy3KcI5urj0yxiO3jm0SaRwS6/Zo1bPKglc4/M1okpUtv0I1FS07b9EVl4i/YLbaNu5DISPVuT9OKjsWI/uRWbJfMvvDce+9LOxYpMx5xyxA5PvVjTrx/H7FvR7zjn1+gmV2+zyE4zNeTNIf5tgO0fhwPyrL/l92bc479Zb/Ad8NzSvrFyskrOFURgE8AD2rOmk5TbY0c5Ttllk6K2jisnjjyEifaq57V13NuWTE/EpSY1FjZjA69fWs5K8XlEhkWW1vMjAEZwAeOlV721WzpaGMZXx26mHuod0fmNJISxcEZwOAPSvN5dj8R7mqSr2il0Nf4chSx0xVtht807mPU5wK7mhohCGx5TtHV2Xapxl0JE0CJcOvJGAeT610OccnElBKeCRZsYLjy0xtduc9elRT3JtPLhbSJN2xdxGfl2M2PcVpHzLFj4mosg66PI0ACPjLxA+4Lrn96kpebSaqKjBJFHqsKWssskPD3MxR2PZeDgelcixcLbXU5VyUXJrqyEWMemTSISsmQu4E+x/Pmo3tDKNH4anJc8ibs+VYaXbIB5TxfaJB/O55yaxLwxjFcjE/DCEVy5lfcwounxXAzvdtuM8AbA2B9WNRWJRjleZBOCjDKJ2pyl7eIEAbbRiMD1IH7AVNb9ET3Pwr2K2JmazuSxJ8tE28/7sVBH+VleO8XnoIU7Q7rwVA6CsLmaxzzNBoUhkivbZwpSKIzIcchsBv3q1Q8xa/PMvaZ5i4kvU53u9X0aKcKyTrG7jHfrUtrcpwT9CW6TnZCL5PBF0qGM6dqy7BhIGVfbDMAajrS4J+39SGiK7uz2/qUU9y/2CKIAYUkZ5zwP/NVpPwFRt93E0F+3k2mnRRqFX/DmbjrkqAf3qzZ4YrHlkvWbKCXkP+KNNt4tNt/L3qsMBVVDcEAd621EIqCx5DVUxVa9EVcEhm8TaXbuq+WiRYwP9oNRre6C9iGL4tRBP0NB4eAbVLo4x8IIx2yBnH5VZo/nky7p3/Ekf//Z",
    submittedAt: "2024-01-14T14:20:00Z",
    status: "pending",
    isEdit: false,
  },
  {
    id: 3,
    studentName: "Emma Johnson",
    type: "reflection",
    topic: "What I Learned Today",
    content:
      "Today I learned about butterflies in science class. Did you know they taste with their feet? That's so cool! I also learned that they have four wings, not two like I thought before.",
    submittedAt: "2024-01-13T16:45:00Z",
    status: "pending",
    isEdit: true,
    oldContent:
      "Today I learned about butterflies in science class. Did you know they taste with their feet? That's so cool!",
  },
  {
    id: 4,
    studentName: "Liam Smith",
    type: "personal_section",
    topic: "My Interests",
    content:
      "I enjoy building with LEGO, playing soccer, and reading adventure books. My favorite LEGO set is the castle one!",
    submittedAt: "2024-01-12T11:20:00Z",
    status: "pending",
    isEdit: true,
    oldContent: "I enjoy building with LEGO and playing soccer.",
  },
  {
    id: 5,
    studentName: "Emma Johnson",
    type: "image",
    content: "My family drawing - updated version",
    imageUrl: "data:image/png;base64,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",
    submittedAt: "2024-01-11T09:15:00Z",
    status: "pending",
    isEdit: true,
    oldImageUrl: "data:image/png;base64,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",
  },
]


export const mockReflectionTopics = [
  { id: 1, title: "My Summer Vacation", description: "Share your favorite summer memories" },
  { id: 2, title: "What I Learned Today", description: "Reflect on something new you discovered" },
  { id: 3, title: "My Goals", description: "What do you want to achieve?" },
  { id: 4, title: "Kindness Matters", description: "Tell us about a time you were kind to someone" },
]

// Learning curriculum structure
export const CURRICULUM_STRUCTURE = {
  EYFS: {
    name: "EYFS",
    displayName: "EYFS",
    subjects: [
      "Communication and language",
      "Personal, social and emotional development", 
      "Physical development",
      "Literacy",
      "Mathematics",
      "Understanding the world",
      "Expressive arts and design"
    ]
  },
  "Year 1": {
    name: "Year 1",
    displayName: "Year 1",
    subjects: [
      "English",
      "Maths", 
      "Science",
      "History",
      "Geography",
      "Modern foreign languages",
      "Design and technology",
      "Art and design",
      "Music",
      "Physical education",
      "Citizenship",
      "Computing",
      "Religious education",
      "Personal, social and health education"
    ]
  },
  "Year 2": {
    name: "Year 2", 
    displayName: "Year 2",
    subjects: [
      "English",
      "Maths",
      "Science", 
      "History",
      "Geography",
      "Modern foreign languages",
      "Design and technology",
      "Art and design",
      "Music",
      "Physical education",
      "Citizenship",
      "Computing",
      "Religious education",
      "Personal, social and health education"
    ]
  },
  "Year 3": {
    name: "Year 3",
    displayName: "Year 3", 
    subjects: [
      "English",
      "Maths",
      "Science",
      "History", 
      "Geography",
      "Modern foreign languages",
      "Design and technology",
      "Art and design",
      "Music",
      "Physical education",
      "Citizenship",
      "Computing",
      "Religious education",
      "Personal, social and health education"
    ]
  },
  "Year 4": {
    name: "Year 4",
    displayName: "Year 4",
    subjects: [
      "English",
      "Maths",
      "Science",
      "History",
      "Geography",
      "Modern foreign languages", 
      "Design and technology",
      "Art and design",
      "Music",
      "Physical education",
      "Citizenship",
      "Computing",
      "Religious education",
      "Personal, social and health education"
    ]
  },
  "Year 5": {
    name: "Year 5",
    displayName: "Year 5",
    subjects: [
      "English",
      "Maths",
      "Science",
      "History",
      "Geography",
      "Modern foreign languages",
      "Design and technology",
      "Art and design", 
      "Music",
      "Physical education",
      "Citizenship",
      "Computing",
      "Religious education",
      "Personal, social and health education"
    ]
  },
  "Year 6": {
    name: "Year 6",
    displayName: "Year 6",
    subjects: [
      "English",
      "Maths",
      "Science",
      "History",
      "Geography",
      "Modern foreign languages",
      "Design and technology",
      "Art and design",
      "Music",
      "Physical education",
      "Citizenship", 
      "Computing",
      "Religious education",
      "Personal, social and health education"
    ]
  }
} as const;