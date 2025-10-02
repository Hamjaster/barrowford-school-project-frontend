import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  type CreateLearningRequest, 
  type StudentState,
  type UpdateImpactRequest,
  type UpdateExperienceRequest
} from '@/types';
import { API_BASE_URL } from '@/constants';

const initialState: StudentState = {
  selectedSubject: null,
  selectedYearGroup: null,
  learnings: [],
  images: [],
  impact: null,
  experience: null,
  isLoading: true,
  isSubmitting: false,
  isDeleting : false,
  error: null,
  message : null
};

// Async Thunks
export const fetchStudentLearnings = createAsyncThunk(
  'student/fetchStudentLearnings',
  async (subjectId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/student/learning/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body:JSON.stringify({ subject_id: subjectId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch learnings');
      }

      const data = await response.json();
      return data.data; // Assuming the API returns { success: true, data: [...] }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const createStudentLearning = createAsyncThunk(
  'student/createStudentLearning',
  async (learningData: CreateLearningRequest, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/student/learning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(learningData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to create learning');
      }

      const data = await response.json();
      return data; // Return the created learning data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const deleteStudentLearning = createAsyncThunk(
  'student/deleteStudentLearning',
  async (learningId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/student/learning/${learningId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to delete learning');
      }

      const data = await response.json();
      return data; // Return the deleted learning ID
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Image-related async thunks
export const fetchStudentImages = createAsyncThunk(
  'student/fetchStudentImages',
  async (yearGroupId: number | undefined, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      // Build URL with year_group_id query parameter if provided
      const url = new URL(`${API_BASE_URL}/student/images/me`);
      if (yearGroupId) {
        url.searchParams.append('year_group_id', yearGroupId.toString());
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch images');
      }

      const data = await response.json();
      return data.data; // Assuming the API returns { success: true, data: [...] }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const uploadStudentImage = createAsyncThunk(
  'student/uploadStudentImage',
  async ({ imageUrl, yearGroupId }: { imageUrl: string; yearGroupId?: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/student/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          image_url: imageUrl,
          year_group_id: yearGroupId 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to upload image');
      }

      const data = await response.json();
      return data; // Return the response data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const deleteStudentImage = createAsyncThunk(
  'student/deleteStudentImage',
  async (imageId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/student/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to delete image');
      }

      const data = await response.json();
      return { imageId, ...data }; // Return the deleted image ID and response data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Impact-related async thunks
export const fetchStudentImpact = createAsyncThunk(
  'student/fetchStudentImpact',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/student/impacts/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch impact');
      }

      const data = await response.json();
      return data.data; // Return the impact data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const updateStudentImpact = createAsyncThunk(
  'student/updateStudentImpact',
  async (impactData: UpdateImpactRequest, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/student/impacts`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(impactData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to update impact');
      }

      const data = await response.json();
      return data; // Return the updated impact data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Experience-related async thunks
export const fetchStudentExperience = createAsyncThunk(
  'student/fetchStudentExperience',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/student/experiences/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch experience');
      }

      const data = await response.json();
      return data.data; // Return the experience data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const updateStudentExperience = createAsyncThunk(
  'student/updateStudentExperience',
  async (experienceData: UpdateExperienceRequest, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/student/experiences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(experienceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to update experience');
      }

      const data = await response.json();
      return data; // Return the updated experience data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// 📤 Upload student profile image to Cloudinary
export const uploadStudentProfileImage = createAsyncThunk(
  'userManagement/uploadStudentProfileImage',
  async (file: File, { rejectWithValue }) => {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "your_unsigned_preset"); // 🔁 replace this
      data.append("cloud_name", "YOUR_CLOUD_NAME"); // 🔁 replace this too

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.error?.message || "Image upload failed");
      }

      const result = await res.json();
      return result.secure_url as string;
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);


const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setSelectedSubject: (state, action) => {
      state.selectedSubject = action.payload;
    },
    clearSelectedSubject: (state) => {
      state.selectedSubject = null;
      state.selectedYearGroup = null;
      state.learnings = [];
    },
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
    setSelectedYearGroup: (state, action) => {
      console.log('updating year group', action.payload)
      state.selectedYearGroup = action.payload;
    },
    clearSelectedYearGroup: (state) => {
      state.selectedYearGroup = null;
    },
    clearLearnings: (state) => {
      state.learnings = [];
      state.message = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch learnings cases
    builder
      .addCase(fetchStudentLearnings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentLearnings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.learnings = action.payload;
        state.error = null;
      })
      .addCase(fetchStudentLearnings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Create learning cases
    builder
      .addCase(createStudentLearning.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createStudentLearning.fulfilled, (state, action) => {
        state.isSubmitting = false;
        console.log(action.payload.message, 'Message !')
        state.message = action.payload.message;
        // The new learning is sent for moderation, so we don't need to add it to the array
        state.error = null;
      })
      .addCase(createStudentLearning.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

    // Delete learning cases
    builder
      .addCase(deleteStudentLearning.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteStudentLearning.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.message = action.payload.message;
        // The deleted learning is sent for moderation, so we don't need to remove it from the array
        state.error = null;
      })
      .addCase(deleteStudentLearning.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      })

    // Fetch images cases
    builder
      .addCase(fetchStudentImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.images = action.payload;
        state.error = null;
      })
      .addCase(fetchStudentImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Upload image cases
    builder
      .addCase(uploadStudentImage.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(uploadStudentImage.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.message = action.payload.message;
        // The new image is sent for moderation, so we don't need to add it to the array
        state.error = null;
      })
      .addCase(uploadStudentImage.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

    // Delete image cases
    builder
      .addCase(deleteStudentImage.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteStudentImage.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.message = action.payload.message;
        // The deleted image is sent for moderation, so we don't need to remove it from the array
        state.error = null;
      })
      .addCase(deleteStudentImage.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });

    // Fetch impact cases
    builder
      .addCase(fetchStudentImpact.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentImpact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.impact = action.payload;
        state.error = null;
      })
      .addCase(fetchStudentImpact.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update impact cases
    builder
      .addCase(updateStudentImpact.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateStudentImpact.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.impact = action.payload.data;
        state.message = action.payload.message || 'Impact updated successfully';
        state.error = null;
      })
      .addCase(updateStudentImpact.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // Fetch experience cases
    builder
      .addCase(fetchStudentExperience.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentExperience.fulfilled, (state, action) => {
        state.isLoading = false;
        state.experience = action.payload;
        state.error = null;
      })
      .addCase(fetchStudentExperience.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update experience cases
    builder
      .addCase(updateStudentExperience.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateStudentExperience.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.experience = action.payload.data;
        state.message = action.payload.message || 'Experience updated successfully';
        state.error = null;
      })
      .addCase(updateStudentExperience.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setSelectedSubject, 
  clearSelectedSubject, 
  clearError, 
  clearLearnings,
  clearSelectedYearGroup,
  setSelectedYearGroup,
  clearMessage
} = studentSlice.actions;
export default studentSlice.reducer;
