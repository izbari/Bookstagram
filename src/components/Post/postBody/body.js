import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import ImageModal from 'react-native-image-modal';
import isEqual from 'react-fast-compare';
import tw from 'twrnc';
const {width} = Dimensions.get('window');

const Body = ({item}) => {
  return (
    <>
      <View>
        {!!item.post && (
          <Text style={tw`ml-2 mb-2 p-2 text-gray-800`}>{item.post}</Text>
        )}
      </View>
      {!!item.postImg && (
        <ImageModal
          resizeMode="cover"
          style={tw`h-96 w-${width * 0.9}px mx-3`}
          source={{
            uri: item.postImg,
          }}
        />
      )}
    </>
  );
};

export default React.memo(Body, isEqual);
