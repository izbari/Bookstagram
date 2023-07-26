import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {RouteNames} from '../navigation/RouteNames';
import {useNavigation} from '@react-navigation/native';
import {INavigationType} from '../navigation/Types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';
export const AddCategoryButton = () => {
  const navigation = useNavigation<INavigationType>();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(RouteNames.addCategory)}
      style={tw`bg-[#44494B] rounded-full p-3 justify-center mr-1`}>
      <MaterialCommunityIcons name="plus" color="white" size={35} />
    </TouchableOpacity>
  );
};
