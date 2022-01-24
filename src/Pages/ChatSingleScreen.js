import React, {useState, useCallback} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function ChatSingleScreen({route}) {
  const [messages, setMessages] = useState([]);
  const {uid, chatId} = route.params;
  const [currentChatId, setCurrentChatId] = useState(chatId);


  React.useEffect(() => {
    firestore()
      .doc('Chats/' + currentChatId)
      .onSnapshot(doc => {
        setMessages(
          doc?.data()?.messages.map(message => ({
            ...message,
            createdAt: message.createdAt.toDate(),
          })),
        );
      });
  }, [chatId, currentChatId]);

  const onSend = useCallback(
    (m = []) => {
      if (currentChatId != 'null') {
        firestore()
          .doc('Chats/' + currentChatId)
          .set({messages: GiftedChat.append(messages, m)}, {merge: true});
      } else {
        firestore()
          .collection('Chats')
          .add({
            messages: m,
            users: [auth().currentUser.uid, uid],
          })
          .then(doc => {
            setCurrentChatId(doc._documentPath._parts[1]);
          });
      }
    },
    [chatId, currentChatId,messages],
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={text => onSend(text)}
      user={{
        _id: auth().currentUser.uid,
      }}
    />
  );
}
