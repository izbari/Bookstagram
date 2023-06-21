import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Colors} from '../../resources/constants/Colors';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {INavigationType} from '../navigation/Types';
type ICommonHeader = {
  title: string;
};
const CommonHeader: React.FunctionComponent<ICommonHeader> = props => {
  const navigation = useNavigation<INavigationType>();
  return (
    <View style={tw`h-12 bg-[${Colors.lightPurple}]  justify-center`}>
      <View style={tw`w-full absolute items-center`}>
        <Text style={tw`text-xl text-white font-bold `}>{props.title}</Text>
      </View>
      <TouchableOpacity
        style={tw`pl-3`}
        onPress={navigation.canGoBack() && navigation?.goBack}>
        <Ionicons name="chevron-back" size={30} color={'white'} />
      </TouchableOpacity>
    </View>
  );
};

export default CommonHeader;

const styles = StyleSheet.create({});
