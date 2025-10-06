import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { API_BASE_URL } from '@/constants';
import { type RootState } from "..";
import type  { ReflectionTopic, ReflectionState,ReflectionItem,
  UpdateReflectionPayload,AddCommentRequest,ReflectionComment } from '@/types'

// Types for previous weeks API
interface PreviousWeeksResponse {
  currentWeek: string;
  previousWeeks: string[];
  totalPreviousWeeks: number;
}


// Helper function to get auth headers
const getAuthHeaders = (token: string) => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`,
});

const initialState: ReflectionState = {
  topics: [],
  activeTitles: [],  
  comments:[],
  reflections:[],
  loading: false,
  fetchreflectionsloading:false,
  postingCommentLoading : false,
  error: null,
  message: null,
  previousWeeks: null,
};


export const createTopic = createAsyncThunk<
  ReflectionTopic,
  { title: string },
  { rejectValue: string; state: RootState }
>(
  "reflection/createtopics",
  async ({ title }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/reflection/createtopics`, {
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

      return (await response.json()).data as ReflectionTopic;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const fetchAllTopics = createAsyncThunk<
  ReflectionTopic[],
  void,
  { rejectValue: string; state: RootState }
>(
  "reflection/fetchAllTopics",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/reflection/topics`, {
        method: "GET",
        headers: getAuthHeaders(token),
      });

      if (response.status === 429) {
        return rejectWithValue("Too many requests. Please try again later.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to fetch topics");
      }

      const result = await response.json();
      return result.data as ReflectionTopic[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const updateTopic = createAsyncThunk<
  ReflectionTopic,
  { id: string; title: string; is_active?: boolean },
  { rejectValue: string; state: RootState }
>(
  "reflection/updateTopic",
  async ({ id, title, is_active }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/reflection/topics/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(token),
        body: JSON.stringify({ title, is_active }),
      });

      if (response.status === 429) {
        return rejectWithValue("Too many requests. Please try again later.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to update topic");
      }

      const result = await response.json();
      return result.data as ReflectionTopic;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const deleteTopic = createAsyncThunk<
  { topicId: string },
  string,
  { rejectValue: string; state: RootState }
>(
  "reflection/deleteTopic",
  async (topicId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/reflection/topics/${topicId}`, {
        method: "DELETE",
        headers: getAuthHeaders(token),
      });

      if (response.status === 429) {
        return rejectWithValue("Too many requests. Please try again later.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to delete topic");
      }

      return { topicId };
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const fetchActiveTopics = createAsyncThunk<
  { id: string; title: string }[], // return array of objects
  void,
  { state: RootState; rejectValue: string }
>(
  "reflection/activeTopics",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/reflection/activeTopics`, {
        method: "GET",
        headers: getAuthHeaders(token),
      });

      if (response.status === 429) {
        return rejectWithValue("Too many requests. Please try again later.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to fetch active topics");
      }

      // Parse JSON
      const result: { success: boolean; data: { id: string; title: string }[] } =
        await response.json();

      // Return the full objects (id + title)
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

//createReflection thunk
export const createReflection = createAsyncThunk<
  { message: string; data: { reflection: ReflectionItem; moderation: any } }, // Updated return type for new system
  { topicID: string; content: string; attachmentUrl?: string; selectedWeek?: string },
  { state: RootState; rejectValue: string }
>(
  "reflection/createreflection",
  async ({ topicID, content, attachmentUrl, selectedWeek }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      if(!topicID){
        console.log("no topic id found")
      }
      
      // Build JSON payload instead of FormData
      const payload = {
        topicID,
        content,
        attachmentUrl: attachmentUrl || "",
        selectedWeek: selectedWeek || ""
      };

      console.log("payload in frontend", payload)

      const response = await fetch(`${API_BASE_URL}/reflection/createreflection`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 429) {
        return rejectWithValue("Too many requests. Please try again later.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to create reflection");
      }

      const result = await response.json();
      return {
        message: result.message,
        data: result.data
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

//delete thunk 
export const deleteReflection = createAsyncThunk<
  { reflectionId: string }, // returned data
  string, // reflectionId to delete
  { state: RootState; rejectValue: string }
>(
  "reflection/deleteReflection",
  async (reflectionId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/reflection/${reflectionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // only authorization header
        },
      });

      if (response.status === 429) {
        return rejectWithValue("Too many requests. Please try again later.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to delete reflection");
      }

      return { reflectionId }; // return deleted reflection ID
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Student request to delete reflection (creates moderation request)
export const requestDeleteReflection = createAsyncThunk<
  { message: string; data: { updatedReflection: ReflectionItem; moderation: any } },
  string, // reflectionId to delete
  { state: RootState; rejectValue: string }
>(
  "reflection/requestDeleteReflection",
  async (reflectionId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/reflection/student/${reflectionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 429) {
        return rejectWithValue("Too many requests. Please try again later.");
      }

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to request reflection deletion");
      }

      const result = await response.json();
      return {
        message: result.message,
        data: result.data
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);
// Async thunk
export const fetchReflectionsByStudentId = createAsyncThunk<
  ReflectionItem[], // return type
  number,           // argument type (student_id)
  { state: RootState; rejectValue: string }
>(
  "reflections/fetchByStudentId",
  async (studentId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

 const response = await fetch(`${API_BASE_URL}/reflection/${studentId}`, {
  method: "GET",
  headers: getAuthHeaders(token),
});

      let result: any;
      try {
        result = await response.json();
      } catch {
        return rejectWithValue("Invalid JSON response");
      }

      if (!response.ok) {
        return rejectWithValue(result?.error || "Failed to fetch reflections");
      }

      return result.data as ReflectionItem[];
    } catch (err: any) {
      return rejectWithValue("Network error");
    }
  }
);

export const fetchAllReflections = createAsyncThunk<
  ReflectionItem[], // Return type
  void, // No argument needed
  { state: RootState, rejectValue: string }
>(
  "reflection/fetchAll",
  async (_, { rejectWithValue,getState }) => {
    try {

      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/reflection/all`, {
        method: "GET",
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to fetch reflections");
      }

      const result = await response.json();
      return result.data as ReflectionItem[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const fetchMyReflections = createAsyncThunk<
  ReflectionItem[], // Return type
  void, // No argument needed
  { state: RootState, rejectValue: string }
>(
  "reflection/my",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/reflection/my`, {
        method: "GET",
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to fetch reflections");
      }

      const result = await response.json();
      return result.data as ReflectionItem[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

// Refresh reflections after moderation changes
export const refreshMyReflections = createAsyncThunk<
  ReflectionItem[], // Return type
  void, // No argument needed
  { state: RootState, rejectValue: string }
>(
  "reflection/refreshMy",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/reflection/my`, {
        method: "GET",
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to refresh reflections");
      }

      const result = await response.json();
      return result.data as ReflectionItem[];
    } catch (error: any) {
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const updateReflection = createAsyncThunk<
  ReflectionItem,          // Return type
  UpdateReflectionPayload, // Arg type
  { state: RootState; rejectValue: string }
>(
  "reflection/update",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/reflection/update`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders(token),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return rejectWithValue("Update failed");
      }

      const data = await response.json();

      return data.data; 
    } catch (err) {
      console.error(" updateReflection error", err);
      return rejectWithValue("Failed updating reflection");
    }
  }
);


// Async thunk
export const addComment = createAsyncThunk<
  {data: ReflectionComment, reflectionId: number},         // return type
  AddCommentRequest,          // payload type
  {state:RootState, rejectValue: string }     // error type
>(
  "reflection/addcomment",
  async ({ reflectionId, content }, { rejectWithValue,getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;

      if (!token) {
        return rejectWithValue("No authentication token found");
      }
    //http://localhost:3000/api/reflection/addcomment
      const response = await fetch(`${API_BASE_URL}/reflection/addcomment`, {
        method: "POST",
        headers:getAuthHeaders(token),
        body: JSON.stringify({reflectionId, content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to add comment");
      }

       const result: {  data: ReflectionComment } = await response.json();
      return {data : result.data, reflectionId};
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

export const fetchComments = createAsyncThunk<
  ReflectionComment[], 
  number,         
  { state: RootState; rejectValue: string }
>(
  "reflection/comment",
  async (reflectionId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) return rejectWithValue("No authentication token found");
     
     
      const response = await fetch(
        `${API_BASE_URL}/reflection/comment/${reflectionId}`,
        {
          method: "GET",
          headers: getAuthHeaders(token),
        }
      ); 

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to fetch comments");
      }

      const result: {  data: ReflectionComment[] } = await response.json();
      return result.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

// Fetch previous weeks for reflection creation
export const fetchPreviousWeeks = createAsyncThunk<
  PreviousWeeksResponse,
  void,
  { state: RootState; rejectValue: string }
>(
  "reflection/fetchPreviousWeeks",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      if (!token) return rejectWithValue("No authentication token found");

      const response = await fetch(`${API_BASE_URL}/reflection/weeks/previous`, {
        method: "GET",
        headers: getAuthHeaders(token),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || "Failed to fetch previous weeks");
      }

      const result: { success: boolean; data: PreviousWeeksResponse } = await response.json();
      return result.data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);



const reflectionSlice = createSlice({
  name: "reflection",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
   
  },
  extraReducers: (builder) => {
    // --- createTopic handlers ---
    builder
      .addCase(createTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.topics.push(action.payload);
      })
      .addCase(createTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create topic";
      });

    // --- fetchAllTopics handlers ---
    builder
      .addCase(fetchAllTopics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = action.payload;
      })
      .addCase(fetchAllTopics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch topics";
      });

    // --- updateTopic handlers ---
    builder
      .addCase(updateTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTopic.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTopic = action.payload;
        state.topics = state.topics.map((topic) =>
          topic.id === updatedTopic.id ? updatedTopic : topic
        );
      })
      .addCase(updateTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update topic";
      });

    // --- deleteTopic handlers ---
    builder
      .addCase(deleteTopic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTopic.fulfilled, (state, action) => {
        state.loading = false;
        state.topics = state.topics.filter(
          (topic) => topic.id.toString() !== action.payload.topicId
        );
      })
      .addCase(deleteTopic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete topic";
      });

    // --- fetchActiveTopics handlers ---
    builder
      .addCase(fetchActiveTopics.pending, (state) => {
        state.loading = true;
        state.activeTitles = []
        state.error = null;
      })
      .addCase(fetchActiveTopics.fulfilled, (state, action) => {
        state.loading = false;
        state.activeTitles = action.payload; // [{id, title}]
      })
      .addCase(fetchActiveTopics.rejected, (state, action) => {
        state.loading = false;
        state.activeTitles = []
        state.error = action.payload || "Failed to fetch active topics";
      });
  builder
  .addCase(fetchComments.pending, (state) => {
    state.postingCommentLoading = true;
    state.comments = [];
    state.error = null;
  })
  .addCase(fetchComments.fulfilled, (state, action) => {
    state.postingCommentLoading = false;
    state.comments = action.payload
  })
  .addCase(fetchComments.rejected, (state, action) => {
    state.postingCommentLoading = false;
    state.comments = [];
    state.error = action.payload || "Failed to fetch comments";
  });

  builder
    .addCase(addComment.pending, (state) => {
    
      state.error = null;
      state.postingCommentLoading = true;
    })
    .addCase(addComment.fulfilled, (state, action) => {

  const newComment = action.payload.data;

  if (!newComment || !newComment.id) {
    console.error("Invalid comment returned");
    return;
  }

  console.log(newComment, 'new comment uploaded to BE')
  const reflectionId = action.payload.reflectionId;
  // Push the new comment into the global comments array
  state.comments.push(newComment);
  state.postingCommentLoading = false;

  // add the newComment to reflectioncomments of that specific reflection
  state.reflections = state.reflections.map((reflection) =>
      reflection.id === reflectionId ? { ...reflection, reflection_comments: [...reflection.reflection_comments, newComment] } : reflection
  );


})
    .addCase(addComment.rejected, (state, action) => {
    
      state.error = action.payload || "Something went wrong";
      state.postingCommentLoading = false;
    });
//for fetching student 
 builder
      .addCase(fetchReflectionsByStudentId.pending, (state) => {
        state.loading = true;
        state.reflections = []
        state.error = null;
      })
      .addCase(
        fetchReflectionsByStudentId.fulfilled,
        (state, action: PayloadAction<ReflectionItem[]>) => {
          state.loading = false;
          state.reflections = action.payload;
        }
      )
      .addCase(fetchReflectionsByStudentId.rejected, (state, action) => {
        state.loading = false;
         state.reflections = []
        state.error = action.payload || "Something went wrong";
      });
    // --- createReflection handlers ---
    builder
      .addCase(createReflection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReflection.fulfilled, (state, action) => {
         state.loading = false;
        // Add the new reflection to the array with pending status
        if (action.payload.data?.reflection) {
          state.reflections.push(action.payload.data.reflection);
        }
      })
      .addCase(createReflection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create reflection";
      });

    // --- fetchAllReflections handlers ---
  builder
  .addCase(fetchAllReflections.pending, (state) => {
    state.fetchreflectionsloading = true;
    state.reflections = []
    state.error = null;
  })
  .addCase(fetchAllReflections.fulfilled, (state, action) => {
    state.fetchreflectionsloading = false;
    state.reflections = action.payload; // <-- store reflections separately
  })
  .addCase(fetchAllReflections.rejected, (state, action) => {
    state.fetchreflectionsloading = false;
    state.reflections = []
    state.error = action.payload || "Failed to fetch reflections";
  });
  //fetch student reflection 
    builder
  .addCase(fetchMyReflections.pending, (state) => {
    state.fetchreflectionsloading = true;
    state.reflections = []
    state.error = null;
  })
  .addCase(fetchMyReflections.fulfilled, (state, action) => {
    state.fetchreflectionsloading = false;
    state.reflections = action.payload; // <-- store reflections separately
  })
  .addCase(fetchMyReflections.rejected, (state, action) => {
    state.fetchreflectionsloading = false;
    state.reflections = []
    state.error = action.payload || "Failed to fetch reflections";
  });

  // Refresh reflections cases
  builder
  .addCase(refreshMyReflections.pending, (state) => {
    state.fetchreflectionsloading = true;
    state.error = null;
  })
  .addCase(refreshMyReflections.fulfilled, (state, action) => {
    state.fetchreflectionsloading = false;
    state.reflections = action.payload;
    state.error = null;
  })
  .addCase(refreshMyReflections.rejected, (state, action) => {
    state.fetchreflectionsloading = false;
    state.error = action.payload || "Failed to refresh reflections";
  });
  //for update
builder
    // pending
      .addCase(updateReflection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // fulfilled
        .addCase(updateReflection.fulfilled, (state, action) => {
          state.loading = false;

          const updated = action.payload;

          if (!updated || !updated.id) {
            console.error("⚠️ updateReflection returned invalid payload:", updated);
            return;
          }

          state.reflections = state.reflections.map((r) =>
            r.id === updated.id ? updated : r
          );
        })

      // rejected
      .addCase(updateReflection.rejected, (state) => {
        state.loading = false;
        state.error =  "Failed to update reflection";
      });
      //for delete 
       builder
      .addCase(deleteReflection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReflection.fulfilled, (state, action: PayloadAction<{ reflectionId: string }>) => {
        state.loading = false;
        state.reflections = state.reflections.filter(
          (r) => r.id !== action.payload.reflectionId
        );
      })
      .addCase(deleteReflection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete reflection";
      });

    // --- requestDeleteReflection handlers ---
    builder
      .addCase(requestDeleteReflection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestDeleteReflection.fulfilled, (state, action) => {
        state.loading = false;
        // Update the reflection status to pending_deletion in the array
        if (action.payload.data?.updatedReflection) {
          const reflectionIndex = state.reflections.findIndex(r => r.id === action.payload.data.updatedReflection.id);
          if (reflectionIndex !== -1) {
            state.reflections[reflectionIndex] = action.payload.data.updatedReflection;
          }
        }
      })
      .addCase(requestDeleteReflection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to request reflection deletion";
      });

    // --- fetchPreviousWeeks handlers ---
    builder
      .addCase(fetchPreviousWeeks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPreviousWeeks.fulfilled, (state, action) => {
        state.loading = false;
        state.previousWeeks = action.payload;
      })
      .addCase(fetchPreviousWeeks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch previous weeks";
      });
  },
});
    


export const { clearError } = reflectionSlice.actions;


export default reflectionSlice.reducer;

