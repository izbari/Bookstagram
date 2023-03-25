import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MyTabBar from '../../components/TabBar/tabBar';
import HomeStack from '../Stacks/homeStack';
import ChatStack from '../Stacks/chatStack';
import ProfileStack from '../Stacks/profileStack';
const BookTab = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      tabBar={props => (
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
        options={{headerShown: false}}
        name="Profile"
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
};

export default BookTab;

const styles = StyleSheet.create({});
