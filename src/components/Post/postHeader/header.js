import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import Image from 'react-native-image-progress';
import ThreeDotMenu from '../../ThreeDotMenu';
import moment from 'moment';
import database from '@react-native-firebase/database';

const Header = props => {
  const [user, setUser] = React.useState({});


  React.useEffect(async () => {

    const singleUserData = await database()
      .ref(`/users/${props.item.userId}`)
      .once('value')
      .then(snapshot => {
        setUser(snapshot.val());
      });
      return singleUserData
  }, [props.item.userId]);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() => props.toProfile(user.id)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
        }}>
        <Image
          style={{
            height: 45,
            width: 45,
            resizeMode: 'contain',
            borderRadius: 50,
            overflow: 'hidden',
            elavation: 5,
          }}
          source={{
            uri: user ? user.imageUrl : defaultImageUrl,
          }}
        />
        <View
          style={{
            justifyContent: 'center',
            marginLeft: 10,
          }}>
          <Text>{user.name + ' ' + user.lastName}</Text>
          <Text style={{color: 'grey', fontSize: 12}}>
            {moment(props.item.postTime.toDate()).fromNow()}
          </Text>
        </View>
      </TouchableOpacity>

      <ThreeDotMenu  itemId = {props.item.id} whosePost={props.item.userId} onSave={props.onSave} onDelete={props.onDelete} />
    </View>
  );
};

export default Header;
