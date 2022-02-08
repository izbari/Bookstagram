import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

import Icon from '../../components/Icons';

import {useTranslation} from 'react-i18next';

function MyTabBar({state, descriptors, navigation}) {
  const {i18n, t} = useTranslation();
  function iconGenerator(label) {
    switch (label) {
      case 'Discover':
        return 'Search';
      case 'Library':
        return 'Library';
      case 'Store':
        return 'Card';
      case 'Chat':
        return 'Message';

      case 'Favorites':
        return 'FilledLike';
      case 'Profile':
        return 'User';
      case 'Home':
        return 'Home';
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
        options.tabBarBadge = 3;
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
            key={index}
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
              backgroundColor: 'white',
              borderBottomColor: isFocused ? '#FF6EA1' : 'transparent',
              borderBottomWidth: 3,
            }}>
            {route.name == 'Chat' ? 
                <View
                style={{
                  zIndex: 1,
                  flex: 1,
                  alignSelf: "stretch",
                  justifyContent: "space-around",
                  alignItems: "center"
                }}
              >
               
                  <View
                    style={{
                      position: "absolute",
                      bottom: -10,
                      right: 8,
                      width: 18,
                      height: 18,
                      borderRadius: 10,
                      backgroundColor: '#FF6EA1'
                    }}
                  >
                    <Text
                      style={{
                        backgroundColor: "transparent",
                        alignSelf: "center",
                        color: "white",
                        fontFamily: 'white',
                        fontWeight: "300",
                        marginTop: 1,
                        fontSize: 12
                      }}
                    >
                      {2}
                    </Text>
                  </View>
                
              </View>: null}
            
            <Icon
              name={icon}
              fill={isFocused ? '#FF6EA1' : '#B3B3B3'}
              size={25}
              style={{alignSelf: 'center'}}
            />
            <Text
              style={{
                color: isFocused ? '#FF6EA1' : '#B3B3B3',
                alignSelf: 'center',
                fontSize: i18n.language == 'tr' ? 10 : 12,
              }}>
              {t(`navigate:${label}`)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
export default MyTabBar;
