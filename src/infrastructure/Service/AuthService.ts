import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import database from '@react-native-firebase/database';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
type IComment = {
  comment: string;
  id: string;
  userId: string;
  img: string;
  name: string;
  postTime: FirebaseFirestoreTypes.Timestamp;
}[];
export interface IPost {
  likes: string[];
  comments: IComment;
  post: string;
  postImg: string;
  postTime: FirebaseFirestoreTypes.Timestamp;
  targetUser: string;
  userId: string;
  userImageUrl: string;
  userName: string;
  id: string;
  liked: boolean;
}
export const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Auth'],
  endpoints: builder => ({
    getUserDataById: builder.query<string, string>({
      queryFn: async id => {
        try {
          const userRef = database().ref('users/' + id);
          const response = await userRef.once('value');
          return {data: response.val()};
        } catch (error) {
          return {error};
        }
      },
    }),
  }),
});
export const {useLazyGetUserDataByIdQuery} = authApi;
