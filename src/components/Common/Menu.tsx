import {StyleProp, Text, ViewStyle} from 'react-native';
import React from 'react';
import {
  Menu,
  MenuOption,
  MenuOptionCustomStyle,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {ImageSource} from 'react-native-vector-icons/Icon';
type IMenu = {
  icon: ImageSource;
  options: {
    text: string;
    style: StyleProp<ViewStyle>;
    customStyles?: MenuOptionCustomStyle | undefined;
    handleSelect: () => void;
  }[];
};
export const ThreeDotMenu: React.FunctionComponent<IMenu> = props => {
  return (
    <Menu>
      <MenuTrigger>{props.icon}</MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {borderRadius: 4},
          optionsWrapper: {},
          optionText: {
            color: 'black',
            fontSize: 12,
            padding: 2,
          },
        }}>
        {props.options.map((option, index) => (
          <MenuOption
            customStyles={option.customStyles}
            key={index}
            onSelect={option.handleSelect}
            text={option.text}
            style={option.style}
          />
        ))}
      </MenuOptions>
    </Menu>
  );
};
