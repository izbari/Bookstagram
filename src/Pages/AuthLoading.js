import React, {useEffect} from 'react';
import {View, Text, Dimensions} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
const {width} = Dimensions.get('window');
import Loading from '../components/Loading';
import messaging from '@react-native-firebase/messaging';
import PushNotification from '../controllers/notificationController';
import {useDispatch} from 'react-redux';

function AuthLoading(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onMessage(async remoteMessage => {
      console.log(
        'A new FCM message at foregroud!',
        JSON.stringify(remoteMessage),
      );
      console.log('--------------->', remoteMessage.data.targetRoute);

      if (remoteMessage.data.targetRoute === 'ChatSingleScreen') {
        dispatch({
          type: 'MESSAGE_NOTIFICATION',
          payload: {messageId: remoteMessage.data.chatId},
        });
        PushNotification.configure();
      } else if (remoteMessage.data.targetRoute === 'VideoCallScreen') {
        const {name, imageUrl, chatId, uid, targetRoute} = remoteMessage.data;
        dispatch({type: 'MESSAGE_NOTIFICATION', payload: {}});

        props.navigation.navigate('Chat', {
          screen: targetRoute,
          params: {name: name, imageUrl: imageUrl, chatId: chatId, uid: uid},
        });
      }
      return;
    });
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      const {name, imageUrl, chatId, uid, targetRoute} = remoteMessage.data;
      const authData =
        targetRoute === 'ChatSingleScreen'
          ? JSON.parse(remoteMessage.data.authData)
          : null;

      props.navigation.navigate('Chat', {
        screen: targetRoute,
        params: {
          name: name,
          imageUrl: imageUrl,
          chatId: chatId,
          uid: uid,
          authData: authData,
        },
      });
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
          const {name, imageUrl, chatId, uid, targetRoute} = remoteMessage.data;
          const authData =
            targetRoute === 'ChatSingleScreen'
              ? JSON.parse(remoteMessage.data.authData)
              : null;

          props.navigation.navigate('Chat', {
            screen: targetRoute,
            params: {
              name: name,
              imageUrl: imageUrl,
              chatId: chatId,
              uid: uid,
              authData: authData,
            },
          });
        }
      });
  }, []);
  const from = props?.route?.params?.from;
  console.log('from ', from);
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      console.warn('Auth state changed', from);
      if (!user) {
        console.log('User not logged in');
        props.navigation.replace('Onboarding');
      } else {
        dbToken(user).then(() => {
          if (from == 'Login' || from == 'Signup') {
            console.log('User login');
            props.navigation.replace('BookTab');
          } else if (from == undefined) {
            props.navigation.replace('BookTab');
          }
        });
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);
  const dbToken = async user => {
    database()
      .ref(`/users/${user.uid}`)
      .on('value', snapshot => {
        
        console.log('USER KAYDEDILMIS:', snapshot);
        if (!snapshot?.val()?.notificationTokens) {
          messaging()
            .getToken()
            .then(token => {
              if (token) {
                database()
                  .ref(`/users/${user.uid}/notificationTokens/${token}`)
                  .set(true);
              }
            });
        }
        dispatch({type: 'SET_USER', payload: {user: snapshot.val()}});
      });
  };
  return (
    <View
      style={{
        width: width,
        height: '70%',
        flex: 1,
        alignSelf: 'center',
        justifyContent: 'space-around',
      }}>
      <Loading />
      <View>
        <Text
          style={{
            fontWeight: 'bold',
            alignSelf: 'center',
            fontSize: 18,
          }}>{`Loading`}</Text>
      </View>
    </View>
  );
}
export default AuthLoading;
