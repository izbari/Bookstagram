import {createSelector, createEntityAdapter} from '@reduxjs/toolkit';
import {chatService} from '../../Service/ChatService2';
import {IMessage} from 'react-native-gifted-chat';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

type IMyChatsArgs = {
  authUserId: string;
};
const chatAdapter = createEntityAdapter<IChat>({
  selectId: chat => chat.id,
});

const initialState = chatAdapter.getInitialState();

export const chatSlice = chatService.injectEndpoints({
  endpoints: builder => ({
    getChats: builder.query<IChat[], undefined>({
      queryFn: async () => {
        try {
          const authUserId = auth().currentUser?.uid;
          const chats: any[] = [];
          const chatRef = firestore()
            .collection('chats')
            .where('users', 'array-contains', authUserId);
          const response = await chatRef.get();
          response?.forEach((doc: FirebaseFirestoreTypes.DocumentData) => {
            const docData = doc.data();
            const chatId: string = docData.users.find((id: string) =>
              id.includes('-'),
            );
            const targetUserId: string = docData.users.find(
              (id: string) => id !== authUserId && !id.includes('-'),
            );
            chats.push({
              messages: docData.messages.reverse(),
              id: doc.id,
              targetUserId,
              chatId,
            });
          });
          return {data: chats};
        } catch (error) {
          return {error};
        }
      },
      transformResponse: (responseData: any) => {
        console.log('transform response', responseData);
        return chatAdapter.setAll(initialState, responseData);
      },
      providesTags: (result: any) => {
        return [
          {type: 'Chat', id: 'LIST'},
          ...result.map?.((chat: any) => ({type: 'Chat', id: chat.id})),
        ];
      },
    }),
    // getPosts: builder.query({
    //   query: () => '/posts',
    //   transformResponse: (responseData: any) => {
    //     return postsAdapter.setAll(initialState, responseData);
    //   },
    //   providesTags: (result: any, error, arg) => [
    //     {type: 'Post', id: 'LIST'},
    //     ...result.ids.map((id: any) => ({type: 'Post', id})),
    //   ],
    // }),
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
    // addReaction: builder.mutation({
    //   query: ({id, reactions}) => ({
    //     url: `posts/${id}`,
    //     method: 'PATCH',
    //     // In a real app, we'd probably need to base this on user ID somehow
    //     // so that a user can't do the same reaction more than once
    //     body: {reactions},
    //   }),
    //   async onQueryStarted({id, reactions}, {dispatch, queryFulfilled}) {
    //     // `updateQueryData` requires the endpoint name and cache key arguments,
    //     // so it knows which piece of cache state to update
    //     const patchResult = dispatch(
    //       extendedApiSlice.util.updateQueryData(
    //         'getPosts',
    //         undefined,
    //         draft => {
    //           const post = draft.entities[id];
    //           if (post) {
    //             post.reactions = reactions;
    //           }
    //         },
    //       ),
    //     );
    //     try {
    //       await queryFulfilled;
    //     } catch {
    //       patchResult.undo();
    //     }
    //   },
    // }),
  }),
});

export const {useGetChatsQuery} = chatSlice;

// returns the query result object
export const selectedChatResult =
  chatSlice.endpoints.getChats.select(undefined);

// Creates memoized selector

const selectChatData = createSelector(
  selectedChatResult,
  postsResult => postsResult.data, // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllChats,
  selectById: selectChatById,
  selectIds: selectChatIds,
  // Pass in a selector that returns the posts slice of state
} = chatAdapter.getSelectors(state => selectChatData(state) ?? initialState);
