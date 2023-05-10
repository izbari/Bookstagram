import React from 'react';
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  PressableProps,
} from 'react-native';
interface ICustomButton extends PressableProps {
  chidren?: React.ReactNode;
}
export const CustomButton: React.FunctionComponent<ICustomButton> = props => {
  const {children, ...rest} = props;
  const Touchable =
    Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

  return (
    <Touchable
      {...rest}
      background={
        Platform.OS === 'android'
          ? TouchableNativeFeedback.SelectableBackground()
          : null
      }>
      {children}
    </Touchable>
  );
};
