import React, {useState, useCallback} from 'react';

import {GiftedChat} from 'react-native-gifted-chat';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
export default function ChatSingleScreen({route}) {
  const [messages, setMessages] = useState([]);
  const [receiverUserData, setReceiverUserData] = useState({});

  const {uid} = route.params;
  const {chatId} = route.params;

  console.log("uid:",uid,"\nChatId:",chatId);
  const authUser = useSelector(store => store.user);
  React.useEffect(() => {
    firestore()
      .doc('Chats/' + chatId)
      .onSnapshot(doc => {
        setMessages(
          doc?.data()?.messages.map((message) => ({
            ...message,
            createdAt:message.createdAt.toDate(),
          })),
        );
      }); 
      
      database()
      .ref(`/users/${uid}`)
      .once('value')
      .then(snapshot => {
        setReceiverUserData(snapshot.val());
      });
  }, [chatId]);

 
  const onSend = useCallback(
    (m = []) => {

      console.log("ne kullanıyo gifted",m)
     
if(chatId != "null"){
  
  firestore()
  .doc('Chats/' + chatId)
  .collection('messages')
  .set({messages: GiftedChat.append(messages, m)}, {merge: true});
}else{
   

  firestore()
  .collection('Chats')
  .add({messages:m,users:auth().currentUser.uid,uid});
}
    },
    [chatId],
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
