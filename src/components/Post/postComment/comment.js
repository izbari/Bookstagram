import React from 'react';
import {Text, View, TouchableOpacity, Dimensions} from 'react-native';
import Image from 'react-native-image-progress';
import ThreeDotMenu from '../../ThreeDotMenu';
const {width} = Dimensions.get('window');

import moment from 'moment';

const Comment = ({item}) => {
    
  return (
    <View style={{flexDirection: 'row', width: width, marginVertical: 10,marginLeft:15,padding:10}}>
      <Image
        style={{
          height: 40,
          width: 40,
          resizeMode: 'contain',
          borderRadius: 50,
          overflow: 'hidden',
          elavation: 5,
          marginRight: 7,
        }}
        source={{
          uri: item.img,
        }}
      />
      <View>
        <View
          style={{
            backgroundColor: '#E4E6E9',
            borderRadius: 20,
            width: width * 0.75,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontWeight: 'bold', padding: 10, paddingBottom: 2}}>
              {item.name}
            </Text>
            <ThreeDotMenu comment={true}/>
          </View>

          <View style={{padding: 15, paddingTop: 0, paddingLeft: 10}}>
            <Text>{item.comment}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 10,
            width: 200,
            padding: 5,
          }}>
          <Text style={{color: 'grey', fontSize: 12}}>
            {moment(item.postTime.toDate()).fromNow()}
          </Text>
          <TouchableOpacity>
            <Text style={{color: 'grey', fontSize: 12, fontWeight: 'bold'}}>
              Like
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{color: 'grey', fontSize: 12, fontWeight: 'bold'}}>
              Reply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Comment;
