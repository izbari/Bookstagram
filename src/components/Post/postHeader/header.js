import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import ThreeDotMenu from '../../ThreeDotMenu';
import moment from 'moment';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import isEqual from "react-fast-compare";

const Header = ({item,navigation}) => {
  const [user, setUser] = React.useState({});

  React.useEffect(async () => {
    
    const singleUserData = await database()
      .ref(`/users/${item.userId}`)
      .once('value')
      .then(snapshot => {
        setUser(snapshot.val());
      });
      return ()=> singleUserData()
  }, [item.userId]);
  const toProfile = React.useCallback((userId) => {
    if (auth().currentUser.uid === userId) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('OtherProfile', {selectedUserId: userId});
    }
  }, [user]);


  console.log("header",);
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() =>toProfile(user.id)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
        }}>
        <FastImage
          style={{
            height: 45,
            width: 45,
            borderRadius: 50,
            overflow: 'hidden',
            elavation: 5,
          }}
          source={{
            uri: user ? user.imageUrl : null,
            priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.contain}
        />
        <View
          style={{
            justifyContent: 'center',
            marginLeft: 10,
          }}>
          <Text>{user.name + ' ' + user.lastName}</Text>
          <Text style={{color: 'grey', fontSize: 12}}>
            {moment(item.postTime.toDate()).fromNow()}
          </Text>
        </View>
      </TouchableOpacity>

      <ThreeDotMenu  itemId = {item.id} whosePost={item.userId} />
    </View>
  );
};

export default React.memo(Header,isEqual);
