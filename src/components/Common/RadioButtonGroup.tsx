import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import tw from 'twrnc';
import {Colors} from '../../resources/constants/Colors';
interface IRadioButtonGroupProps {
  options: Array<any>;
  onChange: (val: any) => void;
  value: any;
}
const RadioButtonGroup: React.FunctionComponent<
  IRadioButtonGroupProps
> = props => {
  return (
    <View style={tw`flex-row justify-around`}>
      {props.options.map((item, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => props.onChange(item.value)}
            style={tw`flex-row items-center`}>
            <View
              style={tw`h-6 w-6  rounded-full border-2 border-[${Colors.darkPurple}] mr-2 items-center justify-center`}>
              {props.value === item.value ? (
                <View
                  style={tw`h-4 w-4 bg-[${Colors.darkPurple}] rounded-full`}
                />
              ) : null}
            </View>
            <Text style={tw`text-base`}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default RadioButtonGroup;
