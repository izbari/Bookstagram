import {View} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import tw from 'twrnc';
export const ChatItemSkeleton: React.FunctionComponent = () => {
  return (
    <SkeletonPlaceholder>
      <View
        style={tw`flex-row h-18 items-center bg-white rounded-lg p-2 m-2`}
      />
    </SkeletonPlaceholder>
  );
};
