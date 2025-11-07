import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  type CreateLearningRequest, 
  type StudentState,
  type CreateImpactRequest,
  type CreateExperienceRequest,
  type UpdateImpactRequest,
  type UpdateExperienceRequest
} from '@/types';
import { API_BASE_URL } from '@/constants';
import { extractErrorMessage } from '@/lib/utils';

const initialState: StudentState = {
  selectedSubject: null,
  selectedYearGroup: null,
  selectedYearGroupForImpacts: null,
  selectedYearGroupForExperiences: null,
  learnings: [],
  images: [],
  impacts: [],
  experiences: [],
  isLoading: true,
  isSubmitting: false,
  isDeleting : false,
  error: null,
  message : null,
  studentDetails: null,
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
        return rejectWithValue(extractErrorMessage(errorData, 'Failed to fetch learnings'));
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
        return rejectWithValue(extractErrorMessage(errorData, 'Failed to create learning'));
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
        return rejectWithValue(extractErrorMessage(errorData, 'Failed to delete learning'));
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
        return rejectWithValue(extractErrorMessage(errorData, 'Failed to fetch images'));
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
        return rejectWithValue(extractErrorMessage(errorData, 'Failed to upload image'));
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
        return rejectWithValue(extractErrorMessage(errorData, 'Failed to delete image'));
      }

      const data = await response.json();
      return { imageId, ...data }; // Return the deleted image ID and response data
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Refresh images after moderation changes
export const refreshStudentImages = createAsyncThunk(
  'student/refreshStudentImages',
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
        return rejectWithValue(extractErrorMessage(errorData, 'Failed to refresh images'));
      }

      const data = await response.json();
      return data.data; // Return the updated images array
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Impact-related async thunks
export const fetchStudentImpacts = createAsyncThunk(
  'student/fetchStudentImpacts',
  async (yearGroupId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/student/impacts/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ year_group_id: yearGroupId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(extractErrorMessage(errorData, 'Failed to fetch impacts'));
      }

      const data = await response.json();
      return data.data; // Return the impacts array
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const createStudentImpact = createAsyncThunk(
  'student/createStudentImpact',
  async ({ impactData, yearGroupId }: { impactData: CreateImpactRequest; yearGroupId: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/student/impacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...impactData, year_group_id: yearGroupId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(extractErrorMessage(errorData, 'Failed to create impact'));
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const deleteStudentImpact = createAsyncThunk(
  'student/deleteStudentImpact',
  async (impactId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/student/impacts/${impactId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(extractErrorMessage(errorData, 'Failed to delete impact'));
      }

      const data = await response.json();
      return { impactId, ...data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Experience-related async thunks
export const fetchStudentExperiences = createAsyncThunk(
  'student/fetchStudentExperiences',
  async (yearGroupId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/student/experiences/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ year_group_id: yearGroupId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(extractErrorMessage(errorData, 'Failed to fetch experiences'));
      }

      const data = await response.json();
      return data.data; // Return the experiences array
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const createStudentExperience = createAsyncThunk(
  'student/createStudentExperience',
  async ({ experienceData, yearGroupId }: { experienceData: CreateExperienceRequest; yearGroupId: number }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/student/experiences/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...experienceData, year_group_id: yearGroupId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(extractErrorMessage(errorData, 'Failed to create experience'));
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const deleteStudentExperience = createAsyncThunk(
  'student/deleteStudentExperience',
  async (experienceId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/student/experiences/${experienceId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(extractErrorMessage(errorData, 'Failed to delete experience'));
      }

      const data = await response.json();
      return { experienceId, ...data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Legacy thunks for backward compatibility (can be removed later)
export const fetchStudentImpact = fetchStudentImpacts;
export const fetchStudentExperience = fetchStudentExperiences;
export const updateStudentImpact = createAsyncThunk(
  'student/updateStudentImpact',
  async (impactData: UpdateImpactRequest, { rejectWithValue }) => {
    return rejectWithValue('This endpoint is deprecated. Use createStudentImpact instead.');
  }
);
export const updateStudentExperience = createAsyncThunk(
  'student/updateStudentExperience',
  async (experienceData: UpdateExperienceRequest, { rejectWithValue }) => {
    return rejectWithValue('This endpoint is deprecated. Use createStudentExperience instead.');
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
        return rejectWithValue(extractErrorMessage(errorData, "Image upload failed"));
      }

      const result = await res.json();
      return result.secure_url as string;
    } catch (err: any) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

// 📚 Fetch full student details
export const fetchStudentDetails = createAsyncThunk(
  'student/fetchStudentDetails',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/student/details/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
     
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData, "ERROR DATA")
        return rejectWithValue(extractErrorMessage(errorData, 'Failed to fetch student details'));
      }

      const data = await response.json();
      console.log("✅ Parsed data:", data);
      return data.data;
    } catch (error: any) {
      console.log(error, 'errorrr')
      return rejectWithValue(error.message || 'Network error');
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
    setSelectedYearGroupForImpacts: (state, action) => {
      state.selectedYearGroupForImpacts = action.payload;
    },
    clearSelectedYearGroupForImpacts: (state) => {
      state.selectedYearGroupForImpacts = null;
      state.impacts = [];
    },
    setSelectedYearGroupForExperiences: (state, action) => {
      state.selectedYearGroupForExperiences = action.payload;
    },
    clearSelectedYearGroupForExperiences: (state) => {
      state.selectedYearGroupForExperiences = null;
      state.experiences = [];
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
      .addCase(fetchStudentDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.studentDetails = action.payload; // ✅ Save to state
        state.error = null;
      })
      .addCase(fetchStudentDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.studentDetails = null;
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
        // Add the new learning to the beginning of the array with pending status
        if (action.payload.data) {
          state.learnings.unshift(action.payload.data);
        }
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
        // Update the learning status to pending_deletion in the array
        if (action.payload.data) {
          const learningIndex = state.learnings.findIndex(learning => learning.id === action.payload.data.id);
          if (learningIndex !== -1) {
            state.learnings[learningIndex] = action.payload.data;
          }
        }
        state.error = null;
      })
      .addCase(deleteStudentLearning.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      })

    // Fetch impacts cases
    builder
      .addCase(fetchStudentImpacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentImpacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.impacts = action.payload;
        state.error = null;
      })
      .addCase(fetchStudentImpacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Create impact cases
    builder
      .addCase(createStudentImpact.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createStudentImpact.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.message = action.payload.message;
        // Add the new impact to the beginning of the array with pending status
        if (action.payload.data) {
          state.impacts.unshift(action.payload.data);
        }
        state.error = null;
      })
      .addCase(createStudentImpact.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

    // Delete impact cases
    builder
      .addCase(deleteStudentImpact.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteStudentImpact.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.message = action.payload.message;
        // Update the impact status to pending_deletion in the array
        if (action.payload.data) {
          const impactIndex = state.impacts.findIndex(impact => impact.id === action.payload.data.id);
          if (impactIndex !== -1) {
            state.impacts[impactIndex] = action.payload.data;
          }
        }
        state.error = null;
      })
      .addCase(deleteStudentImpact.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      })

    // Fetch experiences cases
    builder
      .addCase(fetchStudentExperiences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStudentExperiences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.experiences = action.payload;
        state.error = null;
      })
      .addCase(fetchStudentExperiences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Create experience cases
    builder
      .addCase(createStudentExperience.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createStudentExperience.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.message = action.payload.message;
        // Add the new experience to the beginning of the array with pending status
        if (action.payload.data) {
          state.experiences.unshift(action.payload.data);
        }
        state.error = null;
      })
      .addCase(createStudentExperience.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

    // Delete experience cases
    builder
      .addCase(deleteStudentExperience.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteStudentExperience.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.message = action.payload.message;
        // Update the experience status to pending_deletion in the array
        if (action.payload.data) {
          const experienceIndex = state.experiences.findIndex(exp => exp.id === action.payload.data.id);
          if (experienceIndex !== -1) {
            state.experiences[experienceIndex] = action.payload.data;
          }
        }
        state.error = null;
      })
      .addCase(deleteStudentExperience.rejected, (state, action) => {
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
        // Add the new image to the array with pending status
        console.log('adding image to array', action.payload.data.studentImage)
        if (action.payload.data?.studentImage) {
          state.images.push(action.payload.data.studentImage);
        }
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
        // Update the image status to pending_deletion in the array
        if (action.payload.data?.updatedImage) {
          const imageIndex = state.images.findIndex(img => img.id === action.payload.imageId);
          if (imageIndex !== -1) {
            state.images[imageIndex] = action.payload.data.updatedImage;
          }
        }
        state.error = null;
      })
      .addCase(deleteStudentImage.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });

    // Refresh images cases
    builder
      .addCase(refreshStudentImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshStudentImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.images = action.payload;
        state.error = null;
      })
      .addCase(refreshStudentImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // OLD IMPACT THUNKS
    // builder
    //   .addCase(fetchStudentImpact.pending, (state) => {
    //     state.isLoading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchStudentImpact.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     // state.impact = action.payload;
    //     state.error = null;
    //   })
    //   .addCase(fetchStudentImpact.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.error = action.payload as string;
    //   });

    // OLD IMPACT THUNKS
    // builder
    //   .addCase(updateStudentImpact.pending, (state) => {
    //     state.isSubmitting = true;
    //     state.error = null;
    //   })
    //   .addCase(updateStudentImpact.fulfilled, (state, action) => {
    //     state.isSubmitting = false;
    //     // state.impact = action.payload.data;
    //     state.message = action.payload.message || 'Impact updated successfully';
    //     state.error = null;
    //   })
    //   .addCase(updateStudentImpact.rejected, (state, action) => {
    //     state.isSubmitting = false;
    //     state.error = action.payload as string;
    //   });

    // OLD experience cases
    // builder
    //   .addCase(fetchStudentExperience.pending, (state) => {
    //     state.isLoading = true;
    //     state.error = null;
    //   })
    //   .addCase(fetchStudentExperience.fulfilled, (state, action) => {
    //     state.isLoading = false;
    //     // state.experience = action.payload;
    //     state.error = null;
    //   })
    //   .addCase(fetchStudentExperience.rejected, (state, action) => {
    //     state.isLoading = false;
    //     state.error = action.payload as string;
    //   });

    // OLD EXPERIENCE THUNKS
    // builder
    //   .addCase(updateStudentExperience.pending, (state) => {
    //     state.isSubmitting = true;
    //     state.error = null;
    //   })
    //   .addCase(updateStudentExperience.fulfilled, (state, action) => {
    //     state.isSubmitting = false;
    //     // state.experience = action.payload.data;
    //     state.message = action.payload.message || 'Experience updated successfully';
    //     state.error = null;
    //   })
    //   .addCase(updateStudentExperience.rejected, (state, action) => {
    //     state.isSubmitting = false;
    //     state.error = action.payload as string;
    //   });
  },
});

export const { 
  setSelectedSubject, 
  clearSelectedSubject, 
  clearError, 
  clearLearnings,
  clearSelectedYearGroup,
  setSelectedYearGroup,
  setSelectedYearGroupForImpacts,
  clearSelectedYearGroupForImpacts,
  setSelectedYearGroupForExperiences,
  clearSelectedYearGroupForExperiences,
  clearMessage
} = studentSlice.actions;
export default studentSlice.reducer;
