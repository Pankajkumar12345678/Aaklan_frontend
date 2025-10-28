// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import templateReducer from './slices/templateSlice';
import lessonReducer from './slices/lessonSlice';
import adminReducer from './slices/adminSlice';
import settings from './slices/settings';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    templates: templateReducer,
    lessons: lessonReducer,
    admin: adminReducer,
    settings,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    })
});

export default store;