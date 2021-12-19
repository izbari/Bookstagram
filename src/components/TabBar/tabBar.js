import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function MyTabBar({state, descriptors, navigation}) {
  function iconGenerator(label) {
    switch (label) {
      case 'Discover':
        return 'magnify';
      case 'Library':
        return 'bookshelf';
      case 'Store':
        return 'cart';
      case 'Chat':
        return 'forum'  

      case 'Favorites':
        return 'heart';
      case 'Profile':
        return 'account';
      case 'Home':
        return 'home';
      default:
        break;
    }
  }

  return (
    <View style={{flexDirection: 'row'}}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const icon = iconGenerator(label);
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{
              flex: 1,
              height: 50,
              justifyContent: 'flex-end',
              marginBottom: 3,
              backgroundColor: 'white',
            }}>
            <MaterialCommunityIcons
              name={icon}
              color={isFocused ? '#FF6EA1' : '#B3B3B3'}
              size={25}
              style={{alignSelf: 'center'}}
            />

            <Text
              style={{
                color: isFocused ? '#FF6EA1' : '#B3B3B3',
                alignSelf: 'center',
                fontSize: 12,
              }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
export default MyTabBar;
