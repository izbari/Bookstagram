/**
 * todos:
 * 1- In this screen need to be add functionality to menu items.
 * 2- audio call and video call will add using webRTC.
 * 3- maybe setting screen can add and in this screen may includes notification options , theme , media ...
 */

import React, {useState, useCallback} from 'react';
import {TouchableOpacity, View, ActivityIndicator, Text} from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Image from 'react-native-image-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import ImageModal from 'react-native-image-modal';
import {Menu, Divider} from 'react-native-paper';

export default function ChatSingleScreen({navigation, route}) {
  const authUser = useSelector(store => store.user);
  const [messages, setMessages] = useState([]);
  const {name, imageUrl, uid, chatId} = route.params;
  const [currentChatId, setCurrentChatId] = useState(chatId);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title:
        route.params.name.length > 15
          ? route.params.name.slice(0, 15) + '...'
          : route.params.name,

      headerStyle: {
        backgroundColor: '#FF6EA1',
      },
      headerTintColor: '#fff',

      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
      },

      headerLeft: () => (
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={() => {
              navigation.navigate('ChatScreen', {check: true});
            }}>
            <Ionicons name="arrow-back-outline" size={25} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigateProfile(route.params.uid);
            }}>
            <Image
              style={{
                height: 35,
                width: 35,
                resizeMode: 'contain',
                borderRadius: 50,
                overflow: 'hidden',
                elavation: 15,
                margin: 7,
                marginRight: 15,
              }}
              source={{uri: route.params.imageUrl}}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 100,
          }}>
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={() => {
              navigation.navigate('ChatScreen', {check: true});
            }}>
            <Ionicons name="call-outline" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{justifyContent: 'center'}}
            onPress={() => {
              navigation.navigate('VideoCallScreen', {
                chatId: currentChatId,
                name: name,
                imageUrl: imageUrl,
                uid: uid,
              });
            }}>
            <Ionicons name="videocam-outline" size={20} color="white" />
          </TouchableOpacity>

          <RightMenu />
        </View>
      ),
    });
  }, [navigation]);

  React.useEffect(() => {
    const data = firestore()
      .doc('Chats/' + currentChatId)
      .onSnapshot(doc => {
        setMessages(
          doc?.data()?.messages.map(message => ({
            ...message,
            createdAt: message.createdAt.toDate(),
          })),
        );
      });
    return data;
  }, [chatId, currentChatId]);

  const onSend = useCallback(
    (m = []) => {
    // her message payloadına sent: true, received: true bu eklecek ona gore goruldu ayarlanacak thick style verilcek...
      if (currentChatId != 'null') {
        firestore()
          .doc('Chats/' + currentChatId)
          .set({messages: GiftedChat.append(messages, m)}, {merge: true});
      } else {
        // new chat created
        let idPair =
          auth().currentUser.uid < uid
            ? auth().currentUser.uid + '-' + uid
            : uid + '-' + auth().currentUser.uid;

        firestore()
          .collection('Chats')
          .add({
            messages: m,
            users: [auth().currentUser.uid, uid, idPair],
          })
          .then(doc => {
            setCurrentChatId(doc._documentPath._parts[1]);
          });
      }
    },
    [chatId, currentChatId, messages],
  );
  const RightMenu = () => {
    const [visible, setVisible] = React.useState(false);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Menu
          style={{width: '50%'}}
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity
              style={{width: 20, height: 20}}
              title="dot"
              onPress={openMenu}>
              <Ionicons
                name="ellipsis-vertical-outline"
                size={20}
                color="white"
              />
            </TouchableOpacity>
          }>
          <Menu.Item
            icon="delete"
            onPress={() => {}}
            title="Clear Chat"
            titleStyle={{fontSize: 14}}
          />
          <Divider />
          <Menu.Item
            icon="cog"
            onPress={() => {}}
            title="Settings"
            titleStyle={{fontSize: 14}}
          />
        </Menu>
      </View>
    );
  };

  const renderMessageImage = props => {
    return (
      <View
        style={{
          borderRadius: 15,
          padding: 2,
        }}>
        <ImageModal
          resizeMode="contain"
          style={{
            width: 200,
            height: 200,
            padding: 6,
            borderRadius: 15,
            resizeMode: 'cover',
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

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#fff',
          },
          right: {backgroundColor: '#ff6ea1'},
        }}
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      <GiftedChat
        messages={messages}
        onSend={text => onSend(text)}
        user={{
          _id: authUser != null ? authUser.id : route.params.authData.id,
          name:
            authUser != null
              ? authUser.name + ' ' + authUser.lastName
              : route.params.authData.name +
                ' ' +
                route.params.authData.lastName,
          avatar:
            authUser != null
              ? authUser.imageUrl
              : route.params.authData.imageUrl,
        }}
        showUserAvatar
        useNativeDriver={true}
        renderMessageImage={renderMessageImage}
        renderBubble={renderBubble}
        renderLoading={() => (
          <View style={{flex: 1, justifyContent: 'center'}}>
            <ActivityIndicator size="large" color="#ff6ea1" />
          </View>
        )}
        onPressAvatar={user => {
          navigateProfile(user._id);
        }}
        renderTicks={() => (
          <View style={{justifyContent:'center'}}>
            <Text>✔✔</Text>
          </View>
        )}
      />
    </View>
  );
}
