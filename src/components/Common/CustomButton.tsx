import React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  PressableProps,
  View,
} from 'react-native';
interface ICustomButton extends PressableProps {}
export const CustomButton: React.FunctionComponent<ICustomButton> = props => {
  return Platform.OS === 'android' ? (
    <View style={props.style}>
      <TouchableNativeFeedback {...props} />
    </View>
  ) : (
    <TouchableOpacity {...props} />
  );
};
