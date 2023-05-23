import {createSlice} from '@reduxjs/toolkit';
export type IUser = {
  id: string;
  name: string;
  lastName: string;
  fallowers: string[];
  fallowing: string[];
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
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {setUser} = userSlice.actions;

export default userSlice.reducer;
