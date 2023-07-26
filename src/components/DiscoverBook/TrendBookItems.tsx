import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {TrendBookItem} from './TrendBookItem';
import {RouteNames} from '../navigation/RouteNames';
import {useNavigation} from '@react-navigation/native';
import {INavigationType} from '../navigation/Types';
type ITrendBookItems = {
  trending: any[];
};
export const TrendBookItems: React.FunctionComponent<
  ITrendBookItems
> = props => {
  const navigation = useNavigation<INavigationType>();
  return (
    <View>
      <Text style={tw`text-2xl font-bold text-black px-4`}>Trending Books</Text>
      <View style={tw`flex-row flex-wrap items-center justify-center`}>
        {props?.trending?.map(item => {
          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(RouteNames.bookDetail, {item})
              }>
              <TrendBookItem
                key={item.id}
                author={item.author}
                id={item.id}
                imageURL={item.imageURL}
                title={item.title}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
