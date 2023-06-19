import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationParamsList} from './NavigationParamsList';
import {RouteNames} from './RouteNames';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {LandingStackNavigation as LandingStack} from './stacks/LandingStackNavigation';
import {Colors} from '../../resources/constants/Colors';
import {SearchStackNavigation} from './stacks/SearchStackNavigation';
const MainStack = createBottomTabNavigator<NavigationParamsList>();
const Blank = () => <></>;
export const MainStackNavigation: React.FunctionComponent = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
      initialRouteName={RouteNames.landing}>
      <MainStack.Screen
        name={RouteNames.landing}
        component={LandingStack}
        options={{
          headerShown: false,
        }}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="home"
              size={25}
              color={focused ? Colors.lightPurple : Colors.primaryColor}
            />
          ),
        }}
      />
      <MainStack.Screen
        name={RouteNames.createPostTab}
        component={Blank}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="add-circle-outline"
              size={25}
              color={Colors.lightPurple}
            />
          ),
        }}
        listeners={({navigation}) => ({
          focus: () => {
            navigation.navigate(RouteNames.createPost);
          },
        })}
      />
      <MainStack.Screen
        name={RouteNames.search}
        component={SearchStackNavigation}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <Ionicons
              name="search-outline"
              size={25}
              color={Colors.lightPurple}
            />
          ),
        }}
      />
    </MainStack.Navigator>
  );
};
