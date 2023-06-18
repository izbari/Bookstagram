import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import isEqual from 'react-fast-compare';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import tw from 'twrnc';
import {ThreeDotMenu} from '../Common/Menu';
import Ionicons from 'react-native-vector-icons/Ionicons';
interface IPostHeaderProps {
  readonly userId: string | undefined;
  readonly userImageUrl: string | undefined;
  readonly userName: string | undefined;
  readonly postTime: FirebaseFirestoreTypes.Timestamp | undefined;
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
      <View style={tw`flex-1 flex-row justify-between items-center`}>
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
        <ThreeDotMenu
          icon={
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color="black"
              style={tw`m-2`}
            />
          }
          options={[
            {
              style: tw``,
              text: 'Delete',
              handleSelect: () => {},
              customStyles: {},
            },
            {text: 'Edit', style: tw``, handleSelect: () => {}},
          ]}
        />
      </View>
    );
  },
  isEqual,
);
