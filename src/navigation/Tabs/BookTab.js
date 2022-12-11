import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MyTabBar from '../../components/TabBar/tabBar';
import HomeStack from '../Stacks/homeStack';
import ChatStack from '../Stacks/chatStack';
import FavoriteStack from '../Stacks/favoriteStack';
const BookTab = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator  tabBar={props => (
      <MyTabBar {...props} ScreenOptions={{tabBarHideOnKeyboard: true}} />
    )}
    options={{headerShown: false}}>
      <Tab.Screen
        options={{headerShown: false}}
        name="Home"
        component={HomeStack}
      />
      <Tab.Screen
        options={{headerShown: false}}
        name="Chat"
        component={ChatStack}
      />
      <Tab.Screen
        options={{
          headerTitleAlign: 'center',
          title: 'Favorites',
          headerStyle: {
            backgroundColor: '#FF6EA1',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }}
        name="Favorites"
        component={FavoriteStack}
      />
    </Tab.Navigator>
  );
};

export default BookTab;

const styles = StyleSheet.create({});
