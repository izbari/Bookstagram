import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
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
export const postApi = createApi({
  reducerPath: 'posts',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Post'],
  endpoints: () => ({}),
  // getPosts: build.query<IPost[], void>({
  //   queryFn: async () => {
  //     try {
  //       const posts: IPost[] = [];
  //       const postRef = firestore().collection('posts');
  //       const response = await postRef.orderBy('postTime', 'desc').get();
  //       response?.forEach((doc: FirebaseFirestoreTypes.DocumentSnapshot) => {
  //         posts.push({...(doc.data() as IPost), id: doc.id, liked: false});
  //       });
  //       return {data: posts};
  //     } catch (error) {
  //       return {error};
  //     }
  //   },
});
