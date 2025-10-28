// src/store/slices/lessonSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { lessonService } from '../services/api';

export const createLesson = createAsyncThunk(
  'lessons/create',
  async (lessonData, { rejectWithValue }) => {
    try {
      const response = await lessonService.create(lessonData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create lesson');
    }
  }
);

export const updateLesson = createAsyncThunk(
  'lessons/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await lessonService.update(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update lesson');
    }
  }
);

const lessonSlice = createSlice({
  name: 'lessons',
  initialState: {
    currentLesson: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentLesson: (state, action) => {
      state.currentLesson = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLesson = action.payload.lesson;
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLesson = action.payload.lesson;
      })
      .addCase(updateLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentLesson, clearError } = lessonSlice.actions;
export default lessonSlice.reducer;