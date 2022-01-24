import React, {useState, useCallback} from 'react';
import {TouchableOpacity, View,Button,Text} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Image from 'react-native-image-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ThreeDotMenu from '../components/ThreeDotMenu/ThreeDotMenu'
import { Avatar, Card, Menu, Provider as PaperProvider } from 'react-native-paper';

export default function ChatSingleScreen({navigation, route}) {
  const [messages, setMessages] = useState([]);
  const {uid, chatId} = route.params;
  const [currentChatId, setCurrentChatId] = useState(chatId);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.name.length > 15 ? route.params.name.slice(0,15) +"..." : route.params.name ,
      
      headerStyle: {
        backgroundColor: '#FF6EA1',
        
      },
      headerTintColor: '#fff',
      
    
        headerTitleStyle: {
          fontWeight:'bold',
          fontSize:25
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
              navigation.navigate('OtherProfile', {selectedUserId: uid});
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
        <View style={{flexDirection: 'row', justifyContent: 'space-between',width: 100}}>
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
              navigation.navigate('ChatScreen', {check: true});
            }}>
            <Ionicons name="videocam-outline" size={20} color="white" />
          </TouchableOpacity>
          
          
          <RightMenu ></RightMenu>
        </View>
      ),
    });
  }, [navigation]);

  React.useEffect(() => {
    firestore()
      .doc('Chats/' + currentChatId)
      .onSnapshot(doc => {
        setMessages(
          doc?.data()?.messages.map(message => ({
            ...message,
            createdAt: message.createdAt.toDate(),
          })),
        );
      });
  }, [chatId, currentChatId]);




  const onSend = useCallback(
    (m = []) => {
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
        <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={<TouchableOpacity   hitSlop={{top: 20, bottom: 20, left: 50, right: 50}} style={{width:20,height:20}} title='dot' onPress={openMenu}>           
             <Ionicons name="ellipsis-vertical-outline" size={20} color="white" />
            </TouchableOpacity>}>
            <Menu.Item onPress={() => {}} title="Item 1" />
            <Menu.Item onPress={() => {}} title="Item 2" />
          </Menu>
      );
    }
  return (
    <View style={{flex:1}}>
            <GiftedChat
      messages={messages}
      onSend={text => onSend(text)}
      user={{
        _id: auth().currentUser.uid,
      }}
    />
    </View>
  );
}