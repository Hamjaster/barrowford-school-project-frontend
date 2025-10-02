import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { API_BASE_URL } from '@/constants';
import { type Topic, type PersonalSection } from "@/types";
import { type RootState } from "..";

// Initial state
const initialState: {
  topics: Topic[];
  personalSections: PersonalSection[];
  loading: boolean;
  error: string | null;
  addTopicLoading : boolean;
  updateTopicLoading : boolean;
  deleteTopicLoading : boolean;
  toggleStatusLoading: boolean;
  personalSectionLoading: boolean;
  personalSectionSubmitting: boolean;
  message : string | null;
} = {
  topics: [],
  personalSections: [],
  loading: false,
  error: null,
  addTopicLoading : false,
    updateTopicLoading : false,
    deleteTopicLoading : false,
    toggleStatusLoading: false,
    personalSectionLoading: true,
    personalSectionSubmitting: false,
    message : null,
};

// Helper function to get auth headers
const getAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`,
});

// ✅ Create Topic
export const createTopic = createAsyncThunk<
  Topic,
  { title: string;description?: string },
  { rejectValue: string; state: RootState }
>(
  "student/createTopic",
  async ({ title,description  }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      
      const body: Record<string, any> = { title };
      if (description?.trim()) {
        body.description = description.trim();
      }
      const response = await fetch(`${API_BASE_URL}/personalSection/topics`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ title,description  }),
      });

      if (response.status === 429) {
        return rejectWithValue("Too many requests. Please try again later.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to create topic");
      }

      return (await response.json()).data as Topic;
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

      return (await response.json()).data as Topic[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// ✅ Get All Topics (Including inactive - for staff management)
export const fetchAllTopics = createAsyncThunk<
  Topic[],
  void,
  { rejectValue: string; state: RootState }
>(
  "personalSection/fetchAllTopics",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/personalSection/topics/all`, {
        method: "GET",
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to fetch all topics");
      }

      return (await response.json()).data as Topic[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// ✅ Update Topic
export const updateTopic = createAsyncThunk<
  Topic,
  { id: number; title: string;description?: string },
  { rejectValue: string; state: RootState }
>(
  "student/updateTopic",
  async ({ id, title ,description }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      const body: Record<string, any> = { title };
      if (description?.trim()) {
        body.description = description.trim();
      }
      const response = await fetch(`${API_BASE_URL}/personalSection/topics/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ title,description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to update topic");
      }

      return (await response.json()).data as Topic;
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

// ✅ Toggle Topic Status
export const toggleTopicStatus = createAsyncThunk<
  Topic,
  { id: number; status: 'active' | 'inactive' },
  { rejectValue: string; state: RootState }
>(
  "personalSection/toggleTopicStatus",
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/personalSection/topics/status/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to toggle topic status");
      }

      return (await response.json()).data as Topic;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// ✅ Get My Personal Sections
export const getMyPersonalSections = createAsyncThunk<
  PersonalSection[],
  void,
  { rejectValue: string; state: RootState }
>(
  "personalSection/getMyPersonalSections",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/personalSection/me`, {
        method: "GET",
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to fetch personal sections");
      }

      return (await response.json()).data as PersonalSection[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// ✅ Get Personal Section by Topic
export const getPersonalSectionByTopic = createAsyncThunk<
  PersonalSection | null,
  { topicId: number },
  { rejectValue: string; state: RootState }
>(
  "personalSection/getPersonalSectionByTopic",
  async ({ topicId }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/personalSection/me/${topicId}`, {
        method: "GET",
        headers: getAuthHeaders(token),
      });

      if (response.status === 404) {
        // No personal section exists for this topic yet
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to fetch personal section");
      }

      return (await response.json()).data as PersonalSection;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// ✅ Create Personal Section
export const createPersonalSection = createAsyncThunk<
  PersonalSection,
  { topicId: number; content: string },
  { rejectValue: string; state: RootState }
>(
  "personalSection/createPersonalSection",
  async ({ topicId, content }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/personalSection`, {
        method: "POST",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ topic_id: topicId, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to create personal section");
      }

      return (await response.json()).data as PersonalSection;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// ✅ Update Personal Section
export const updatePersonalSection = createAsyncThunk<
  PersonalSection,
  { id: number; content: string },
  { rejectValue: string; state: RootState }
>(
  "personalSection/updatePersonalSection",
  async ({ id, content }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/personalSection/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to update personal section");
      }

      return (await response.json()).data as PersonalSection;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

const personalSectionSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Create Topic
    builder
      .addCase(createTopic.pending, (state) => {
        state.addTopicLoading = true;
        state.error = null;
      })
      .addCase(createTopic.fulfilled, (state, action: PayloadAction<Topic>) => {
        state.addTopicLoading = false;
        state.topics.push(action.payload);
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.addTopicLoading = false;
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

    // Fetch All Topics (for staff management)
    builder
      .addCase(fetchAllTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTopics.fulfilled, (state, action: PayloadAction<Topic[]>) => {
        state.loading = false;
        state.topics = action.payload;
      })
      .addCase(fetchAllTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Topic
    builder
      .addCase(updateTopic.pending, (state) => {
        state.updateTopicLoading = true;
        state.error = null;
      })
      .addCase(updateTopic.fulfilled, (state, action: PayloadAction<Topic>) => {
        state.updateTopicLoading = false;
        const index = state.topics.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.topics[index] = action.payload;
        }
      })
      .addCase(updateTopic.rejected, (state, action) => {
        state.updateTopicLoading = false;
        state.error = action.payload as string;
      });

    // Delete Topic
    builder
      .addCase(deleteTopic.pending, (state) => {
        state.deleteTopicLoading = true;
        state.error = null;
      })
      .addCase(deleteTopic.fulfilled, (state, action: PayloadAction<number>) => {
        state.deleteTopicLoading = false;
        state.topics = state.topics.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTopic.rejected, (state, action) => {
        state.deleteTopicLoading = false;
        state.error = action.payload as string;
      });

    // Toggle Topic Status
    builder
      .addCase(toggleTopicStatus.pending, (state) => {
        state.toggleStatusLoading = true;
        state.error = null;
      })
      .addCase(toggleTopicStatus.fulfilled, (state, action: PayloadAction<Topic>) => {
        state.toggleStatusLoading = false;
        const index = state.topics.findIndex(topic => topic.id === action.payload.id);
        if (index !== -1) {
          state.topics[index] = action.payload;
        }
      })
      .addCase(toggleTopicStatus.rejected, (state, action) => {
        state.toggleStatusLoading = false;
        state.error = action.payload as string;
      });

    // Get My Personal Sections
    builder
      .addCase(getMyPersonalSections.pending, (state) => {
        state.personalSectionLoading = true;
        state.error = null;
      })
      .addCase(getMyPersonalSections.fulfilled, (state, action: PayloadAction<PersonalSection[]>) => {
        state.personalSectionLoading = false;
        state.personalSections = action.payload;
      })
      .addCase(getMyPersonalSections.rejected, (state, action) => {
        state.personalSectionLoading = false;
        state.error = action.payload as string;
      });

    // Get Personal Section by Topic
    builder
      .addCase(getPersonalSectionByTopic.pending, (state) => {
        state.personalSectionLoading = true;
        state.error = null;
      })
      .addCase(getPersonalSectionByTopic.fulfilled, (state, action: PayloadAction<PersonalSection | null>) => {
        state.personalSectionLoading = false;
        if (action.payload) {
          const existingIndex = state.personalSections.findIndex(ps => ps.id === action.payload!.id);
          if (existingIndex !== -1) {
            state.personalSections[existingIndex] = action.payload!;
          } else {
            state.personalSections.push(action.payload!);
          }
        }
      })
      .addCase(getPersonalSectionByTopic.rejected, (state, action) => {
        state.personalSectionLoading = false;
        state.error = action.payload as string;
      });

    // Create Personal Section
    builder
      .addCase(createPersonalSection.pending, (state) => {
        state.personalSectionSubmitting = true;
        state.error = null;
      })
      .addCase(createPersonalSection.fulfilled, (state, action: PayloadAction<PersonalSection>) => {
        state.personalSectionSubmitting = false;
        state.personalSections.push(action.payload);
        state.message = "Personal section created successfully";
      })
      .addCase(createPersonalSection.rejected, (state, action) => {
        state.personalSectionSubmitting = false;
        state.error = action.payload as string;
      });

    // Update Personal Section
    builder
      .addCase(updatePersonalSection.pending, (state) => {
        state.personalSectionSubmitting = true;
        state.error = null;
      })
      .addCase(updatePersonalSection.fulfilled, (state, action: PayloadAction<PersonalSection>) => {
        state.personalSectionSubmitting = false;
        const index = state.personalSections.findIndex(ps => ps.id === action.payload.id);
        if (index !== -1) {
          state.personalSections[index] = action.payload;
        } else {
          state.message = "Personal section updated successfully";
          state.personalSections.push(action.payload);
        }
      })
      .addCase(updatePersonalSection.rejected, (state, action) => {
        state.personalSectionSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export default personalSectionSlice.reducer;

export const { 
  
  clearError, 

  clearMessage
} = personalSectionSlice.actions;
