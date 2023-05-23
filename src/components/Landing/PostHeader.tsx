import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import isEqual from 'react-fast-compare';
import auth from '@react-native-firebase/auth';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {INavigationType} from '../navigation/Types';
import tw from 'twrnc';

interface IPostHeaderProps {
  readonly userId: string;
  readonly userImageUrl: string;
  readonly userName: string;
  readonly postTime: FirebaseFirestoreTypes.Timestamp;
}
export const PostHeader: React.FunctionComponent<IPostHeaderProps> = React.memo(
  props => {
    // const navigation = useNavigation<INavigationType>();
    // const toProfile = React.useCallback(
    //   (userId: string) => {
    //     if (typeof auth().currentUser === 'object') {
    //       if (auth().currentUser?.uid === userId) {
    //         navigation.navigate('Profile');
    //       } else {
    //         navigation.navigate('OtherProfile', {
    //           selectedUserId: userId,
    //         });
    //       }
    //     }
    //   },
    //   [navigation],
    // );
    return (
      <View style={tw`flex-row justify-between items-center`}>
        <TouchableOpacity
          // onPress={() => toProfile(props.userId)}
          style={tw`flex-row items-center p-4`}>
          <FastImage
            style={tw`h-11 w-11 rounded-full overflow-hidden`}
            source={{
              uri: props.userImageUrl,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <View style={tw`justify-center ml-3`}>
            <Text>{props.userName}</Text>
            <Text style={tw`text-gray-500 text-[12px]`}>
              {moment(props.postTime?.toDate?.()).fromNow()}
            </Text>
          </View>
        </TouchableOpacity>
        {/* <ThreeDotMenu itemId={item.id} whosePost={item.userId} /> */}
      </View>
    );
  },
  isEqual,
);
