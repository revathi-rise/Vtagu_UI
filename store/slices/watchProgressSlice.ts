import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { watchProgressApi, WatchProgress } from '@/lib/api/watch-progress.api';

interface WatchProgressState {
  watchList: WatchProgress[];
  currentProgress: WatchProgress | null;
  loading: boolean;
  error: string | null;
}

const initialState: WatchProgressState = {
  watchList: [],
  currentProgress: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchUserWatchProgress = createAsyncThunk(
  'watchProgress/fetchAll',
  async (userId: number | string, { rejectWithValue }) => {
    try {
      const response = await watchProgressApi.getProgressList(userId);
      if (response.status && Array.isArray(response.data)) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch watch progress');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveWatchProgress = createAsyncThunk(
  'watchProgress/save',
  async (data: Omit<WatchProgress, 'id' | 'createdAt' | 'updatedAt' | 'content'>, { rejectWithValue }) => {
    try {
      const response = await watchProgressApi.updateProgress(data);
      if (response.status && response.data) {
        return response.data as WatchProgress;
      }
      return rejectWithValue(response.message || 'Failed to update progress');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchContentProgress = createAsyncThunk(
  'watchProgress/fetchContent',
  async ({ userId, contentId }: { userId: number | string, contentId: number | string }, { rejectWithValue }) => {
    try {
      const response = await watchProgressApi.getContentProgress(userId, contentId);
      if (response.status && response.data) {
        return response.data as WatchProgress;
      }
      return null; // Might not have progress for this content yet
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteWatchProgress = createAsyncThunk(
  'watchProgress/delete',
  async (progressId: number | string, { rejectWithValue }) => {
    try {
      const response = await watchProgressApi.deleteProgress(progressId);
      if (response.status) {
        return progressId;
      }
      return rejectWithValue(response.message || 'Failed to delete progress');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const watchProgressSlice = createSlice({
  name: 'watchProgress',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProgress: (state, action: PayloadAction<WatchProgress | null>) => {
      state.currentProgress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchUserWatchProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWatchProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.watchList = action.payload;
      })
      .addCase(fetchUserWatchProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Save
      .addCase(saveWatchProgress.fulfilled, (state, action) => {
        state.currentProgress = action.payload;
        // Update list if it exists
        const index = state.watchList.findIndex(item => 
          item.contentId === action.payload.contentId && 
          item.contentType === action.payload.contentType
        );
        if (index !== -1) {
          state.watchList[index] = action.payload;
        } else {
          state.watchList.unshift(action.payload);
        }
      })
      // Fetch Content
      .addCase(fetchContentProgress.fulfilled, (state, action) => {
        state.currentProgress = action.payload;
      })
      // Delete
      .addCase(deleteWatchProgress.fulfilled, (state, action) => {
        state.watchList = state.watchList.filter(item => item.id !== action.payload);
        if (state.currentProgress?.id === action.payload) {
          state.currentProgress = null;
        }
      });
  },
});

export const { clearError, setCurrentProgress } = watchProgressSlice.actions;
export default watchProgressSlice.reducer;
