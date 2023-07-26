import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {NavigationParamsList} from '../NavigationParamsList';
import {RouteNames} from '../RouteNames';
import {DiscoverBook} from '../../../use-cases/DiscoverBook/DiscoverBook';
import {AddCategory} from '../../../use-cases/AddCategory/AddCategory';
import {BookDetail} from '../../../use-cases/BookDetail/BookDetail';

const DiscoverBookStack = createNativeStackNavigator<NavigationParamsList>();
export const DiscoverBookStackNavigation: React.FunctionComponent = () => {
  return (
    <DiscoverBookStack.Navigator
      initialRouteName={RouteNames.discoverBook}
      screenOptions={{headerShown: false, animation: 'slide_from_left'}}>
      <DiscoverBookStack.Screen
        name={RouteNames.discoverBook}
        component={DiscoverBook}
      />

      <DiscoverBookStack.Screen
        name={RouteNames.addCategory}
        component={AddCategory}
      />
      <DiscoverBookStack.Screen
        name={RouteNames.bookDetail}
        component={BookDetail}
      />
    </DiscoverBookStack.Navigator>
  );
};
