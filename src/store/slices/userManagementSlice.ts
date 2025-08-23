import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  type CreateUserRequest, 
  type ResetUserPasswordRequest, 
  type User, 
  type UserManagementState 
} from '@/types';
import { API_BASE_URL, STORAGE_KEYS } from '@/constants';

const initialState: UserManagementState = {
  users: [],
  isLoading: false,
  error: null,
  createUserSuccess: false,
  successMessage: "",
  resetPasswordSuccess: false,
};

// Helper function to get auth headers
const getAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
});

// Async Thunks
export const createUser = createAsyncThunk(
  'userManagement/createUser',
  async (userData: CreateUserRequest, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/create-user`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to create user');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  'userManagement/resetPassword',
  async (resetData: ResetUserPasswordRequest, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(resetData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to reset password');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'userManagement/fetchUsers',
  async (role?: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      let endpoint = `${API_BASE_URL}/users`;
      if (role) {
        endpoint = `${API_BASE_URL}/users/${role}`;
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch users');
      }

      const data = await response.json();
      return data.users || data.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const userManagementSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.createUserSuccess = false;
      state.successMessage = "";
      state.resetPasswordSuccess = false;
    },
    resetState: (state) => {
      state.users = [];
      state.error = null;
      state.createUserSuccess = false;
      state.resetPasswordSuccess = false;
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    // Create User cases
    builder
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createUserSuccess = false;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.createUserSuccess = true;
        state.successMessage = action.payload.message;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.createUserSuccess = false;
      });

    // Reset Password cases
    builder
      .addCase(resetUserPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.resetPasswordSuccess = false;
      })
      .addCase(resetUserPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.resetPasswordSuccess = true;
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.resetPasswordSuccess = false;
      });

    // Fetch Users cases
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.users = [];
      });
  },
});

export const { clearError, clearSuccess, resetState } = userManagementSlice.actions;
export default userManagementSlice.reducer;
