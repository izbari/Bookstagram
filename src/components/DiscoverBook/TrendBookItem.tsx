import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Image from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {RouteNames} from '../navigation/RouteNames';
import {INavigationType} from '../navigation/Types';
type ITrendBookItem = {
  id: string;
  imageURL: string;
  title: string;
  author: string;
};
export const TrendBookItem: React.FunctionComponent<ITrendBookItem> = props => {
  const navigation = useNavigation<INavigationType>();
  return (
    <View style={{height: 180, width: 100, margin: 10, marginBottom: 15}}>
      <Image
        source={{uri: props?.imageURL?.replace('http', 'https')}}
        style={{
          height: 150,
          width: 100,
          borderRadius: 5,
        }}
      />
      <Text
        numberOfLines={2}
        style={{color: 'black', fontSize: 14, alignSelf: 'center'}}>
        {props.title}
      </Text>
      <Text
        numberOfLines={1}
        style={{alignSelf: 'center', color: '#A1A1A1', fontSize: 8}}>
        by {props.author}
      </Text>
    </View>
  );
};
