import React, {useState, useCallback, useEffect} from 'react';
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
export default function Chat(props) {
  const authUser = useSelector(store => store.user);
  const [chats, setChats] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [user, setUser] = useState(authUser);
    const [otherUserData, setOtherUserData] = useState([]);

  useEffect(() => {
    setUser(authUser);
  }, [authUser]);

  useEffect(() => {
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

          otherUids.forEach((doc, index) => {
            //console.log(index,"->",doc);
          });

          database()
            .ref('users/')
            .once('value', snapshot => {
              snapshot.forEach(item => {
                // it will pass through all your snapshot items

                console.log('heyyy', item._snapshot.key);
                if (otherUids.includes(item._snapshot.key)) {
                  const {id,name,lastName,imageUrl} = item._snapshot.value;
                    otherUserData.push({
                      id: id,
                      name: name,
                      lastName: lastName,
                      imageUrl: imageUrl,
                    });
                  
                }
              });
            });

          console.log("***********",otherUserData);
          setChats(snapshot.docs);
                    setOtherUserData(otherUserData);

        });
    });
  }, [user,user.uid]);

  useEffect(() => {}, [chats]);

  const ChatObject = ({item}) => {
    const willSendUid = item?._data.users?.find(
      user => user !== auth()?.currentUser.uid,
    );
    console.log("linkk:",otherUserData.find(user=>user.id === willSendUid))
    const willSendChatId = item?._ref._documentPath._parts[1];
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('ChatSingleScreen', {
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
            uri: otherUserData.find(user=>user.id === willSendUid)?.imageUrl,
          }}
        />
        <View style={{justifyContent: 'center', marginLeft: 10, padding: 5}}>
          <Text style={{fontWeight: 'bold'}}>
            {otherUserData.find(user=>user.id === item?._data?.users.find(uid => uid !== auth()?.currentUser.uid)) ?
            otherUserData.find(user=>user.id === item?._data?.users.find(uid => uid !== auth()?.currentUser.uid)).name : " yok"}
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
                : item?.data().messages[0]}
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
      <FlatList
        data={chats}
        //refreshControl={<RefreshControl refreshing={refreshing} onRefresh={null} />}
        renderItem={ChatObject}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View
            style={{flex: 1, alignItems: 'center', margin: 15, marginTop: 100}}>
            <Text style={{fontStyle: 'italic', fontSize: 16}}>
              You have no messages.
            </Text>
            <Text style={{fontStyle: 'italic', fontSize: 14}}>
              To create click top right icon
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
