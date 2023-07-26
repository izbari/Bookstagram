import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

import FastImage from 'react-native-fast-image';
import isEqual from 'react-fast-compare';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import tw from 'twrnc';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import {IPost} from '../../infrastructure/Service/PostService';
import {Colors} from '../../resources/constants/Colors';
import {IMessage} from 'react-native-gifted-chat';
import {Alert} from 'react-native';
import {guidGenerator} from '../../infrastructure/Utils/guidGenerator';
interface ISharePostRowProps {
  readonly userId: string | undefined;
  readonly img: string | undefined;
  readonly username: string | undefined;
  readonly name: string | undefined;
  readonly postId: string | undefined;
}
const SharePostRow: React.FunctionComponent<ISharePostRowProps> = props => {
  const authUser = useAppSelector(store => store.user.user);
  const [sent, setSent] = React.useState(false);
  let idPair =
    auth().currentUser.uid < props.userId
      ? auth().currentUser.uid + '-' + props.userId
      : props.userId + '-' + auth().currentUser.uid;

  const handleShare = React.useCallback(async () => {
    try {
      let post = await firestore().doc(`posts/${props.postId}`).get();
      post = {...post.data(), id: post.id} as IPost & {id: string};
      if (authUser && post) {
        console.warn('calisti');

        //This line share post
        const message: IMessage = {
          _id: guidGenerator(),
          // postText: post.post ? post.post : '',
          createdAt: new Date(),
          postImage: post?.postImg ? post?.postImg : null,
          user: {
            _id: authUser.id,
            name: authUser.name + ' ' + authUser.lastName,
            avatar: authUser.imageUrl,
          },
          isSharedContent: true,
          postAuthorAvatar: post.userImageUrl,
          postAuthorId: post.userId,
          postId: post.id,
          postAuthorName: post.userName,
          postText: post.post,
          pending: false,
          sent: true,
          received: false,
        };
        console.log(message);
        const chat: {messages: IMessage[]; users: string[]; id: string}[] =
          await firestore()
            .collection('chats')
            .where('users', 'array-contains', idPair)
            .get()
            .then(querySnapshot => {
              if (querySnapshot.size) {
                return querySnapshot.docs.map(doc => {
                  return {
                    id: doc.id,
                    ...doc.data(),
                  };
                });
              } else {
                return undefined;
              }
            });
        if (chat) {
          console.warn('calisti2');

          await firestore()
            .collection('chats')
            .doc(chat?.[0]?.id)
            .set(
              {
                messages: [message, ...chat[0].messages],
              },
              {merge: true},
            );
        } else {
          console.warn('calisti3');

          firestore()
            .collection('Chats')
            .add({
              messages: [message],
              users: [authUser.id, props.userId, idPair],
            });
        }
      }
    } catch (error) {
      Alert.alert('Something went wrong', error);
      console.log(error);
    }
  }, [authUser, props.postId, props.userId, idPair]);
  React.useEffect(() => {
    if (sent) {
      let timer = setTimeout(() => {
        setSent(false);
        handleShare();
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [handleShare, sent]);

  return (
    <View style={tw`flex-1 flex-row items-center bg-white p-4`}>
      <View style={tw`flex-row flex-1`}>
        <View style={tw`flex-row flex-1 items-center`}>
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
                {props?.username}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={tw`self-center p-1.5 rounded-lg ${
            sent ? 'bg-gray-400' : `bg-[${Colors.lightPurple}]`
          }`}
          onPress={() => {
            setSent(curr => !curr);
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
