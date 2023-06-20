import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {NavigationParamsList} from '../NavigationParamsList';
import {RouteNames} from '../RouteNames';
import {DiscoverBook} from '../../../use-cases/DiscoverBook/DiscoverBook';
import {AddCategory} from '../../../use-cases/AddCategory/AddCategory';

const DiscoverBookStack = createNativeStackNavigator<NavigationParamsList>();
export const DiscoverBookStackNavigation: React.FunctionComponent = () => {
  return (
    <DiscoverBookStack.Navigator
      initialRouteName={RouteNames.discoverBook}
      screenOptions={{headerShown: false}}>
      <DiscoverBookStack.Screen
        name={RouteNames.discoverBook}
        component={DiscoverBook}
      />

      <DiscoverBookStack.Screen
        name={RouteNames.addCategory}
        component={AddCategory}
      />
    </DiscoverBookStack.Navigator>
  );
};
