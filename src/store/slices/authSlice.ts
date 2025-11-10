import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 

    type LoginRequest, 
    type LoginResponse, 
    type ForgotPasswordRequest, 
    type ForgotPasswordResponse, 

    type AuthState 
} from '@/types';
import { API_BASE_URL } from '@/constants';
import { getFromStorage, extractErrorMessage } from '@/lib/utils';
import supabase from '@/lib/supabse';

const initialState: AuthState = {
  user: null,
  token: getFromStorage('auth_token'),
  isAuthenticated: !!getFromStorage('auth_token'),
  isLoading: true, // Start with loading true to check auth on app start
  isLoadingForgotPassword: false,

  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if(response.status === 429){
        return rejectWithValue('Too many login attempts. Please try again later.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(extractErrorMessage(errorData, 'Login failed'));
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
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forgotPasswordData),
      });
      
      if(response.status === 429){
        return rejectWithValue('Too many login attempts. Please try again later.');
      }

      if (!response.ok) {
        console.log('failed to send reset email')
        const errorData = await response.json();
        return rejectWithValue(extractErrorMessage(errorData, 'Failed to send reset email'));
      }

      

      const data: ForgotPasswordResponse = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send reset email');
    }
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('user');
      const supabaseAccessToken = localStorage.getItem('supabase_access_token');
      const supabaseRefreshToken = localStorage.getItem('supabase_refresh_token');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          
          // Check if user is inactive
          if (user.status && user.status !== 'active') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            localStorage.removeItem('supabase_access_token');
            localStorage.removeItem('supabase_refresh_token');
            return rejectWithValue('Account is inactive. Please contact an administrator.');
          }
          
          // Restore Supabase session if tokens are available
          if (supabaseAccessToken && supabaseRefreshToken) {
            try {
              const { error } = await supabase.auth.setSession({
                access_token: supabaseAccessToken,
                refresh_token: supabaseRefreshToken
              });
              
              if (error) {
                console.warn('Failed to restore Supabase session:', error);
                // Clear invalid session tokens
                localStorage.removeItem('supabase_access_token');
                localStorage.removeItem('supabase_refresh_token');
                return rejectWithValue('Session expired. Please login again.');
              } else {
                console.log('Supabase session restored successfully');
              }
            } catch (sessionError) {
              console.warn('Error restoring Supabase session:', sessionError);
              localStorage.removeItem('supabase_access_token');
              localStorage.removeItem('supabase_refresh_token');
              return rejectWithValue('Session restoration failed. Please login again.');
            }
          }
          
          return { user, token };
        } catch (error) {
          // If parsing fails, clear localStorage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          localStorage.removeItem('supabase_access_token');
          localStorage.removeItem('supabase_refresh_token');
          return rejectWithValue('Invalid session data. Please login again.');
        }
      } else {
        return rejectWithValue('No session found');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to initialize auth');
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
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('supabase_access_token');
      localStorage.removeItem('supabase_refresh_token');
      // Clear Supabase session
      supabase.auth.signOut();
    },
    clearError: (state) => {
      state.error = null;
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

        
        // Check if user is inactive
        if (action.payload.user.status && action.payload.user.status !== 'active') {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          state.error = 'Account is inactive. Please contact an administrator.';
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          return;
        }
        supabase.auth.setSession({
          access_token: action.payload.session.access_token,
          refresh_token: action.payload.session.refresh_token
        });
        console.log('set session !!')
        // Persist to localStorage
        localStorage.setItem('auth_token', action.payload.access_token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        // Store Supabase session tokens for restoration on app load
        localStorage.setItem('supabase_access_token', action.payload.session.access_token);
        localStorage.setItem('supabase_refresh_token', action.payload.session.refresh_token);
        
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
        
        state.isLoadingForgotPassword = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoadingForgotPassword = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoadingForgotPassword = false;
        state.error = action.payload as string;
      })

    // Initialize Auth cases
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });

  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;