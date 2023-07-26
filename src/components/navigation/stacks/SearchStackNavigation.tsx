import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RouteNames} from '../RouteNames';
import {NavigationParamsList} from '../NavigationParamsList';
import {Search} from '../../../use-cases/Search/Search';
import {BookDetail} from '../../../use-cases/BookDetail/BookDetail';
const SearchStack = createNativeStackNavigator<NavigationParamsList>();
export const SearchStackNavigation: React.FunctionComponent = () => {
  return (
    <SearchStack.Navigator
      screenOptions={{headerShown: false, animation: 'slide_from_left'}}>
      <SearchStack.Screen name={RouteNames.search} component={Search} />
      <SearchStack.Screen name={RouteNames.bookDetail} component={BookDetail} />
    </SearchStack.Navigator>
  );
};
