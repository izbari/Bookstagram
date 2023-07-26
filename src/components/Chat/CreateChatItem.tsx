/* eslint-disable react-native/no-inline-styles */
import {View, Text, TouchableOpacity, Image, Dimensions} from 'react-native';
import React from 'react';
import {INavigationType} from '../navigation/Types';
import {useNavigation} from '@react-navigation/native';
import {RouteNames} from '../navigation/RouteNames';
import {ChatItemSkeleton} from './ChatItemSkeleton';
import {useGetChatUserByIdQuery} from '../../infrastructure/Service/ChatService';
import {useAppSelector} from '../../infrastructure/Redux/Hooks';
import firestore from '@react-native-firebase/firestore';
const {width} = Dimensions.get('window');
type ICreateChatItemProps = {
  id: string;
};
const CreateChatItem: React.FunctionComponent<ICreateChatItemProps> = props => {
  const navigation = useNavigation<INavigationType>();
  const authUser = useAppSelector(state => state.user.user);
  const [chatId, setChatId] = React.useState('');
  const {
    data: user,
    isLoading,
    isError,
  } = useGetChatUserByIdQuery(props.id, {
    skip: !props.id,
  });
  React.useEffect(() => {
    const targetUserId = user?.id;
    const authUserId = authUser?.id;
    const idPair =
      authUserId < targetUserId
        ? authUserId + '-' + targetUserId
        : targetUserId + '-' + authUserId;
    if (!isError && user?.id) {
      firestore()
        .collection('chats')
        .where('users', 'array-contains', idPair)
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
            setChatId(doc.id);
          });
        });
    }
  }, [authUser?.id, isError, user?.id]);
  if (isError) {
    return <Text>Something went wrong</Text>;
  }
  return isLoading ? (
    <ChatItemSkeleton />
  ) : (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(RouteNames.singleChat, {
          name: user?.name + ' ' + user?.lastName,
          avatar: user?.imageUrl,
          targetUserId: props?.id,
          chatId: chatId ?? undefined,
        });
      }}
      style={[
        {
          flexDirection: 'row',
          width: width * 0.95,
          margin: 10,
          marginBottom: 3,
          alignSelf: 'center',

          backgroundColor: 'white',
          borderRadius: 10,
          shadowColor: '#CBCBCB',
          elevation: 25,
        },
      ]}>
      <Image
        style={{
          height: 50,
          width: 50,
          resizeMode: 'contain',
          borderRadius: 50,
          overflow: 'hidden',
          margin: 7,
        }}
        source={{uri: user?.imageUrl ?? ''}}
      />

      <View style={{justifyContent: 'center', marginLeft: 10, padding: 5}}>
        <Text style={{fontWeight: 'bold'}}>
          {user?.name + ' ' + user?.lastName}
        </Text>
        <View
          style={{flexDirection: 'row', width: width - (width * 0.05 + 90)}}>
          <Text
            numberOfLines={1}
            style={{
              fontStyle: 'italic',
              fontSize: 12,
              color: 'grey',
              marginTop: 5,
            }}>
            {user?.username ?? "User's cool bio..."}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CreateChatItem;
