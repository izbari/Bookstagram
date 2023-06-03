import {createSlice} from '@reduxjs/toolkit';
import {authApi} from '../../Service/AuthService';
export type IFallowing = {
  readonly userId: string;
  readonly img: string;
  readonly name: string;
};
export type IUser = {
  id: string;
  name: string;
  lastName: string;
  fallowers: string[];
  fallowing: IFallowing[];
  email: string;
  birth: string;
  books: string[];
  gender: string;
  imageUrl: string;
} | null;
interface UserState {
  user: IUser;
}
const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: builder => {
    builder.addMatcher(
      authApi.endpoints.getUserDataById.matchFulfilled,
      (state, {payload}) => {
        state.user = payload;
      },
    );
  },
  reducers: {},
});

export default userSlice.reducer;
