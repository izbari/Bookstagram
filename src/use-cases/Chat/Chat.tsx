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
import {useGetMyChatsQuery} from '../../infrastructure/Service/ChatService';
import ChatItem from '../../components/Chat/ChatItem';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
type IChatProps = IWithNavigation<RouteNames.chat>;
export const Chat: React.FunctionComponent<IChatProps> = ({navigation}) => {
  const authUser = useAppSelector(store => store.user.user);
  const {
    data: chats,
    refetch: refetchChats,
    isLoading,
  } = useGetMyChatsQuery(authUser?.id, {
    skip: !authUser,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(RouteNames.createChat);
            }}>
            <Ionicons name="create-outline" size={25} color="black" />
          </TouchableOpacity>
          <Menu>
            <MenuTrigger>
              <Ionicons name="ellipsis-vertical" color={'gray'} size={25} />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => alert(`Save`)} text="Save" />
              <MenuOption onSelect={() => alert('Delete')}>
                <Text style={{color: 'red'}}>Delete</Text>
              </MenuOption>
              <MenuOption
                onSelect={() => alert(`Not called`)}
                text="Disabled"
                style={tw``}
              />
            </MenuOptions>
          </Menu>
        </>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={tw`flex-1`}>
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
              messages={item.messages}
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
              onRefresh={refetchChats}
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
