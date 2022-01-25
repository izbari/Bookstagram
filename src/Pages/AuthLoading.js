import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
const {width} = Dimensions.get('window');
import Loading from '../components/Loading';
import {useDispatch,useSelector} from 'react-redux';

function AuthLoading(props) {
  console.log("AUTH LOADİNG................")
  // Set an initializing state while Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const prevRoute = useSelector(store => store.routeName);
useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  
  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  

  if (initializing) return null;

  if (!user) {
    console.log("reduxtan gelen :", prevRoute)

    props.navigation.navigate('AuthProvider');
    console.log("asdasd11asd")

  } else {
    database()
    .ref(`/users/${user.uid}`)
    .on('value', snapshot => {
      dispatch({type: 'SET_USER', payload: {user: snapshot.val()}});
    });
    console.log("reduxtan gelen :", prevRoute)
    if(prevRoute == 'Login'){
      props.navigation.replace('Main');
    }else if(prevRoute == 'Signup'){
      props.navigation.replace('Onboarding');
    }else if(prevRoute == 'null'){
      props.navigation.replace('Main');
    }
   
  }

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
