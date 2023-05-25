import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../resources/constants/Colors';
interface ICheckboxProps {
  checked: boolean;
  onPress: () => void;
}
export const Checkbox: React.FunctionComponent<ICheckboxProps> = props => {
  return (
    <TouchableOpacity
      style={tw`h-4 w-4 border-gray-400 border`}
      onPress={props.onPress}>
      {props.checked ? (
        <View style={tw`flex-1 bg-[${Colors.lightPurple}] justify-center`}>
          <Ionicons name="checkmark-outline" size={14} color={'#fff'} />
        </View>
      ) : null}
    </TouchableOpacity>
  );
};
