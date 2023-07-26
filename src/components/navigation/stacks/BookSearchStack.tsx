import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {NavigationParamsList} from '../NavigationParamsList';
import {RouteNames} from '../RouteNames';
import {BookSearch} from '../../../use-cases/BookSearch/BookSearch';

const BookSearchStack = createNativeStackNavigator<NavigationParamsList>();
export const BookSearchStackNavigation: React.FunctionComponent = () => {
  return (
    <BookSearchStack.Navigator
      initialRouteName={RouteNames.searchBook}
      screenOptions={{headerShown: false, animation: 'slide_from_left'}}>
      <BookSearchStack.Screen
        name={RouteNames.searchBook}
        component={BookSearch}
      />
    </BookSearchStack.Navigator>
  );
};
