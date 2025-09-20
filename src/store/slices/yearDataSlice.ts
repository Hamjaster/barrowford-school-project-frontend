import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  type YearGroup, 
  type Subject, 
  type YearGroupWithSubjects, 
  type YearDataState 
} from '@/types';
import { API_BASE_URL } from '@/constants';

const initialState: YearDataState = {
  yearGroups: [],
  yearGroupsWithSubjects: [],
  isLoading: false,
  isLoadingSubjects: false,
  error: null,
};

// Async Thunks
export const fetchYearGroups = createAsyncThunk(
  'yearData/fetchYearGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subject/year-groups`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch year groups');
      }

      const data = await response.json();
      return data.data; // Assuming the API returns { success: true, data: [...] }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchSubjectsByYearGroup = createAsyncThunk(
  'yearData/fetchSubjectsByYearGroup',
  async (yearGroupId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/subject/year-groups/${yearGroupId}/subjects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Failed to fetch subjects');
      }

      const data = await response.json();
      return { yearGroupId, subjects: data.data }; // Return both yearGroupId and subjects
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const fetchAllYearGroupsWithSubjects = createAsyncThunk(
  'yearData/fetchAllYearGroupsWithSubjects',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // First fetch all year groups
      const yearGroupsResponse = await dispatch(fetchYearGroups());
      console.log('YEAR Group response !!', yearGroupsResponse);
      
      if (fetchYearGroups.rejected.match(yearGroupsResponse)) {
        return rejectWithValue('Failed to fetch year groups');
      }

      const yearGroups = yearGroupsResponse.payload as YearGroup[];
      
      // Then fetch subjects for each year group
      const yearGroupsWithSubjects: YearGroupWithSubjects[] = [];
      
      for (const yearGroup of yearGroups) {
        const subjectsResponse = await dispatch(fetchSubjectsByYearGroup(yearGroup.id));
        
        if (fetchSubjectsByYearGroup.fulfilled.match(subjectsResponse)) {
          yearGroupsWithSubjects.push({
            ...yearGroup,
            subjects: subjectsResponse.payload.subjects
          });
        } else {
          // If subjects fetch fails, add year group with empty subjects array
          yearGroupsWithSubjects.push({
            ...yearGroup,
            subjects: []
          });
        }
      }

      return yearGroupsWithSubjects;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const yearDataSlice = createSlice({
  name: 'yearData',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearYearData: (state) => {
      state.yearGroups = [];
      state.yearGroupsWithSubjects = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch year groups cases
    builder
      .addCase(fetchYearGroups.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchYearGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.yearGroups = action.payload;
        state.error = null;
      })
      .addCase(fetchYearGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

    // Fetch subjects by year group cases
    builder
      .addCase(fetchSubjectsByYearGroup.pending, (state) => {
        state.isLoadingSubjects = true;
        state.error = null;
      })
      .addCase(fetchSubjectsByYearGroup.fulfilled, (state, action) => {
        state.isLoadingSubjects = false;
        const { yearGroupId, subjects } = action.payload;
        
        // Update the yearGroupsWithSubjects array
        const existingIndex = state.yearGroupsWithSubjects.findIndex(
          yg => yg.id === yearGroupId
        );
        
        if (existingIndex !== -1) {
          state.yearGroupsWithSubjects[existingIndex].subjects = subjects;
        } else {
          // If year group doesn't exist in the array, find it from yearGroups and add it
          const yearGroup = state.yearGroups.find(yg => yg.id === yearGroupId);
          if (yearGroup) {
            state.yearGroupsWithSubjects.push({
              ...yearGroup,
              subjects
            });
          }
        }
        
        state.error = null;
      })
      .addCase(fetchSubjectsByYearGroup.rejected, (state, action) => {
        state.isLoadingSubjects = false;
        state.error = action.payload as string;
      })

    // Fetch all year groups with subjects cases
    builder
      .addCase(fetchAllYearGroupsWithSubjects.pending, (state) => {
        state.isLoading = true;
        state.isLoadingSubjects = true;
        state.error = null;
      })
      .addCase(fetchAllYearGroupsWithSubjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingSubjects = false;
        state.yearGroupsWithSubjects = action.payload;
        state.error = null;
      })
      .addCase(fetchAllYearGroupsWithSubjects.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingSubjects = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearYearData } = yearDataSlice.actions;
export default yearDataSlice.reducer;
