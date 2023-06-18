import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {IUser} from '../Redux/Slices/UserSlice';
type IComment = {
  comment: string;
  id: string;
  userId: string;
  img: string;
  name: string;
  postTime: Date;
}[];
export interface IPost {
  likes: string[];
  comments: IComment;
  post: string;
  postImg: string;
  postTime: Date;
  targetUser: string;
  userId: string;
  userImageUrl: string;
  userName: string;
  id: string;
  liked: boolean;
}
export const postApi = createApi({
  reducerPath: 'posts',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Post'],
  endpoints: builder => ({
    getPosts: builder.query<IPost[], undefined>({
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
      providesTags: (result: any) => {
        return [
          {type: 'Post', id: 'LIST'},
          ...result.map?.((post: any) => ({type: 'Post', id: post.id})),
        ];
      },
    }),
    getPostById: builder.query<IPost, string>({
      queryFn: async id => {
        try {
          const postRef = firestore().collection('posts').doc(id);
          const response = await postRef.get();
          const post = {...(response.data() as IPost), id: response.id};
          return {data: post};
        } catch (error) {
          return {error};
        }
      },
      providesTags: (result: any, error, id) => [{type: 'Post', id}],
    }),
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
          postApi.util.updateQueryData('getPosts', undefined, draft => {
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
      IPost,
      {id: string; userId: string; comment: string; img: string}
    >({
      queryFn: async ({id, userId, comment, img}) => {
        try {
          const postRef = firestore().collection('posts').doc(id);
          const response = await postRef.get();
          const post = response.data() as IPost;
          const comments = post.comments ?? [];
          comments.push({
            comment,
            id: userId,
            userId,
            img,
            name: post.userName,
            postTime: new Date(),
          });
          await postRef.update({comments});
          return {data: {...post, comments}};
        } catch (error) {
          return {error};
        }
      },
      async onQueryStarted(
        {id, userId, comment, img},
        {dispatch, queryFulfilled},
      ) {
        const patchResult = dispatch(
          postApi.util.updateQueryData('getPosts', undefined, draft => {
            const post = draft?.find(_post => _post.id === id);
            const comments = post?.comments ?? [];
            comments.push({
              comment,
              id: userId,
              userId,
              img,
              name: post?.userName,
              postTime: new Date(),
            });
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
    getCommentsByPostId: builder.query<IComment, string>({
      queryFn: async id => {
        try {
          const postRef = firestore().collection('posts').doc(id);
          const response = await postRef.get();
          const post = response.data() as IPost;
          return {data: post.comments};
        } catch (error) {
          return {error};
        }
      },
      providesTags: (result: any, error, id) => [{type: 'Post', id}],
    }),
    getPostsByUserId: builder.query<IPost[], string>({
      queryFn: async id => {
        try {
          const posts: IPost[] = [];
          const postRef = firestore()
            .collection('posts')
            .where('userId', '==', id);
          const response = await postRef.orderBy('postTime', 'desc').get();
          response?.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) => {
            posts.push({...(doc.data() as IPost), id: doc.id});
          });
          return {data: posts};
        } catch (error) {
          return {error};
        }
      },

      providesTags: (result: any) => {
        return [
          {type: 'Post', id: 'LIST'},
          ...result.map?.((post: any) => ({type: 'Post', id: post.id})),
        ];
      },
    }),
    getMultipleUsers: builder.query<IUser[], string[]>({
      queryFn: async ids => {
        try {
          const promises = ids.map(async id => {
            return database().ref(`users/${id}`).once('value');
          });
          let users: any = await Promise.all(promises);
          users = users.map((user: any) => user.val());
          return {data: users as IUser[]};
        } catch (error) {
          return {error};
        }
      },
    }),
  }),
});
export const {
  useGetMultipleUsersQuery,
  useGetPostsQuery,
  useGetCommentsByPostIdQuery,
  useGetPostByIdQuery,
  useHandleAddCommentMutation,
  useHandleLikeMutation,
  useGetPostsByUserIdQuery,
} = postApi;
