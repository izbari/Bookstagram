import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions} from 'react-native';
import auth from '@react-native-firebase/auth';
import {useDispatch, useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
const {width} = Dimensions.get('window');
import Loading from '../components/Loading';

function App(props) {
  // Set an initializing state while Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
  console.log('user:', user);
  if (!user) {
    props.navigation.navigate('AuthProvider');
  } else {
    database()
      .ref(`/users/${user.uid}`)
      .on('value', snapshot => {
        dispatch({type: 'SET_USER', payload: {user: snapshot.val()}});
        props.navigation.navigate('HomeScreen');
        console.log(props.route.name);
      });
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
export default App;
