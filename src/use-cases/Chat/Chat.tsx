/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import {IWithNavigation} from '../../components/navigation/Types';
import {RouteNames} from '../../components/navigation/RouteNames';
import {useLazyGetMyChatsQuery} from '../../infrastructure/Service/ChatService';
import ChatItem from '../../components/Chat/ChatItem';

import {useIsFocused} from '@react-navigation/native';
import CommonHeader from '../../components/Common/CommonHeader';
type IChatProps = IWithNavigation<RouteNames.chat>;
export const Chat: React.FunctionComponent<IChatProps> = props => {
  const authUser = useAppSelector(store => store.user.user);
  const isFocused = useIsFocused();
  const [fetchChats, {data: chats, isLoading}] = useLazyGetMyChatsQuery();

  React.useEffect(() => {
    if (isFocused) {
      fetchChats(authUser?.id);
    }
  }, [authUser?.id, fetchChats, isFocused]);
  return (
    <SafeAreaView style={tw`flex-1`}>
      <CommonHeader
        right={
          <TouchableOpacity
            style={tw`absolute right-3 top-1 p-2`}
            onPress={() => props.navigation.navigate(RouteNames.createChat)}>
            <Ionicons name="create-outline" size={23} color="white" />
          </TouchableOpacity>
        }
        title={'Messages'}
      />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={chats}
          renderItem={({item}) => (
            <ChatItem
              key={item.id}
              targetUserId={item.targetUserId}
              chatId={item.id}
              lastMessage={item.messages[0].text}
              isSharedContent={!!item.messages[0].isSharedContent}
              lastMessageDate={item.messages[0].createdAt}
              isLastMessageFromMe={item.messages[0].user._id === authUser?.id}
            />
          )}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              title="Pull to refresh"
              tintColor="#FF6EA1"
              titleColor="grey"
              colors={['#FF6EA1']}
              refreshing={isLoading}
              onRefresh={() => fetchChats(authUser?.id)}
            />
          }
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                margin: 15,
                marginTop: 100,
              }}>
              <Text style={{fontStyle: 'italic', fontSize: 16}}>
                You have no messages.
              </Text>
              <Text style={{fontStyle: 'italic', fontSize: 14}}>
                To create click top right icon
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};
