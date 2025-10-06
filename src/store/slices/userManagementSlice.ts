import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  type CreateUserRequest,
  type ResetUserPasswordRequest,
  type UserManagementState,
  type FetchUsersRequest,
  type FetchUsersResponse
} from '@/types';
import { API_BASE_URL } from '@/constants';

const initialState: UserManagementState = {
  users: [],
  parents: [],
  pagination: null,
  isLoading: false,
  error: null,
  createUserSuccess: false,
  successMessage: "",
  resetPasswordSuccess: false,
  isStatusUpdateLoading : false
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
      console.log("userData", userData)
      const response = await fetch(`${API_BASE_URL}/auth/create-user`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to create user');
      }
      if (response.status === 429) {
        return rejectWithValue('Too many login attempts. Please try again later.');
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
      if (response.status === 429) {
        return rejectWithValue('Too many login attempts. Please try again later.');
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
  async (params: FetchUsersRequest = {}, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      // Build query parameters
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', params.page.toString());
      if (params.limit) searchParams.set('limit', params.limit.toString());
      if (params.search) searchParams.set('search', params.search);
      if (params.role && params.role !== 'all') searchParams.set('role', params.role);
      if (params.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
      const endpoint = `${API_BASE_URL}/user?${searchParams.toString()}`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (response.status === 429) {
        return rejectWithValue('Too many login attempts. Please try again later.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch users');
      }

      const data: FetchUsersResponse = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchParents = createAsyncThunk(
  'userManagement/fetchParents',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      // Fetch only parents with a high limit to get all parents
      const searchParams = new URLSearchParams();
      searchParams.set('role', 'parent');
      searchParams.set('limit', '1000'); // High limit to get all parents
      searchParams.set('page', '1');

      const endpoint = `${API_BASE_URL}/user?${searchParams.toString()}`;

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: getAuthHeaders(token),
      });

      if (response.status === 429) {
        return rejectWithValue('Too many login attempts. Please try again later.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch parents');
      }




      const data: FetchUsersResponse = await response.json();
      return data.data.users; // Return only the users array
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'userManagement/toggleUserStatus',
  async ({ action, role, userId }: { action: 'activate' | 'deactivate'; role: string; userId: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      const response = await fetch(`${API_BASE_URL}/user/status`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ action, role, userId }),
      });

      if(response.status === 429){
        return rejectWithValue('Too many login attempts. Please try again later.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to toggle user status');
      }

      const data = await response.json();
      return { userId, action, role, message: data.message };
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
      state.parents = [];
      state.pagination = null;
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
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.users = [];
        state.pagination = null;
      });

    // Fetch Parents cases
    builder
      .addCase(fetchParents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchParents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.parents = action.payload;
      })
      .addCase(fetchParents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.parents = [];
      });

    // Toggle User Status cases
    builder
      .addCase(toggleUserStatus.pending, (state) => {
        state.isStatusUpdateLoading = true;
        state.error = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.isStatusUpdateLoading = false;
        state.error = null;
        // Update the user's status in the users array
        // Check both user ID and role to ensure we update the correct user
        const userIndex = state.users.findIndex(user => 
          user.id === action.payload.userId && user.role === action.payload.role
        );
        console.log(userIndex, 'userIndex for user:', action.payload.userId, 'role:', action.payload.role);
        if (userIndex !== -1) {
          state.users[userIndex].status = action.payload.action === 'activate' ? 'active' : 'inactive';
        }
        state.successMessage = action.payload.message;
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.isStatusUpdateLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess, resetState } = userManagementSlice.actions;
export default userManagementSlice.reducer;
