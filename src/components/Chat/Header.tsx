import {StatusBar, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {Colors} from '../../resources/constants/Colors';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {INavigationType} from '../navigation/Types';
import {RouteNames} from '../navigation/RouteNames';
type IHeader = {
  readonly navigation: INavigationType;
};
export const Header: React.FunctionComponent<IHeader> = props => {
  return (
    <View
      style={[
        tw` bg-[${Colors.lightPurple}] justify-between flex-row items-center px-4 `,
        {height: getStatusBarHeight() * 2.2},
      ]}>
      <View style={tw`items-center justify-center absolute w-full`}>
        <Text style={tw`text-white font-bold`}>Messages</Text>
      </View>
      <TouchableOpacity
        onPress={props.navigation.canGoBack() && props.navigation.goBack}>
        <Ionicons name="chevron-back-outline" size={25} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.navigation.navigate(RouteNames.createChat)}>
        <Ionicons name="chatbox-ellipses-outline" size={23} color="white" />
      </TouchableOpacity>
    </View>
  );
};
