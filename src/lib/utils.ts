import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { VALIDATION, ERROR_MESSAGES, TAB_DISPLAY_NAMES } from '../constants'
import type { UserRole } from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Validation utilities
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }
  
  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_EMAIL }
  }
  
  return { isValid: true }
}

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }
  
  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return { isValid: false, error: ERROR_MESSAGES.PASSWORD_TOO_SHORT }
  }
  
  return { isValid: true }
}

export const validateName = (name: string, fieldName: string = 'Name'): { isValid: boolean; error?: string } => {
  if (!name) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }
  
  if (name.trim().length < VALIDATION.MIN_NAME_LENGTH) {
    return { isValid: false, error: `${fieldName} must be at least ${VALIDATION.MIN_NAME_LENGTH} characters long` }
  }
  
  if (name.trim().length > VALIDATION.MAX_NAME_LENGTH) {
    return { isValid: false, error: `${fieldName} must be no more than ${VALIDATION.MAX_NAME_LENGTH} characters long` }
  }
  
  return { isValid: true }
}

export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (!username) {
    return { isValid: false, error: ERROR_MESSAGES.REQUIRED_FIELD }
  }
  
  if (username.trim().length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long' }
  }
  
 
  
  
  return { isValid: true }
}

export const validatePasswordMatch = (password: string, confirmPassword: string): { isValid: boolean; error?: string } => {
  if (password !== confirmPassword) {
    return { isValid: false, error: ERROR_MESSAGES.PASSWORDS_DONT_MATCH }
  }
  
  return { isValid: true }
}

// Form validation utility
export const validateForm = (data: Record<string, any>, rules: Record<string, (value: any) => { isValid: boolean; error?: string }>): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {}
  
  Object.keys(rules).forEach(field => {
    const validation = rules[field](data[field])
    if (!validation.isValid && validation.error) {
      errors[field] = validation.error
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const isValidRole = (role: string): role is UserRole => {
  return ['admin', 'staff', 'parent', 'student'].includes(role)
}

// String utilities
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const formatFullName = (firstName: string, lastName: string): string => {
  return `${firstName.trim()} ${lastName.trim()}`
}

export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`
}

// Date utilities
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

export const formatDateTime = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

// Local storage utilities
export const getFromStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export const setToStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Silent fail for storage issues
  }
}

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch {
    // Silent fail for storage issues
  }
}

export const getObjectFromStorage = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

export const setObjectToStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Silent fail for storage issues
  }
}

// Error handling utilities
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return ERROR_MESSAGES.NETWORK_ERROR
}

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof TypeError && error.message.includes('fetch')
}

// Array utilities
export const removeDuplicates = <T>(array: T[]): T[] => {
  return [...new Set(array)]
}

export const sortByProperty = <T>(array: T[], property: keyof T, ascending: boolean = true): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[property]
    const bVal = b[property]
    
    if (aVal < bVal) return ascending ? -1 : 1
    if (aVal > bVal) return ascending ? 1 : -1
    return 0
  })
}

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}



// Tab utility
export const getTabDisplayName = (tabKey: string): string => {
  return TAB_DISPLAY_NAMES[tabKey] || toTitleCase(tabKey.replace(/-/g, ' '))
}

const toTitleCase = (text: string): string => {
  return text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}

// Role utilities
export const getRoleDisplayName = (role: UserRole): string => {
  const roleMap: Record<UserRole, string> = {
    admin: 'Admin',
    staff_admin: 'Staff Admin',
    staff: 'Staff/Teacher',
    parent: 'Parent',
    student: 'Student',
  }
  return roleMap[role] || role
}

