import React, { useEffect} from 'react';
import {View, Text, Dimensions} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
const {width} = Dimensions.get('window');
import Loading from '../components/Loading';
import messaging from '@react-native-firebase/messaging';

import {useDispatch} from 'react-redux';

function AuthLoading(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if(user){
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onMessage(async remoteMessage => {
      console.log(
        'A new FCM message at foregroud!',
        JSON.stringify(remoteMessage),
      );
      console.log("--------------->",remoteMessage.data.targetRoute)
     
        if(remoteMessage.data.targetRoute==="ChatSingleScreen") {dispatch({type:'MESSAGE_NOTIFICATION', payload:{}});}
        else if(remoteMessage.data.targetRoute==="VideoCallScreen"){
          dispatch({type:'MESSAGE_NOTIFICATION', payload:{}});
           const {name, imageUrl, chatId, uid, targetRoute} = remoteMessage.data; 
           props.navigation.navigate('Chat', {
         screen: targetRoute,
         params: {name: name, imageUrl: imageUrl, chatId: chatId, uid: uid},
       });
        } 
    }
     
    );
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      const {name, imageUrl, chatId, uid, targetRoute} = remoteMessage.data;
      const authData = (targetRoute === 'ChatSingleScreen') ? JSON.parse(remoteMessage.data.authData) : null; 

      props.navigation.navigate('Chat', {
        screen: targetRoute,
        params: {name: name, imageUrl: imageUrl, chatId: chatId, uid: uid,authData:authData},
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
          const authData = (targetRoute === 'ChatSingleScreen') ? JSON.parse(remoteMessage.data.authData) : null; 
           
          props.navigation.navigate('Chat', {
            screen: targetRoute,
            params: {name: name, imageUrl: imageUrl, chatId: chatId, uid: uid,authData:authData},
          });
        }
      });
    }
    else{
      console.log("user yok----------------------------")
    }
    })
  }, []);
  const deneme = props?.route?.params?.deneme;
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      if (!user) {
        props.navigation.navigate('AuthProvider');
      } else {
        dbToken(user);
          if (deneme == 'Login') {
          props.navigation.replace('Main');
        } else if (deneme == 'Signup') {
          props.navigation.replace('Onboarding');
        } else if (deneme == undefined) {
          props.navigation.replace('Main');
        }
      }
    });
    return subscriber; // unsubscribe on unmount
  }, []);
  const dbToken = async (user) => {
    database()
    .ref(`/users/${user.uid}`)
    .on('value', snapshot => {
      if(!snapshot.val().notificationTokens){
        messaging().getToken().then(token => {
          if(token){
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