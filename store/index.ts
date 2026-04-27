import { configureStore } from '@reduxjs/toolkit';
import watchProgressReducer from './slices/watchProgressSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    watchProgress: watchProgressReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
