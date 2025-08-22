import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    type  User, 
    type LoginRequest, 
    type LoginResponse, 
    type ForgotPasswordRequest, 
    type ForgotPasswordResponse, 
    type ResetPasswordRequest, 
    type ResetPasswordResponse,
    type AuthState 
} from '@/types';
import { AUTH_API_URL, STORAGE_KEYS } from '../../constants';
import { getFromStorage } from '../../lib/utils';

const initialState: AuthState = {
  user: null,
  token: getFromStorage(STORAGE_KEYS.AUTH_TOKEN),
  isAuthenticated: !!getFromStorage(STORAGE_KEYS.AUTH_TOKEN),
  isLoading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Login failed');
      }

      const data: LoginResponse = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (forgotPasswordData: ForgotPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await fetch(`${AUTH_API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forgotPasswordData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to send reset email');
      }

      const data: ForgotPasswordResponse = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetPasswordData: ResetPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await fetch(`${AUTH_API_URL}/reset-password-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetPasswordData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to reset password');
      }

      const data: ResetPasswordResponse = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    },
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.token = token;
          state.user = user;
          state.isAuthenticated = true;
        } catch (error) {
          // If parsing fails, clear localStorage
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login cases
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        state.error = null;
        
        // Persist to localStorage
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, action.payload.access_token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

    // Forgot Password cases
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Reset Password cases
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, initializeAuth } = authSlice.actions;
export default authSlice.reducer;