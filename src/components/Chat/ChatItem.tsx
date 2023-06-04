import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Image from 'react-native-fast-image';
import {INavigationType} from '../navigation/Types';
import {useNavigation} from '@react-navigation/native';
import {RouteNames} from '../navigation/RouteNames';
import moment from 'moment';
import {useGetChatUserByIdQuery} from '../../infrastructure/Service/ChatService';
import {ChatItemSkeleton} from './ChatItemSkeleton';
import tw from 'twrnc';
interface IChatItemProps {
  targetUserId: string;
  lastMessage: string;
  lastMessageDate: string;
  chatId: string;
}
const ChatItem: React.FunctionComponent<IChatItemProps> = props => {
  const navigation = useNavigation<INavigationType>();
  const {data: chatUser, isLoading} = useGetChatUserByIdQuery(
    props.targetUserId,
    {
      skip: !props.targetUserId,
    },
  );
  const handleItemPress = () => {
    navigation.navigate(RouteNames.singleChat, {
      name: chatUser.name + ' ' + chatUser.lastName,
      avatar: chatUser.imageUrl,
      targetUserId: chatUser.id,
      chatId: props.chatId,
    });
  };

  return (
    <View style={tw`flex-1`}>
      {isLoading ? (
        <ChatItemSkeleton />
      ) : (
        <TouchableOpacity
          onPress={handleItemPress}
          style={tw`flex-1 flex-row items-center bg-white rounded-lg p-2 m-2`}>
          <Image
            resizeMode="contain"
            style={tw`h-12 w-12 rounded-full`}
            source={{
              uri: chatUser?.imageUrl,
            }}
          />
          <View style={tw`flex-1 justify-center ml-2 p-1`}>
            <Text style={tw`font-semibold`}>
              {chatUser.name + ' ' + chatUser.lastName}
            </Text>
            <View style={tw`flex-1 flex-row pt-1`}>
              <Text
                numberOfLines={1}
                style={tw`text-gray-500 pt-0.5 pb-1 text-xs italic`}>
                {props.lastMessage}
              </Text>
            </View>
            <View style={tw`items-end flex-1 self-end`}>
              <Text style={tw`text-xs text-gray-400 italic`}>
                {moment(props.lastMessageDate).fromNow()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ChatItem;
