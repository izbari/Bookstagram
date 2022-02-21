import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import ThreeDotMenu from '../../ThreeDotMenu';
import moment from 'moment';
import auth from '@react-native-firebase/auth';
import isEqual from "react-fast-compare";

const Header = ({item,navigation}) => {

  const toProfile = React.useCallback((userId) => {
    if (auth().currentUser.uid === userId) {
      navigation.navigate('Profile');
    } else {
      navigation.navigate('OtherProfile', {selectedUserId: userId});
    }
  }, [item.userId]);


  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() =>toProfile(item.userId)}
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
            uri: item.userImageUrl,
            priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.contain}
        />
        <View
          style={{
            justifyContent: 'center',
            marginLeft: 10,
          }}>
          <Text>{item.userName}</Text>
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
