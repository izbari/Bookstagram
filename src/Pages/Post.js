import React from 'react';
import {View, Text} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const Post = () => {
  return (
    <SkeletonPlaceholder>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{width: 60, height: 60, borderRadius: 50}} />
        <View style={{marginLeft: 20}}>
          <View style={{width: 120, height: 20, borderRadius: 4}} />
          <View
            style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
          />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default Post;
