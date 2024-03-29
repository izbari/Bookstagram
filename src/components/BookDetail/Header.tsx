import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import {useNavigation} from '@react-navigation/native';
import {INavigationType} from '../navigation/Types';
type IHeader = {
  title: string;
  handleLike: () => void;
  isLiked: boolean;
  onShare: () => void;
  setRead: (read: boolean) => void;
};
export const Header: React.FunctionComponent<IHeader> = props => {
  const navigation = useNavigation<INavigationType>();

  return (
    <View style={tw` flex-row gap-2 h-10 justify-end items-center px-4`}>
      <TouchableOpacity
        style={tw`flex-0.25`}
        onPress={() => {
          navigation.canGoBack() && navigation.goBack();
          props.setRead(false);
        }}>
        <Ionicons
          name={'chevron-back-outline'}
          // name={list.includes(book) ? 'heart' : 'heart-outline'}
          size={30}
          color="#fff"
        />
      </TouchableOpacity>
      <View style={tw`flex-1 justify-center h-[100%]`}>
        <Text
          ellipsizeMode="tail"
          numberOfLines={2}
          style={tw`text-white text-center font-semibold z-4 `}>
          {props.title}
        </Text>
      </View>
      <View style={tw`flex-0.25 flex-row justify-end gap-x-2`}>
        <TouchableOpacity onPress={props.handleLike} style={tw``}>
          <Ionicons
            name={props.isLiked ? 'heart' : 'heart-outline'}
            // name={list.includes(book) ? 'heart' : 'heart-outline'}
            size={25}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={props.onShare} style={tw``}>
          <Ionicons name="share-outline" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
