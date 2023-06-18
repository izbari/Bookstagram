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
import {
  useGetMyChatsQuery,
  useLazyGetMyChatsQuery,
} from '../../infrastructure/Service/ChatService';
import ChatItem from '../../components/Chat/ChatItem';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {useIsFocused} from '@react-navigation/native';
import {Header} from '../../components/Chat/Header';
type IChatProps = IWithNavigation<RouteNames.chat>;
export const Chat: React.FunctionComponent<IChatProps> = ({navigation}) => {
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
      <Header />
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
              lastMessageDate={item.messages[0].createdAt}
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
