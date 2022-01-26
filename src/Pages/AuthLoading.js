import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
const {width} = Dimensions.get('window');
import Loading from '../components/Loading';
import {useDispatch,useSelector} from 'react-redux';

function AuthLoading(props) {
  console.log("AUTH LOADİNG-------------------------------")
  // Set an initializing state while Firebase connects
  const dispatch = useDispatch();

  const deneme= props?.route?.params?.deneme;
  console.log("***********************************************",deneme)
  useEffect(() => {

    const subscriber = auth().onAuthStateChanged((user)=>{
      if (!user) {
    
        props.navigation.navigate('AuthProvider');
        console.log("user yoka girdi------------------------")
    
      } else {
        console.log("user vara girdi-----------------------",deneme)

        database()
        .ref(`/users/${user.uid}`)
        .on('value', snapshot => {
          dispatch({type: 'SET_USER', payload: {user: snapshot.val()}});
        });

        if(deneme == 'Login'){
          
          props.navigation.replace('Main');
        }else if(deneme == 'Signup'){
          props.navigation.replace('Onboarding');
        }else if(deneme == undefined){
          props.navigation.replace('Main');
        }

    };
  });
    return subscriber; // unsubscribe on unmount
  }, []); 
  
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