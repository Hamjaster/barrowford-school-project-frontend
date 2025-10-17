// middleware/errorHandler.ts
import { type Middleware } from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';

export const authErrHandlerMiddleware: Middleware = (store) => (next) => (action : any) => {
  // Check if action is a rejected async thunk
  if (isRejectedWithValue(action as any)) {
    console.log(action, "ACTION")
    const errorMessage = action.payload;

    console.error('❌ API Error:', errorMessage);

    // Example: trigger logout on 401 errors
    if (errorMessage.includes('Student account is inactive')) {
        console.log("Logging student out")
  
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Example: show a toast notification (if you’re using something like react-hot-toast)
    // toast.error(errorMessage);
  }

  // Always pass action forward
  return next(action);
};
