import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NavigationParamsList} from '../NavigationParamsList';
import {RouteNames} from '../RouteNames';
import {DiscoverBook} from '../../../use-cases/DiscoverBook/DiscoverBook';

const BookStack = createBottomTabNavigator<NavigationParamsList>();
export const BookStackNavigation: React.FunctionComponent = () => {
  return (
    <BookStack.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      initialRouteName={RouteNames.discoverBook}>
      <BookStack.Screen
        name={RouteNames.landing}
        component={DiscoverBook}
        options={{
          headerShown: false,
        }}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="earth-outline"
              size={25}
              color={focused ? Colors.lightPurple : Colors.primaryColor}
            />
          ),
        }}
      />
    </BookStack.Navigator>
  );
};
