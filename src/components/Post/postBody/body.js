import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {Divider} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
const {width} = Dimensions.get('window');

 const Body = React.memo(({item}) => (
   
    <View>
      <Divider />

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
        <FastImage
          style={{height: 400, width: width * 0.9}}
          source={{
            uri: item.postImg,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
      ) : null}
    </View>
  )
);
export default Body;