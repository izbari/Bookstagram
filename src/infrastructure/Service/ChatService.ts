import {createApi, fakeBaseQuery} from '@reduxjs/toolkit/query/react';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {IMessage} from 'react-native-gifted-chat';
type IChat = {
  id: string;
  users: string[];
  messages: IMessage[];
};
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
          response?.forEach((doc: FirebaseFirestoreTypes.DocumentData) => {
            const docData = doc.data() as IChat;
            const chatId = docData.users.find((id: string) => id.includes('-'));
            const targetUserId = docData.users.find(
              (id: string) => id !== authUserId && !id.includes('-'),
            );

            chats.push({
              messages: docData.messages,
              createdAt: docData.messages[0].createdAt,
              id: doc.id,
              targetUserId,
              chatId,
            });
          });
          const handledChats = chats.sort(
            (a, b) => b.messages[0].createdAt - a.messages[0].createdAt,
          );

          return {data: handledChats};
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
        try {
          const response = await firestore()
            .collection('chats')
            .doc(chatId)
            .get();
          console.warn(response.data());
          return {data: response.data()};
        } catch (error) {
          console.warn(error);
          return {error};
        }
      },
      providesTags: (result: any) => {
        return [{type: 'Chat', id: result.id}];
      },
    }),
    // handleAddMessage: builder.mutation<any, any>({
    //   queryFn: async ({chatId, message, senderId, targetUserId}) => {
    //     const idPair =
    //       senderId < targetUserId
    //         ? senderId + '-' + targetUserId
    //         : targetUserId + '-' + senderId;
    //     try {
    //       if (!chatId) {
    //         const doc = await firestore()
    //           .collection('chats')
    //           .add({
    //             users: [senderId, targetUserId, idPair],
    //             messages: [message],
    //           });
    //         return {
    //           data: {
    //             id: doc.id,
    //           },
    //         };
    //       } else {
    //         const chatRef = firestore().collection('chats').doc(chatId);
    //         // add message at first position
    //         await chatRef.update({
    //           messages: firestore.FieldValue.arrayUnion(message),
    //         });
    //         return {
    //           data: {
    //             id: chatId,
    //           },
    //         };
    //       }
    //     } catch (error) {
    //       console.warn(error);
    //       return {error};
    //     }
    //   },

    //   // optimistic update add messages to cache
    //   onQueryStarted: async (
    //     {chatId, message, senderId, targetUserId},
    //     {dispatch},
    //   ) => {
    //     let patchResult: any;
    //     if (chatId) {
    //       patchResult = dispatch(
    //         chatApi.util.updateQueryData('getMyChats', undefined, draft => {
    //           const chat = draft?.find((chat: any) => chat.id === chatId);
    //           chat.messages.unshift(message);
    //         }),
    //       );
    //     } else {
    //       const idPair =
    //         senderId < targetUserId
    //           ? senderId + '-' + targetUserId
    //           : targetUserId + '-' + senderId;
    //       const chat = {
    //         id: chatId,
    //         messages: [message],
    //         users: [senderId, targetUserId, idPair],
    //       };
    //       patchResult = dispatch(
    //         chatApi.util.updateQueryData('getMyChats', undefined, draft => {
    //           draft?.push(chat);
    //         }),
    //       );
    //     }
    //     try {
    //       await queryFulfilled;
    //     } catch {
    //       console.warn('undo');
    //       patchResult.undo();
    //     }
    //   },

    //   invalidatesTags: (result, error, {chatId}) => {
    //     return [{type: 'Chat', id: chatId ? chatId : undefined}];
    //   },
    // }),
  }),
});
export const {
  useGetMyChatsQuery,
  useLazyGetMyChatsQuery,
  useGetChatUserByIdQuery,
  useGetChatByChatIdQuery,
  // useHandleAddMessageMutation,
} = chatApi;
