import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  RefreshControl,
} from 'react-native';
import Image from 'react-native-image-progress';
import auth from '@react-native-firebase/auth';
const {width} = Dimensions.get('window');
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import moment from 'moment';
import {useSelector} from 'react-redux';
import Loading from '../components/Loading';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Chat({navigation, route}) {
  const authUser = useSelector(store => store.user);
  const [chats, setChats] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [user, setUser] = useState(authUser);
  const [loading, setLoading] = useState(false);
  const [otherUserData, setOtherUserData] = useState([]);

  //Update auth user from redux store
  useEffect(() => {
    setUser(authUser);
  }, [authUser]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('NewMessage', {myChats: otherUserData});
          }}>
          <Ionicons name="create-outline" size={25} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, loading]);

  useEffect(() => {
    setLoading(true);
    let otherUids = [];
    let otherUserData = [];

    auth().onAuthStateChanged(user => {
      firestore()
        .collection('Chats')
        .where('users', 'array-contains', user.uid)
        .onSnapshot(snapshot => {
          snapshot.docs.forEach(chat => {
            otherUids.push(chat.data().users.find(uid => uid !== user.uid));
          });
          database()
            .ref('users/')
            .once('value', snapshot => {
              snapshot.forEach(item => {
                if (otherUids.includes(item._snapshot.key)) {
                  const {id, name, lastName, imageUrl} = item._snapshot.value;

                  otherUserData.push({
                    id: id,
                    name: name,
                    lastName: lastName,
                    imageUrl: imageUrl,
                  });
                }
              });

              let result = {};
              for (let item of otherUserData) {
                let newObject = Object.assign({}, item);
                result[newObject.id] = newObject;
                delete newObject.id;
              }

              setOtherUserData(otherUserData);
              setLoading(false);
            });

          setChats(snapshot.docs);
        });
    });
  }, [, navigation, user, route?.params?.check]);

  useEffect(() => {}, [chats]);

  const ChatObject = ({item}) => {
    const willSendUid = item?._data.users?.find(
      user => user !== auth()?.currentUser.uid,
    );
    const willSendChatId = item?._ref._documentPath._parts[1];
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ChatSingleScreen', {
            name:
              otherUserData.find(user => user.id === willSendUid)?.name +
              ' ' +
              otherUserData.find(user => user.id === willSendUid)?.lastName,
            imageUrl: otherUserData.find(user => user.id === willSendUid)
              ?.imageUrl,

            uid: willSendUid,
            chatId: willSendChatId,
          })
        }
        style={{
          flexDirection: 'row',
          width: width * 0.95,
          margin: 10,
          marginBottom: 3,
          alignSelf: 'center',

          backgroundColor: 'white',
          borderRadius: 10,
          shadowColor: '#CBCBCB',
          elevation: 25,
        }}>
        <Image
          style={{
            height: 50,
            width: 50,
            resizeMode: 'contain',
            borderRadius: 50,
            overflow: 'hidden',
            elavation: 15,
            margin: 7,
          }}
          source={{
            uri: otherUserData.find(user => user.id === willSendUid)?.imageUrl,
          }}
        />
        <View style={{justifyContent: 'center', marginLeft: 10, padding: 5}}>
          <Text style={{fontWeight: 'bold'}}>
            {otherUserData.length === 0
              ? ' yok'
              : otherUserData.find(user => user.id === willSendUid)?.name}
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
              {item?._data.messages.length === 0
                ? 'No Messages Yet'
                : item?.data().messages[0].text}
            </Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={{color: 'darkgrey', fontSize: 12}}>
              {item?.data().messages.length != 0
                ? moment(item?.data().messages[0].createdAt).fromNow()
                : 'daha gelmedi'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={chats}
          //refreshControl={<RefreshControl refreshing={refreshing} onRefresh={null} />}
          renderItem={ChatObject}
          keyExtractor={item => item.id}
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
}
