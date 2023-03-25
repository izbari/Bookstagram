import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import ThreeDotMenu from '../../ThreeDotMenu';
import moment from 'moment';
import auth from '@react-native-firebase/auth';
import isEqual from 'react-fast-compare';
import tw from 'twrnc';
const Header = ({item, navigation}) => {
  const toProfile = React.useCallback(
    userId => {
      if (auth().currentUser.uid === userId) {
        navigation.navigate('Profile');
      } else {
        navigation.navigate('OtherProfile', {
          selectedUserId: userId,
        });
      }
    },
    [item.userId],
  );
  return (
    <View style={tw`flex-row justify-between items-center`}>
      <TouchableOpacity
        onPress={() => toProfile(item.userId)}
        style={tw`flex-row items-center p-4`}>
        <FastImage
          style={tw`h-11 w-11 rounded-full overflow-hidden`}
          source={{
            uri: item.userImageUrl,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={tw`justify-center ml-3`}>
          <Text>{item.userName}</Text>
          <Text style={tw`text-gray-500 text-[12px]`}>
            {moment(item.postTime.toDate()).fromNow()}
          </Text>
        </View>
      </TouchableOpacity>
      <ThreeDotMenu itemId={item.id} whosePost={item.userId} />
    </View>
  );
};

export default React.memo(Header, isEqual);
