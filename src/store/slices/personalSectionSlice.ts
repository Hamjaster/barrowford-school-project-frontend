import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { API_BASE_URL } from '@/constants';
import { type Topic, type StudentState } from "@/types";
import { type RootState } from "..";

// Initial state
const initialState: StudentState = {
  topics: [],
  loading: false,
  error: null,
};

// Helper function to get auth headers
const getAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`,
});

// ✅ Create Topic
export const createTopic = createAsyncThunk<
  Topic,
  { title: string },
  { rejectValue: string; state: RootState }
>(
  "student/createTopic",
  async ({ title }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/personalSection/me`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ title }),
      });

      if (response.status === 429) {
        return rejectWithValue("Too many requests. Please try again later.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to create topic");
      }

      return (await response.json()) as Topic;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// ✅ Fetch All Topics
export const fetchTopics = createAsyncThunk<
  Topic[],
  void,
  { rejectValue: string; state: RootState }
>(
  "student/fetchTopics",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/personalSection/topics`, {
        method: "GET",
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to fetch topics");
      }

      return (await response.json()) as Topic[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// ✅ Update Topic
export const updateTopic = createAsyncThunk<
  Topic,
  { id: number; title: string },
  { rejectValue: string; state: RootState }
>(
  "student/updateTopic",
  async ({ id, title }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/personalSection/topics/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to update topic");
      }

      return (await response.json()) as Topic;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// ✅ Delete Topic
export const deleteTopic = createAsyncThunk<
  number, // we’ll return just the deleted ID
  { id: number },
  { rejectValue: string; state: RootState }
>(
  "student/deleteTopic",
  async ({ id }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/personalSection/topics/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to delete topic");
      }

      return id; // return deleted topic id
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create Topic
    builder
      .addCase(createTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTopic.fulfilled, (state, action: PayloadAction<Topic>) => {
        state.loading = false;
        state.topics.push(action.payload);
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Topics
    builder
      .addCase(fetchTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopics.fulfilled, (state, action: PayloadAction<Topic[]>) => {
        state.loading = false;
        state.topics = action.payload;
      })
      .addCase(fetchTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Topic
    builder
      .addCase(updateTopic.fulfilled, (state, action: PayloadAction<Topic>) => {
        state.loading = false;
        const index = state.topics.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.topics[index] = action.payload;
        }
      });

    // Delete Topic
    builder
      .addCase(deleteTopic.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.topics = state.topics.filter((t) => t.id !== action.payload);
      });
  },
});

export default studentSlice.reducer;
