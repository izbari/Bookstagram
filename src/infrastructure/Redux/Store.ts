import {configureStore} from '@reduxjs/toolkit';
import {postApi} from '../Service/PostService';
import {setupListeners} from '@reduxjs/toolkit/dist/query';
import {userSlice} from './Slices/UserSlice';
export const store = configureStore({
  reducer: {
    [postApi.reducerPath]: postApi.reducer,
    user: userSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(postApi.middleware),
  devTools: true,
});
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
