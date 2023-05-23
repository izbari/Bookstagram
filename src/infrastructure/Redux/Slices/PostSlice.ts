import {createSelector, createEntityAdapter} from '@reduxjs/toolkit';
import {IPost, postApi} from '../../Service/PostService';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
interface ICommentPayload {
  userId: string;
  comment: string;
  img: string;
  name: string;
  lastName: string;
  postId: string;
}

const postsAdapter = createEntityAdapter<IPost>({
  selectId: post => post.id,
});

const initialState = postsAdapter.getInitialState();

export const postSlice = postApi.injectEndpoints({
  endpoints: builder => ({
    getPosts: builder.query({
      queryFn: async () => {
        try {
          const posts: IPost[] = [];
          const postRef = firestore().collection('posts');
          const response = await postRef.orderBy('postTime', 'desc').get();
          response?.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) => {
            posts.push({...(doc.data() as IPost), id: doc.id, liked: false});
          });
          return {data: posts};
        } catch (error) {
          return {error};
        }
      },

      transformResponse: (responseData: IPost[]) => {
        console.warn(responseData);
        return postsAdapter.setAll(initialState, responseData);
      },
      providesTags: (result: any) => {
        return [
          {type: 'Post', id: 'LIST'},
          ...result.map?.((post: any) => ({type: 'Post', id: post.id})),
        ];
      },
    }),
    // getPostsByUserId: builder.query({
    //   query: id => `/posts/?userId=${id}`,
    //   transformResponse: (responseData: any, _, arg) => {
    //     console.log('res', responseData);
    //     return postsAdapter.setAll(initialState, responseData);
    //   },
    //   providesTags: (result: any) => {
    //     console.log('provies tag kısmı', result);
    //     return [...result.ids.map((id: string) => ({type: 'Post', id}))];
    //   },
    // }),
    // addNewPost: builder.mutation({
    //   query: initialPost => ({
    //     url: '/posts',
    //     method: 'POST',
    //     body: {
    //       ...initialPost,
    //       userId: Number(initialPost.userId),
    //     },
    //   }),
    //   invalidatesTags: (result, error, arg) => [{type: 'Post'}],
    // }),
    // updatePost: builder.mutation({
    //   query: initialPost => ({
    //     url: `/posts/${initialPost.id}`,
    //     method: 'PUT',
    //     body: {
    //       ...initialPost,
    //       date: new Date().toISOString(),
    //     },
    //   }),
    //   invalidatesTags: (result, error, arg) => [{type: 'Post', id: arg.id}],
    // }),
    // deletePost: builder.mutation({
    //   query: ({id}) => ({
    //     url: `/posts/${id}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: (result, error, arg) => {
    //     console.warn('result', result);
    //     return [{type: 'Post', id: arg.id}];
    //   },
    // }),
    handleLike: builder.mutation({
      queryFn: async ({id, userId}) => {
        try {
          const postRef = firestore().collection('posts').doc(id);

          const response = await postRef.get();

          const post = response.data() as IPost;

          const liked = post.likes.includes(userId);
          if (liked) {
            await postRef.update({
              likes: firestore.FieldValue.arrayRemove(userId),
            });
          } else {
            await postRef.update({
              likes: firestore.FieldValue.arrayUnion(userId),
            });
          }
          return {data: {id, liked: !liked}};
        } catch (error) {
          return {error};
        }
      },

      async onQueryStarted({id, userId}, {dispatch, queryFulfilled}) {
        const patchResult = dispatch(
          postSlice.util.updateQueryData('getPosts', undefined, draft => {
            const post = draft?.find(_post => _post.id === id);
            const likes = post?.likes ?? [];
            // if user liked the post, remove user id from likes array
            if (likes.includes(userId)) {
              const index = likes.indexOf(userId);
              likes.splice(index, 1);
            } else {
              // if user didn't like the post, add user id to likes array
              likes.push(userId);
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          console.warn('undo');
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, arg) => {
        return [{type: 'Post', id: arg.id}];
      },
    }),
    handleAddComment: builder.mutation<
      ICommentPayload & {id: string; postTime: string},
      ICommentPayload
    >({
      queryFn: async ({postId, userId, name, lastName, img, comment}) => {
        try {
          const postRef = firestore().collection('posts').doc(postId);

          const response = await postRef.get();

          const post = response.data() as IPost;

          const comments = post.comments;
          const commentPayload = {
            userId,
            comment,
            img,
            postTime: firestore.Timestamp.fromDate(new Date()),
            id: new Date().getTime().toString(),
            name: name + ' ' + lastName,
          };
          comments.push(commentPayload);
          await postRef.update({
            comments: comments,
          });
          return {data: commentPayload};
        } catch (error) {
          return {error};
        }
      },
    }),
  }),
});

export const {
  useGetPostsQuery,
  useHandleLikeMutation,
  useHandleAddCommentMutation,
  //   useGetPostsByUserIdQuery,
  //   useAddNewPostMutation,
  //   useUpdatePostMutation,
  //   useDeletePostMutation,
  //   useAddReactionMutation,
} = postSlice;

// returns the query result object
export const selectPostsResult = postSlice.endpoints.getPosts.select();

// Creates memoized selector

const selectPostsData = createSelector(
  selectPostsResult,
  postsResult => postsResult.data, // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  // Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(
  (state: RootState) => selectPostsData(state) ?? initialState,
);
