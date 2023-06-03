import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

import FastImage from 'react-native-fast-image';
import isEqual from 'react-fast-compare';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import tw from 'twrnc';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import {IPost} from '../../infrastructure/Service/PostService';
interface ISharePostRowProps {
  readonly userId: string;
  readonly img: string;
  readonly name: string;
  readonly post: IPost | undefined;
}
const SharePostRow: React.FunctionComponent<ISharePostRowProps> = props => {
  const authUser = useAppSelector(store => store.user.user);
  const [sent, setSent] = React.useState(false);
  let idPair =
    auth().currentUser.uid < props.userId
      ? auth().currentUser.uid + '-' + props.userId
      : props.userId + '-' + auth().currentUser.uid;

  React.useEffect(() => {
    let timer = setTimeout(() => setSent(false), 5000);
    return () => {
      clearTimeout(timer);
    };
  }, [sent]);

  const ShareHandler = async sent => {
    return;
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
            users: [authUser.id, props.userId, idPair],
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
    <View style={tw`flex-1 flex-row items-center bg-white p-4`}>
      <View style={tw`flex-row flex-1`}>
        <View style={tw`flex-row flex-1`}>
          <FastImage
            style={tw`h-10 w-10 rounded-full`}
            source={{
              uri: props.img,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <View style={tw`ml-2 p-2 justify-center`}>
            <Text style={tw`font-bold`}>{props.name}</Text>
            <View style={tw`flex-row`}>
              <Text numberOfLines={2} style={tw`text-gray-500 text-sm italic`}>
                {'Cool bio ...'}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={tw`self-center ${sent ? 'bg-gray-500' : 'bg-blue-500'}`}
          onPress={() => {
            const newVal = !sent;
            ShareHandler(newVal);
            setSent(newVal);
          }}>
          <Text style={tw`text-white text-sm font-bold`}>
            {sent ? 'Undo' : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export const MemoizedSharePostRow = React.memo(SharePostRow, isEqual);
