import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {Divider} from 'react-native-paper';
import FastImage from 'react-native-fast-image'
const {width} = Dimensions.get('window');

const body = props => {
  return (
    <View>
      <Divider />

      <View
      >
        {props.item.post != null ? (
          <Text
            style={{
              marginLeft: 10,
              marginBottom: 5,
              padding: 5,
              color: '#333333',
            }}>
            {props.item.post}
          </Text>
        ) : (
          <View />
        )}
      </View>
      {props.item.postImg != null ? (
        <FastImage
        style={{height: 400,
          width: width * 0.9, }}
        source={{
            uri: props.item.postImg,
            priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
    />
      ) : null}
    </View>
  );
};

export default body;
