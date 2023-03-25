import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
  getPosts,
  likeHandler,
  likePost,
  unlikePost,
} from '../../controllers/postController';
const initialState = {
  posts: [],
  loading: false,
  error: null,
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.loading = false;
    },
    extraReducers: builder => {
      builder
        .addCase(fetchPosts.pending, (state, action) => {
          console.warn('pen');

          state.loading = true;
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
          console.warn('fullided');
          state.loading = false;
          state.post = action.payload;
        })
        .addCase(fetchPosts.rejected, (state, action) => {
          console.warn('rej');

          state.loading = false;
          state.error = action.error;
        });
    },
  },
});
export const fetchPosts = createAsyncThunk(
  'post/fetchPosts',
  async (_, thunk) => {
    const response = await getPosts();
    // const posts = [];
    // response.docs.map(doc => {
    //   posts.push({...doc.data(), id: doc.id});
    // });
    console.warn(typeof response, response);
    thunk.dispatch(postSlice.actions.setPosts(response));
  },
);

// Action creators are generated for each case reducer function
export const {increment} = postSlice.actions;

export default postSlice.reducer;
