// middleware/errorHandler.ts
import { type Middleware } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { logout } from '../slices/authSlice';

export const authErrHandlerMiddleware: Middleware = (store) => (next) => (action: any) => {
  // Check if action is a rejected async thunk
  if (isRejectedWithValue(action as any)) {
    const errorPayload = action.payload;
    console.log(errorPayload, "ERROR PAYLOAD")
    console.error('❌ API Error:', errorPayload);

    // Helper function to check if error message contains the token expiration message
    const isTokenExpiredError = (payload: any): boolean => {
      if (typeof payload === 'string') {
        return payload.includes('Invalid or expired token') || 
               payload.includes('No authentication token');
      }
      if (typeof payload === 'object' && payload !== null) {
        // Check message property
        if (payload.message && typeof payload.message === 'string') {
          return payload.message.includes('Invalid or expired token') ||
                 payload.message.includes('No authentication token');
        }
        // Check error property
        if (payload.error && typeof payload.error === 'string') {
          return payload.error.includes('Invalid or expired token') ||
                 payload.error.includes('No authentication token');
        }
      }
      return false;
    };

    // Helper function to check if error is about inactive account
    const isInactiveAccountError = (payload: any): boolean => {
      if (typeof payload === 'string') {
        return payload.includes('Student account is inactive') || 
               payload.includes('Account is inactive');
      }
      if (typeof payload === 'object' && payload !== null) {
        if (payload.message && typeof payload.message === 'string') {
          return payload.message.includes('Student account is inactive') ||
                 payload.message.includes('Account is inactive');
        }
        if (payload.error && typeof payload.error === 'string') {
          return payload.error.includes('Student account is inactive') ||
                 payload.error.includes('Account is inactive');
        }
      }
      return false;
    };

    // Handle token expiration/invalid token errors
    if (isTokenExpiredError(errorPayload)) {
      console.log('🔒 Token expired or invalid - logging out user');
      // Dispatch logout action to properly clear all auth state
      store.dispatch(logout());
      // Redirect to login page
      window.location.href = '/login';
      // Don't pass the action forward to prevent showing error to user
      return next(action);
    }

    // Handle inactive account errors
    if (isInactiveAccountError(errorPayload)) {
      console.log('🚫 Account is inactive - logging out user');
      // Dispatch logout action to properly clear all auth state
      store.dispatch(logout());
      // Redirect to login page
      window.location.href = '/login';
      // Don't pass the action forward to prevent showing error to user
      return next(action);
    }
  }

  // Always pass action forward for other errors
  return next(action);
};
