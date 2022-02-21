import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import ImageModal from "react-native-image-modal"
import isEqual from 'react-fast-compare';
const {width} = Dimensions.get('window');

const Body = ({item}) => {
  return (
    <View>
      <View>
        {item.post != null ? (
          <Text
            style={{
              marginLeft: 10,
              marginBottom: 5,
              padding: 5,
              color: '#333333',
            }}>
            {item.post}
          </Text>
        ) : (
          <View />
        )}
      </View>
      {item.postImg != null ? (
        <ImageModal
          resizeMode="contain"
          style={{height: 400, width: width * 0.9, resizeMode: 'cover'}}
          source={{
            uri: item.postImg,
          }}
        />
      ) : null}
    </View>
  );
};

export default React.memo(Body, isEqual);
