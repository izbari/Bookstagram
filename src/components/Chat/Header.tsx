import {StatusBar, Text, View} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {Colors} from '../../resources/constants/Colors';
import {getStatusBarHeight} from 'react-native-status-bar-height';
export const Header = () => {
  return (
    <View
      style={[
        tw` bg-[${Colors.lightPurple}] justify-center items-center`,
        {height: getStatusBarHeight() * 2},
      ]}>
      <Text style={tw`text-white font-bold`}>Messages</Text>
    </View>
  );
};
