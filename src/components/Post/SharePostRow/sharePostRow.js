import {View, Text} from 'react-native';
import React from 'react';

import FastImage from 'react-native-fast-image';
import {Button} from 'react-native-paper';
import isEqual from 'react-fast-compare';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import tw from 'twrnc';
const sharePostRow = ({friend, post}) => {
  const authUser = useSelector(store => store.user);
  console.log('authUser', authUser)
  const [sent, setSent] = React.useState(false);
  let idPair =
    auth().currentUser.uid < friend.id
      ? auth().currentUser.uid + '-' + friend.id
      : friend.id + '-' + auth().currentUser.uid;

  React.useEffect(() => {
    let timer = setTimeout(() => setSent(false), 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [sent]);

  const ShareHandler = async sent => {
    if (sent) {
      //This line share post
      const message = {
        _id: Date.now() + Math.random(),
        text: post.post ? post.post : null,
        createdAt: new Date(),
        image: post.postImg ? post.postImg : null,
        user: {
          _id: authUser.id,
          name: authUser.name + ' ' + authUser.lastName,
          avatar: authUser.imageUrl,
        },
      };
      const messages = await firestore()
        .collection('Chats')
        .where('users', 'array-contains', idPair)
        .get();

      let chatRef = '-';
      let messageData = [];

      messages.forEach(doc => {
        messageData = doc.data().messages;

        chatRef = `Chats/${doc._ref._documentPath._parts[1]}`;
      });
      if (messages.size) {
        console.warn([message, ...messageData]);
        firestore()
          .doc(chatRef)
          .set({messages: [message, ...messageData]}, {merge: true});
      } else {
        console.log('else calisti');
        // new chat created

        firestore()
          .collection('Chats')
          .add({
            messages: [message],
            users: [authUser.id, friend.id, idPair],
          });
      }
    } else {
      // undo share , delete message
      console.warn('Undo yaptın');
      let chatRef = '-';
      let messageData = [];

      const messages = await firestore()
        .collection('Chats')
        .where('users', 'array-contains', idPair)
        .get();
      messages.forEach(doc => {
        messageData = doc.data().messages;

        chatRef = `Chats/${doc._ref._documentPath._parts[1]}`;
      });
      firestore()
        .doc(chatRef)
        .set(
          {messages: messageData.slice(1, messageData.length)},
          {merge: true},
        );
    }
  };

  return (
    <View key={friend.id} style={tw`flex-row items-center bg-white p-4`}>
      <View style={tw`flex-row flex-1`}>
        <View style={tw`flex-row flex-1`}>
          <FastImage
            style={tw`h-10 w-10 rounded-full`}
            source={{
              uri: friend.imageUrl,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <View
            style={{
              justifyContent: 'center',
              marginLeft: 10,
              padding: 5,
            }}>
            <Text style={{fontWeight: 'bold'}}>
              {friend.name + ' ' + friend.lastName}
            </Text>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Text numberOfLines={2} style={tw`text-gray-500 text-sm italic`}>
                {'Cool bio ...'}
              </Text>
            </View>
          </View>
        </View>
        <Button
          mode="contained"
          style={tw(['self-center ', sent ? 'bg-gray-500' : 'bg-blue-500'])}
          labelStyle={tw`text-white text-sm font-bold`}
          onPress={() => {
            const newVal = !sent;
            ShareHandler(newVal);
            setSent(newVal);
          }}>
          {sent ? 'Undo' : 'Send'}
        </Button>
      </View>
    </View>
  );
};

export default React.memo(sharePostRow, isEqual);
