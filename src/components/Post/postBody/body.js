import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import Image from 'react-native-image-progress';
import {Divider} from 'react-native-paper';
const {width} = Dimensions.get('window');

const body = props => {
  return (
    <View>
      <Divider />

      <View
        style={{
          width: width * 0.9,
        }}>
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
        <Image
          style={{
            alignSelf: 'center',
            height: 400,
            width: width * 0.9,
            resizeMode: 'cover',
          }}
          source={{uri: props.item.postImg}}
        />
      ) : null}
    </View>
  );
};

export default body;
