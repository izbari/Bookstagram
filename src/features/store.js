import {configureStore} from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import postSlice from './slices/postSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    post: postSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
