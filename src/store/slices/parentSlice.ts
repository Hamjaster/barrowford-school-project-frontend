import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../constants';

// Types
export interface ParentChild {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  year_group_id?: number;
  class_id?: number;
  created_at: string;
  status?: string;
}

export interface StudentLearning {
  id: number;
  title: string;
  description: string;
  attachment_url?: string;
  created_at: string;
}

export interface StudentImage {
  id: string;
  image_url: string;
  created_at: string;
}

export interface StudentReflection {
  id: number;
  topic_id: number;
  content: string;
  attachment_url?: string;
  status: string;
  created_at: string;
}

export interface ChildDetails {
  student: ParentChild;
  learnings: StudentLearning[];
  images: StudentImage[];
  reflections: StudentReflection[];
}

export interface ParentState {
  children: ParentChild[];
  selectedChild: ChildDetails | null;
  isLoading: boolean;
  isLoadingChildren: boolean;
  isLoadingChildDetails: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ParentState = {
  children: [],
  selectedChild: null,
  isLoading: false,
  isLoadingChildren: false,
  isLoadingChildDetails: false,
  error: null,
  successMessage: null,
};

// Async thunks
export const fetchMyChildren = createAsyncThunk(
  'parent/fetchMyChildren',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/parent/children`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch children');
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch children');
    }
  }
);

export const fetchChildDetails = createAsyncThunk(
  'parent/fetchChildDetails',
  async (studentId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/parent/children/${studentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch child details');
      }

      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch child details');
    }
  }
);

const parentSlice = createSlice({
  name: 'parent',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearSelectedChild: (state) => {
      state.selectedChild = null;
    },
    setSelectedChild: (state, action: PayloadAction<ChildDetails | null>) => {
      state.selectedChild = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch children
    builder
      .addCase(fetchMyChildren.pending, (state) => {
        state.isLoadingChildren = true;
        state.error = null;
      })
      .addCase(fetchMyChildren.fulfilled, (state, action) => {
        state.isLoadingChildren = false;
        state.children = action.payload;
        state.error = null;
      })
      .addCase(fetchMyChildren.rejected, (state, action) => {
        state.isLoadingChildren = false;
        state.error = action.payload as string;
      });

    // Fetch child details
    builder
      .addCase(fetchChildDetails.pending, (state) => {
        state.isLoadingChildDetails = true;
        state.error = null;
      })
      .addCase(fetchChildDetails.fulfilled, (state, action) => {
        state.isLoadingChildDetails = false;
        state.selectedChild = action.payload;
        state.error = null;
      })
      .addCase(fetchChildDetails.rejected, (state, action) => {
        state.isLoadingChildDetails = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccessMessage, clearSelectedChild, setSelectedChild } = parentSlice.actions;
export default parentSlice.reducer;
