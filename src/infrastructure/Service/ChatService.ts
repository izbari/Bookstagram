import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
export const chatApi = createApi({
  reducerPath: 'chat',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Chat', 'ChatUser'],
  endpoints: builder => ({
    getMyChats: builder.query<any[], string | undefined>({
      queryFn: async (authUserId: string | undefined) => {
        try {
          const chats: any[] = [];
          const chatRef = firestore()
            .collection('Chats')
            .where('users', 'array-contains', authUserId);
          const response = await chatRef.get();
          response?.forEach(doc => {
            const docData = doc.data();
            const chatId: string = docData.users.find((id: string) =>
              id.includes('-'),
            );
            const targetUserId: string = docData.users.find(
              (id: string) => id !== authUserId && !id.includes('-'),
            );

            chats.push({
              messages: docData.messages,
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

      providesTags: (result: any) => {
        console.warn(result);
        return [
          {type: 'Chat', id: 'LIST'},
          ...result.map?.((chat: any) => ({type: 'Chat', id: chat.id})),
        ];
      },
    }),
    getChatUserById: builder.query<any, string>({
      queryFn: async (userId: string) => {
        const response = await database().ref(`/users/${userId}`).once('value');
        return {data: response.val()};
      },
      providesTags: (result: any) => {
        return [{type: 'ChatUser', id: result.id}];
      },
    }),
  }),
});
export const {useGetMyChatsQuery, useGetChatUserByIdQuery} = chatApi;
