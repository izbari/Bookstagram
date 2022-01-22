import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
export default function ChatSingleScreen({route}) {
  const [messages, setMessages] = useState([]);
  const [receiverUserData, setReceiverUserData] = useState({});

  const {uid} = route.params;
  const authUser = useSelector(store=> store.user)
  React.useEffect(() => {
    getAllMessages()
},[])
   
  const getAllMessages = async()=>{
    
    database()
    .ref(`/users/${uid}`)
    .once('value')
    .then(snapshot => {
      setReceiverUserData(snapshot.val());
    });
  
    const chatId = uid > auth().currentUser.uid ? auth().currentUser.uid + '-' +uid  :  uid + '-' +auth().currentUser.uid;
    console.log(chatId,"***************************************************")

    const querySanp = await firestore()
    .collection("Chats")
    .doc(chatId)
    .collection("messages")
    .orderBy("createdAt","desc")
    .get()

    const allMessages= querySanp.docs.map(docSanp => {

          return{
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate()
          }
    })
    setMessages(allMessages)

  }
 
  const onSend =  (messageArray) => {

  
      const messages = messageArray[0];
      const myMessage={
        ...messages,
        sentBy:auth().currentUser.uid,
        sentTo: uid,        
        senderUserData:authUser,
        recieverUserData:receiverUserData,
        createdAt: new Date()
      }
      const chatId= uid > auth().currentUser.uid ? auth().currentUser.uid + '-' +uid  :  uid + '-' +auth().currentUser.uid;

    setMessages(previousMessages => GiftedChat.append(previousMessages, myMessage))
    firestore().collection("Chats").doc(chatId).collection("messages").add({...myMessage,createdAt:firestore.FieldValue.serverTimestamp()});

    let ids = []
    firestore().collection('Chats')
    .doc(chatId)
    .onSnapshot(documentSnapshot => {
      console.log('User data: ', documentSnapshot.data());
      ids.push(documentSnapshot.data().id)
    });

    console.log('ids:',ids)

    firestore()
    .collection('Chats')
    .doc(chatId)
    .set({...ids,chatId}
    )
    .then(() => {
      console.log('User added!');
    });

  }

  return (
    <GiftedChat
      messages={messages}
      onSend={text => onSend(text)}
      user={{
        _id: auth().currentUser.uid,
      }}
    />
  )
}