import { API_BASE_URL } from '@/constants';
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

// Types
export interface ModerationItem {
  id: number;
  student_id: number;
  year_group_id: number;
  class_id: number;
  entity_type: 'reflection' | 'studentimages' | 'studentlearningentities';
  entity_title: string;
  action_type: 'create' | 'update' | 'delete';
  entity_id?: number;
  old_content?: any;
  new_content?: any;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  moderated_at?: string;
  rejection_reason?: string;
  // Additional fields for display
  student_name?: string;
  content_preview?: string;
  attachment_url?: string;
}

interface ModerationState {
  moderations: ModerationItem[];
  loading: boolean;
  error: string | null;
  approving: { [key: number]: boolean };
  rejecting: { [key: number]: boolean };
}

const initialState: ModerationState = {
  moderations: [],
  loading: false,
  error: null,
  approving: {},
  rejecting: {},
};

// Async thunks
export const fetchModerations = createAsyncThunk(
  'moderation/fetchModerations',
  async (_, { rejectWithValue }) => {
    try {
        const response = await fetch(`${API_BASE_URL}/moderation`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch moderations');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const approveModeration = createAsyncThunk(
  'moderation/approveModeration',
  async (moderationId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/moderation/${moderationId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve moderation');
      }

      const data = await response.json();
      return { moderationId, data: data.data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const rejectModeration = createAsyncThunk(
  'moderation/rejectModeration',
  async ({ moderationId, reason }: { moderationId: number; reason?: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/moderation/${moderationId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject moderation');
      }

      const data = await response.json();
      return { moderationId, data: data.data };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const moderationSlice = createSlice({
  name: 'moderation',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearModerations: (state) => {
      state.moderations = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch moderations
    builder
      .addCase(fetchModerations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModerations.fulfilled, (state, action: PayloadAction<ModerationItem[]>) => {
        state.loading = false;
        state.moderations = action.payload;
      })
      .addCase(fetchModerations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Approve moderation
    builder
      .addCase(approveModeration.pending, (state, action) => {
        state.approving[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(approveModeration.fulfilled, (state, action) => {
        state.approving[action.payload.moderationId] = false;
        // Remove the approved moderation from the list
        state.moderations = state.moderations.filter(
          (mod) => mod.id !== action.payload.moderationId
        );
      })
      .addCase(approveModeration.rejected, (state, action) => {
        state.approving[action.meta.arg] = false;
        state.error = action.payload as string;
      });

    // Reject moderation
    builder
      .addCase(rejectModeration.pending, (state, action) => {
        state.rejecting[action.meta.arg.moderationId] = true;
        state.error = null;
      })
      .addCase(rejectModeration.fulfilled, (state, action) => {
        state.rejecting[action.payload.moderationId] = false;
        // Remove the rejected moderation from the list
        state.moderations = state.moderations.filter(
          (mod) => mod.id !== action.payload.moderationId
        );
      })
      .addCase(rejectModeration.rejected, (state, action) => {
        state.rejecting[action.meta.arg.moderationId] = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearModerations } = moderationSlice.actions;
export default moderationSlice.reducer;
