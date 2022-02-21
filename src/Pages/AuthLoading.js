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
      console.warn(snapshot.val().notificationTokens);
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
