import * as React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
//import I18n from 'react-native-i18n';
import Image from 'react-native-image-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {useSelector} from 'react-redux';
import {ActivityIndicator} from 'react-native-paper';

import Icon from '../components/Icons';
import tw from 'twrnc';
function OtherProfile(props) {
  const baseUser = useSelector(store => store.user.user);
  const [me, setMe] = React.useState(baseUser);
  const [user, setUser] = React.useState(null);
  const [isFallowing, setIsFallowing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const userRef = props.route.params.selectedUserId;
  React.useEffect(() => {
    console.warn('userRef', userRef);
    setLoading(true);
    database()
      .ref(`/users/${userRef}`)
      .on('value', snapshot => {
        if (snapshot?.val() !== null) {
          setUser(snapshot?.val());
          const isfollowing = Object.keys(me?.fallowing ?? {}).includes(
            snapshot.val().id,
          );
          console.warn('isfollowing', isfollowing);
          setIsFallowing(isfollowing);
        }
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    setMe(baseUser);
    const isfollowing = Object.keys(baseUser?.fallowing ?? {}).includes(
      userRef,
    );
    setIsFallowing(isfollowing);
  }, [baseUser]);

  const fallowRequest = () => {
    const authId = auth().currentUser.uid;
    let map;

    if (Object.keys(me?.fallowing ?? {}).includes(user?.id)) {
      // already fallowed and cancel fallow

      // remove from fallowers of user
      map = new Map(Object.entries(user?.fallowers ?? {}));
      map.delete(authId);
      fallowerHandler(user.id, Object.fromEntries(map));

      // remove from fallowing of me
      map = new Map(Object.entries(me?.fallowing ?? {}));
      map.delete(user.id);
      fallowingHandler(authId, Object.fromEntries(map));
      setIsFallowing(false);
    } else {
      // not fallowed and fallow

      // add to fallowers of user
      map = new Map(Object.entries(user?.fallowers ?? {}));
      map.set(authId, true); //ekleme
      fallowerHandler(user.id, Object.fromEntries(map));

      // add to fallowing of me
      map = new Map(Object.entries(me?.fallowing ?? {}));
      map.set(user.id, true);
      fallowingHandler(authId, Object.fromEntries(map));

      setIsFallowing(true);
    }
    map = null;
  };
  const fallowingHandler = (ref, map) => {
    database()
      .ref(`/users/${ref}`)
      .update({
        fallowing: map,
      })
      .then(() => console.log(`id: ${ref}  fallowing list updated.`));
  };
  const fallowerHandler = (ref, map) => {
    database()
      .ref(`/users/${ref}`)
      .update({
        fallowers: map,
      })
      .then(() => console.log(`id: ${ref} fallowers list  updated.`));
  };
  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      title:
        user?.name[0].toUpperCase() +
        user?.name.substring(1, user.name.length) +
        ' ' +
        user?.lastName[0].toUpperCase() +
        user?.lastName.substring(1, user.lastName.length),
    });
  }, [props.navigation, user]);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color="#FF6EA1" />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView>
        <View style={tw`m-4`}>
          <View style={tw`flex-row justify-evenly mb-4`}>
            <View style={tw`flex-row m-3 justify-center items-center`}>
              <View style={tw`m-3`}>
                <Text style={styles.profileStatusNumber}>
                  {user && user?.books ? user?.books.length : '-'}
                </Text>
                <Text style={styles.profileStatusText}>Books</Text>
              </View>
              <View style={tw`m-3`}>
                <Text style={styles.profileStatusNumber}>
                  {user && user?.fallowers
                    ? Object.keys(user?.fallowers).length
                    : '-'}
                </Text>
                <Text style={styles.profileStatusText}>Fallowers</Text>
              </View>
              <View style={tw`m-3`}>
                <Text style={styles.profileStatusNumber}>
                  {user && user?.fallowing
                    ? Object.keys(user?.fallowing).length
                    : '-'}
                </Text>
                <Text style={styles.profileStatusText}>Fallowing</Text>
              </View>
            </View>
            <Image
              resizeMode="contain"
              style={tw`h-22 w-22 rounded-full overflow-hidden`}
              source={{
                uri: user
                  ? user.imageUrl
                  : 'https://scontent.ftzx1-1.fna.fbcdn.net/v/t1.30497-1/c59.0.200.200a/p200x200/84628273_176159830277856_972693363922829312_n.jpg?_nc_cat=1&ccb=1-5&_nc_sid=12b3be&_nc_ohc=CxmGyQqlfmQAX-g1lo4&_nc_ht=scontent.ftzx1-1.fna&edm=AHgPADgEAAAA&oh=4403c3ccd0fc5eed2b87a0f3cfbe5198&oe=616AB239',
              }}
            />
          </View>
          <TouchableOpacity
            onPress={fallowRequest}
            style={tw`justify-center  bg-[${
              isFallowing ? '#7C74EA' : '#FF71A3'
            }] rounded-lg p-2`}>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              <Text style={tw`text-white font-bold text-center text-sm`}>
                {isFallowing ? 'Fallowing' : 'Fallow'}
              </Text>
              {isFallowing ? (
                <Ionicons name="checkmark-outline" size={15} color="white" />
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#FBFAFA'},
  text: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginLeft: 25,
  },
  menuRow: {flexDirection: 'row', backgroundColor: 'white', padding: 10},

  profileStatusNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#818182',
    textAlign: 'center',
  },

  profileStatusText: {
    fontSize: 8,
    color: '#8E8E8F',
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default OtherProfile;
