import React from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MyTabBar from '../../components/TabBar/tabBar';
import ProfileStack from '../Stacks/profileStack';
import StoreStack from '../Stacks/storeStack';
import LibraryStack from '../Stacks/libraryStack';
import DiscoverStack from '../Stacks/discoverStack';

const SocialMediaTab = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      tabBar={props => (
        <MyTabBar {...props} ScreenOptions={{tabBarHideOnKeyboard: true}} />
      )}
      options={{headerShown: false}}>
      <Tab.Screen
        options={{headerShown: false}}
        name="Discover"
        component={DiscoverStack}
      />
      <Tab.Screen
        options={{headerShown: false}}
        name="Library"
        component={LibraryStack}
      />
      <Tab.Screen
        options={{
          headerTitleAlign: 'center',
          title: 'Store',
          headerStyle: {
            backgroundColor: '#FF6EA1',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }}
        name="Store"
        component={StoreStack}
      />

      <Tab.Screen
        options={{headerShown: false}}
        name="Profile"
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
};

export default SocialMediaTab;

const styles = StyleSheet.create({});
