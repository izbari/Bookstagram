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
            .collection('chats')
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
      // optimistic update for chat messages

      providesTags: (result: any) => {
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
    getChatByChatId: builder.query<any, string>({
      queryFn: async (chatId: string) => {
        const response = await firestore()
          .collection('Chats')
          .where('users', 'array-contains', chatId)
          .get();
        console.warn(response);
        return {data: response};
      },
      providesTags: (result: any) => {
        return [{type: 'Chat', id: result.id}];
      },
    }),
    handleAddMessage: builder.mutation<any, any>({
      queryFn: async ({chatId, message, senderId, targetUserId}) => {
        const idPair =
          senderId < targetUserId
            ? senderId + '-' + targetUserId
            : targetUserId + '-' + senderId;
        console.warn('service', {chatId, message, senderId, targetUserId});
        try {
          if (!chatId) {
            const doc = await firestore()
              .collection('chats')
              .add({
                users: [senderId, targetUserId, idPair],
                messages: [message],
              });
            return {
              data: {
                id: doc.id,
              },
            };
          } else {
            const chatRef = firestore().collection('chats').doc(chatId);
            // add message at first position
            await chatRef.update({
              messages: firestore.FieldValue.arrayUnion(message),
            });
            return {
              data: {
                id: chatId,
              },
            };
          }
        } catch (error) {
          return {error};
        }
      },
      // optimistic update add messages to cache
      onQueryStarted: async (
        {chatId, message, senderId, targetUserId},
        {dispatch, queryFulfilled},
      ) => {
        let patchResult: any;
        if (chatId) {
          patchResult = dispatch(
            chatApi.util.updateQueryData('getMyChats', undefined, draft => {
              const chat = draft?.find((chat: any) => chat.id === chatId);
              chat.messages.unshift(message);
            }),
          );
        } else {
          const idPair =
            senderId < targetUserId
              ? senderId + '-' + targetUserId
              : targetUserId + '-' + senderId;
          const chat = {
            id: chatId,
            messages: [message],
            users: [senderId, targetUserId, idPair],
          };
          patchResult = dispatch(
            chatApi.util.updateQueryData('getMyChats', undefined, draft => {
              draft?.push(chat);
            }),
          );
        }
        try {
          await queryFulfilled;
        } catch {
          console.warn('undo');
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, {chatId}) => {
        return [{type: 'Chat', id: chatId ? chatId : undefined}];
      },
    }),
  }),
});
export const {
  useGetMyChatsQuery,
  useGetChatUserByIdQuery,
  useGetChatByChatIdQuery,
  useHandleAddMessageMutation,
} = chatApi;
