import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import Icon from '../../components/Icons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function MyTabBar({state, descriptors, navigation}) {
  // const messageBadge = useSelector(store => store.messageBadge);
  const messageBadge = 0;
  const insets = useSafeAreaInsets();

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
        'ChangeStack;';
    }
  }

  const changeStackPress = () => {
    const location = state.routeNames.includes('Discover')
      ? 'BookTab'
      : 'SocialMediaTab';
    navigation.navigate(location);
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingBottom: insets.bottom,
      }}>
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
          <>
            <TouchableOpacity
              key={Math.random()}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={[
                styles.bottomButton,
                {
                  borderBottomColor: isFocused ? '#FF6EA1' : 'transparent',
                },
              ]}>
              {route.name == 'Chat' ? (
                <View style={styles.withBadgeWrapper}>
                  {messageBadge != 0 && (
                    <View style={styles.badgeWrapper}>
                      <Text style={styles.badge}>{messageBadge.length}</Text>
                    </View>
                  )}
                </View>
              ) : null}

              <Icon
                name={icon}
                fill={isFocused ? '#FF6EA1' : '#B3B3B3'}
                size={25}
                style={styles.center}
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
            {state.routes.length - 1 === index && (
              <TouchableOpacity
                onPress={changeStackPress}
                style={styles.changeStackBtn}>
                <Ionicons
                  name={'repeat-outline'}
                  size={30}
                  style={styles.center}
                  color="#B3B3B3"
                />

                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: i18n.language == 'tr' ? 10 : 12,
                    color: '#B3B3B3',
                  }}>
                  {state.routeNames.includes('Discover')
                    ? 'Social Media'
                    : 'Book Store'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  badgeWrapper: {
    position: 'absolute',
    bottom: -10,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#FF6EA1',
  },
  badge: {
    backgroundColor: 'transparent',
    alignSelf: 'center',
    color: 'white',
    fontFamily: 'white',
    fontWeight: '300',
    marginTop: 1,
    fontSize: 12,
  },
  bottomButton: {
    flex: 1,
    height: 50,
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    borderBottomWidth: 3,
  },
  withBadgeWrapper: {
    zIndex: 1,
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  center: {alignSelf: 'center'},
  changeStackBtn: {
    flex: 1,
    height: 50,
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    borderBottomColor: 'transparent',
    borderBottomWidth: 3,
  },
});
export default MyTabBar;
