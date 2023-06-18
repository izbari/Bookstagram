/* eslint-disable react-native/no-inline-styles */
import React, {useState, useCallback} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {
  GiftedChat,
  Bubble,
  IMessage,
  BubbleProps,
} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageModal from 'react-native-image-modal';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import {IWithNavigation} from '../../components/navigation/Types';
import {RouteNames} from '../../components/navigation/RouteNames';
import tw from 'twrnc';
import {Colors} from '../../resources/constants/Colors';
import {useImageAspectRatio} from '../../infrastructure/Utils/useImageAspectRatio';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
type ISingleChatProps = IWithNavigation<RouteNames.singleChat>;
export const SingleChat: React.FunctionComponent<ISingleChatProps> = ({
  navigation,
  route,
}) => {
  const authUser = useAppSelector(store => store.user.user);
  const {
    avatar: targetUserAvatar,
    chatId,
    name: targetUserName,
    targetUserId,
  } = route.params;
  const imageAspectRatio = useImageAspectRatio(targetUserAvatar);
  const authUserId = authUser?.id as string;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const idPair =
    authUserId < targetUserId
      ? authUserId + '-' + targetUserId
      : targetUserId + '-' + authUserId;
  const [currentChatId, setCurrentChatId] = useState(chatId);

  React.useEffect(() => {
    if (currentChatId) {
      const data = firestore()
        .doc('chats/' + currentChatId)
        .onSnapshot(doc => {
          setMessages(
            doc?.data()?.messages.map((message: IMessage) => ({
              ...message,
              //@ts-ignore
              pending: false,
              sent: false,
              createdAt: message.createdAt?.toDate(),
            })),
          );
        });
      return data;
    }
  }, [authUserId, currentChatId]);

  React.useEffect(() => {
    if (currentChatId && messages.length > 0) {
      let isRequired = false;
      messages.forEach(message => {
        if (authUserId !== message.user._id && !message.received) {
          isRequired = true;
        }
      });
      if (isRequired) {
        console.log('calisti');

        firestore()
          .doc('chats/' + currentChatId)
          .set(
            {
              messages: messages.map(message => ({
                ...message,
                received: authUserId !== message.user._id,
              })),
            },
            {merge: true},
          );
      } else {
        console.log('calismadi');
      }
    }
  }, [authUserId, currentChatId, idPair, messages, targetUserId]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title:
        targetUserName.length > 15
          ? targetUserName?.slice(0, 15) + '...'
          : targetUserName,

      headerStyle: {
        backgroundColor: '#FF6EA1',
      },
      headerTintColor: '#fff',

      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },
      headerShown: true,
      // eslint-disable-next-line react/no-unstable-nested-components

      // eslint-disable-next-line react/no-unstable-nested-components
      header: () => (
        <View style={tw`bg-[${Colors.lightPurple}] flex-row justify-evenly`}>
          <TouchableOpacity
            style={tw`flex-row items-center justify-center px-2 py-2`}
            onPress={() => {
              navigation.navigate(RouteNames.chat, {check: true});
            }}>
            <Ionicons name="arrow-back-outline" size={25} color="white" />

            <Image
              style={tw`w-8 h-8 ml-2 rounded-full`}
              source={{uri: targetUserAvatar}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigateProfile(targetUserId);
            }}
            style={tw`flex-1 items-center justify-center pr-4 `}>
            <Text
              style={tw`text-white font-bold text-lg`}
              numberOfLines={1}
              ellipsizeMode="tail">
              {targetUserName}
            </Text>
          </TouchableOpacity>
          <View style={tw`flex-row items-center justify-center gap-3 px-2 `}>
            <TouchableOpacity
              style={tw`justify-center`}
              onPress={() => {
                navigation.navigate('ChatScreen', {check: true});
              }}>
              <Ionicons name="call-outline" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`justify-center`}
              onPress={() => {
                navigation.navigate('VideoCallScreen', {
                  chatId: currentChatId,
                  name: targetUserName,
                  imageUrl: targetUserAvatar,
                  uid: targetUserId,
                });
              }}>
              <Ionicons name="videocam-outline" size={20} color="white" />
            </TouchableOpacity>

            <RightMenu />
          </View>
        </View>
      ),
      // eslint-disable-next-line react/no-unstable-nested-components
    });
  }, [
    currentChatId,
    navigateProfile,
    navigation,
    targetUserName,
    targetUserAvatar,
    targetUserId,
    imageAspectRatio,
  ]);
  const onSend = useCallback(
    (m: IMessage[]) => {
      const messageUsers = [authUserId, targetUserId, idPair];
      const updatedMessages = GiftedChat.append(messages, [
        {
          ...m[0],
          sent: false,
          received: false,
          pending: true,
        },
      ]);
      setMessages(updatedMessages);
      if (currentChatId) {
        firestore()
          .doc('chats/' + currentChatId)
          .set(
            {
              messages: GiftedChat.append(messages, [
                {
                  ...updatedMessages[0],
                  pending: false,
                  sent: true,
                },
              ]),
            },
            {merge: true},
          );
      } else {
        // new chat created

        firestore()
          .collection('chats')
          .add({
            messages: m,
            users: messageUsers,
          })
          .then(doc => {
            setCurrentChatId(doc.id);
          });
      }
    },
    [authUserId, currentChatId, idPair, messages, targetUserId],
  );
  const RightMenu = () => (
    <Menu>
      <MenuTrigger>
        <Ionicons name="ellipsis-vertical" color={'white'} size={20} />
      </MenuTrigger>
      <MenuOptions customStyles={tw`rounded-xl bg-red-400`}>
        <MenuOption onSelect={() => alert(`Save`)} text="Save" />
        <MenuOption onSelect={() => alert('Delete')}>
          <Text style={{color: 'red'}}>Delete</Text>
        </MenuOption>
        <MenuOption
          onSelect={() => alert('Not called')}
          text="Disabled"
          style={tw``}
        />
      </MenuOptions>
    </Menu>
  );

  const renderMessageImage = props => {
    return (
      <View
        style={{
          borderRadius: 15,
          padding: 2,
        }}>
        <ImageModal
          style={{
            width: 200,
            height: 200,
            padding: 6,
            borderRadius: 15,
          }}
          source={{uri: props.currentMessage.image}}
        />
      </View>
    );
  };
  const navigateProfile = userid => {
    authUser.id === userid
      ? navigation.navigate('Profile')
      : navigation.navigate('OtherProfile', {selectedUserId: userid});
  };

  const renderBubble = (props: BubbleProps<IMessage>) => {
    return (
      <Bubble
        {...props}
        renderCustomView={props => {
          return (
            props.currentMessage.isSharedContent && (
              <Pressable
                onPress={() =>
                  navigation.navigate(RouteNames.singlePost, {
                    id: props.currentMessage.postId,
                  })
                }
                style={{
                  borderRadius: 15,
                  padding: 5,
                }}>
                <View style={tw`flex-row items-center gap-2 `}>
                  <FastImage
                    source={{
                      uri: props.currentMessage?.postAuthorAvatar as string,
                    }}
                    style={tw`w-8 h-8 rounded-full`}
                  />
                  <Text style={tw`text-white`}>
                    {props.currentMessage?.postAuthorName}
                  </Text>
                </View>
                <Text style={tw`py-2`}>{props.currentMessage.postText}</Text>
                <ImageModal
                  style={{
                    width: 200,
                    height: 200,
                    padding: 6,
                    borderRadius: 5,
                  }}
                  source={{uri: props.currentMessage.postImage}}
                />
              </Pressable>
            )
          );
        }}
        renderTicks={thickProps => {
          return (
            authUserId === thickProps?.user?._id && (
              <View style={tw`flex-row items-center mx-2`}>
                <Text
                  style={tw`text-[10px] text-white family-sans mr-1`}
                  numberOfLines={1}
                  ellipsizeMode="tail">
                  {moment(thickProps?.createdAt).format('LT')}
                </Text>

                {thickProps?.pending ? (
                  <Ionicons
                    name="time-outline"
                    size={15}
                    color="white"
                    style={tw`ml-1`}
                  />
                ) : thickProps?.received ? (
                  <Ionicons name="checkmark-done" size={15} color="white" />
                ) : (
                  <Ionicons name="checkmark-outline" size={15} color="white" />
                )}
              </View>
            )
          );
        }}
        wrapperStyle={{
          left: {
            backgroundColor: '#fff',
          },
          right: {backgroundColor: Colors.lightPurple, padding: 5},
        }}
      />
    );
  };
  return (
    <SafeAreaView style={tw`flex-1`}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        renderTime={() => null}
        isTyping
        isLoadingEarlier
        infiniteScroll
        user={{
          _id: authUser?.id as string,
          name: authUser?.name + ' ' + authUser?.lastName,
          avatar: authUser?.imageUrl,
        }}
        showUserAvatar
        renderMessageImage={renderMessageImage}
        renderBubble={renderBubble}
        // renderLoading={() => (
        //   <View style={tw`flex-1 justify-center`}>
        //     <ActivityIndicator size="large" color="#ff6ea1" />
        //   </View>
        // )}
        onPressAvatar={user => {
          navigateProfile(user._id);
        }}
      />
    </SafeAreaView>
  );
};
