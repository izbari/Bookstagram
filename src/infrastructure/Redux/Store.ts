import {configureStore} from '@reduxjs/toolkit';
import {postApi} from '../Service/PostService';
import {setupListeners} from '@reduxjs/toolkit/dist/query';
import {userSlice} from './Slices/UserSlice';
import {authApi} from '../Service/AuthService';
import {chatApi} from '../Service/ChatService';
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(postApi.middleware)
      .concat(authApi.middleware)
      .concat(chatApi.middleware),
  devTools: true,
});
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
