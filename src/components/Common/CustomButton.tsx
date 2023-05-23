import React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  PressableProps,
} from 'react-native';
interface ICustomButton extends PressableProps {}
export const CustomButton: React.FunctionComponent<ICustomButton> = props => {
  return Platform.OS === 'android' ? (
    <TouchableNativeFeedback {...props} />
  ) : (
    <TouchableOpacity {...props} />
  );
};
